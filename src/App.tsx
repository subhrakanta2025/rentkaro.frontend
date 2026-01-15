import { lazy, Suspense, Component, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Error Boundary to catch runtime errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Critical path - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical routes
const VehiclesPage = lazy(() => import("./pages/VehiclesPage"));
const VehicleDetailPage = lazy(() => import("./pages/VehicleDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const NewBookingPage = lazy(() => import("./pages/NewBookingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ActivateAccountPage = lazy(() => import("./pages/ActivateAccountPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const AgenciesPage = lazy(() => import("./pages/AgenciesPage"));
const KYCVerificationPage = lazy(() => import("./pages/KYCVerificationPage"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const BookingsPage = lazy(() => import("./pages/dashboard/BookingsPage"));
const SettingsProfile = lazy(() => import("./pages/dashboard/SettingsProfile"));
const SettingsNotifications = lazy(() => import("./pages/dashboard/SettingsNotifications"));
const AgencyDashboardPage = lazy(() => import("./pages/AgencyDashboardPage"));
const AgencyRegisterPage = lazy(() => import("./pages/AgencyRegisterPage"));
const AgencySetupPage = lazy(() => import("./pages/AgencySetupPage"));
const AgencyKYCPage = lazy(() => import("./pages/AgencyKYCPage"));
const AgencyEditPage = lazy(() => import("./pages/AgencyEditPage"));
const AddVehiclePage = lazy(() => import("./pages/AddVehiclePage"));
const MyVehiclesPage = lazy(() => import("./pages/MyVehiclesPage"));
const AgencyBookingsPage = lazy(() => import("./pages/AgencyBookingsPage"));
const AgencyEarningsPage = lazy(() => import("./pages/AgencyEarningsPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const BookingConfirmationPage = lazy(() => import("./pages/BookingConfirmationPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const RefundPage = lazy(() => import("./pages/RefundPage"));
const SafetyPage = lazy(() => import("./pages/SafetyPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/new-booking/:id" element={<ProtectedRoute><NewBookingPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate-account" element={<ActivateAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/agencies" element={<AgenciesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          {/* Make KYC accessible without redirecting home */}
          <Route path="/kyc-verification" element={<KYCVerificationPage />} />
          
          {/* Customer Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/bookings/upcoming" element={<Navigate to="/dashboard/bookings" replace />} />
          <Route path="/dashboard/bookings/history" element={<Navigate to="/dashboard/bookings" replace />} />
          <Route path="/dashboard/settings/profile" element={<ProtectedRoute><SettingsProfile /></ProtectedRoute>} />
          <Route path="/dashboard/settings/notifications" element={<ProtectedRoute><SettingsNotifications /></ProtectedRoute>} />
          
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
          
          {/* Agency Routes */}
          <Route path="/agency/register" element={<ProtectedRoute><AgencyRegisterPage /></ProtectedRoute>} />
          <Route path="/agency/setup" element={<ProtectedRoute><AgencySetupPage /></ProtectedRoute>} />
          <Route path="/agency/kyc" element={<ProtectedRoute><AgencyKYCPage /></ProtectedRoute>} />
          <Route path="/agency/edit/:id" element={<ProtectedRoute requiredRole="agency"><AgencyEditPage /></ProtectedRoute>} />
          <Route path="/agency/dashboard" element={<ProtectedRoute requiredRole="agency"><AgencyDashboardPage /></ProtectedRoute>} />
          <Route path="/agency/my-vehicles" element={<ProtectedRoute requiredRole="agency"><MyVehiclesPage /></ProtectedRoute>} />
          <Route path="/agency/bookings" element={<ProtectedRoute requiredRole="agency"><AgencyBookingsPage /></ProtectedRoute>} />
          <Route path="/agency/earnings" element={<ProtectedRoute requiredRole="agency"><AgencyEarningsPage /></ProtectedRoute>} />
          <Route path="/agency/add-vehicle" element={<ProtectedRoute requiredRole="agency"><AddVehiclePage /></ProtectedRoute>} />
          <Route path="/agency/edit-vehicle/:id" element={<ProtectedRoute requiredRole="agency"><AddVehiclePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
