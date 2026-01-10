import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import VehiclesPage from "./pages/VehiclesPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import BookingPage from "./pages/BookingPage";
import NewBookingPage from "./pages/NewBookingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AgenciesPage from "./pages/AgenciesPage";
import KYCVerificationPage from "./pages/KYCVerificationPage";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import BookingsPage from "./pages/dashboard/BookingsPage";
import SettingsProfile from "./pages/dashboard/SettingsProfile";
import SettingsNotifications from "./pages/dashboard/SettingsNotifications";
import AgencyDashboardPage from "./pages/AgencyDashboardPage";
import AgencyRegisterPage from "./pages/AgencyRegisterPage";
import AgencySetupPage from "./pages/AgencySetupPage";
import AgencyKYCPage from "./pages/AgencyKYCPage";
import AgencyEditPage from "./pages/AgencyEditPage";
import AddVehiclePage from "./pages/AddVehiclePage";
import MyVehiclesPage from "./pages/MyVehiclesPage";
import AgencyBookingsPage from "./pages/AgencyBookingsPage";
import AgencyEarningsPage from "./pages/AgencyEarningsPage";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";
import RefundPage from "./pages/RefundPage";
import SafetyPage from "./pages/SafetyPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

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
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
