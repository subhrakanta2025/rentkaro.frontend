import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Bike, Info, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { APP_FAVICON_PATH } from '@/lib/logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resendOTP, user, userRole, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingActivationEmail, setPendingActivationEmail] = useState<string | null>(null);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';
  const isFromAgencyRegister = from === '/agency/register';

  useEffect(() => {
    if (!authLoading && user) {
      if (userRole === 'agency') {
        navigate('/agency/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, userRole, navigate, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setPendingActivationEmail(null);
    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      const message = (error?.message || error?.error || 'Invalid email or password') as string;
      toast.error(message);
      if (message.toLowerCase().includes('activate') || message.toLowerCase().includes('otp')) {
        setPendingActivationEmail(email);
      }
      setIsLoading(false);
      return;
    }

    toast.success('Welcome back!');
    // Navigation will happen via useEffect when user state updates
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-6">
            <img src={APP_FAVICON_PATH} alt="RentKaro" className="mx-auto h-12 w-auto object-contain" />
            <h1 className="mt-3 text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-muted-foreground">Sign in to your RentKaro account</p>
          </div>

          {isFromAgencyRegister && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <Bike className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Want to list your vehicle?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please login or create an account first to register as a rental partner and start listing your vehicles.
                </p>
              </div>
            </div>
          )}

          {pendingActivationEmail && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-yellow-900">Account activation required</p>
                    <p className="text-sm text-yellow-800">
                      We sent a 6-digit OTP to <span className="font-medium">{pendingActivationEmail}</span>. Please activate your account to continue.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-yellow-400 text-yellow-900 hover:bg-yellow-100"
                    disabled={isResendingOTP}
                    onClick={async () => {
                      if (!pendingActivationEmail) return;
                      try {
                        setIsResendingOTP(true);
                        const { error } = await resendOTP(pendingActivationEmail);
                        if (error) {
                          toast.error(error.message || 'Failed to resend OTP');
                        } else {
                          toast.success('Activation OTP sent successfully');
                        }
                      } catch (error) {
                        console.error('Resend OTP error:', error);
                        toast.error('Something went wrong while resending OTP');
                      } finally {
                        setIsResendingOTP(false);
                      }
                    }}
                  >
                    {isResendingOTP ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-yellow-800">
                    Already have the code?{' '}
                    <Link
                      to="/activate-account"
                      state={{ email: pendingActivationEmail }}
                      className="font-semibold underline"
                    >
                      Enter OTP here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right text-sm">
                <Link to="/forgot-password" className="text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />Signing in...</>
                ) : (
                  <>Sign In<ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Are you a rental agency? <Link to="/agency/register" className="text-primary font-medium hover:underline">Partner with us</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
