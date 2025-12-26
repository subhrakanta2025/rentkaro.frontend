import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'agency' | 'admin';
  requireKYC?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireKYC }: ProtectedRouteProps) {
  const { user, userRole, isKYCVerified, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { 
    path: location.pathname, 
    requiredRole, 
    userRole, 
    user: !!user,
    isLoading 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const hasAgencyAccess = requiredRole === 'agency' && Boolean(user?.canListVehicles || userRole === 'agency');
    const hasRole = userRole === requiredRole || hasAgencyAccess;

    if (!hasRole) {
      const dashboardPath = userRole === 'agency' ? '/agency/dashboard' : '/dashboard';
      return <Navigate to={dashboardPath} replace />;
    }
  }

  if (requireKYC && !isKYCVerified) {
    return <Navigate to="/kyc-verification" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
