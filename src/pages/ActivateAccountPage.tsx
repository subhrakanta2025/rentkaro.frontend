import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ActivateAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activateAccount, resendOTP } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const suggestedEmail = (location.state as { email?: string } | null)?.email;
    if (suggestedEmail) {
      setEmail(suggestedEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp || otp.length !== 6) {
      toast.error('Enter your email and the 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    const { error } = await activateAccount(email.trim(), otp);
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || 'Could not activate account');
      return;
    }

    toast.success('Account activated! You can sign in now.');
    navigate('/login', { replace: true, state: { activatedEmail: email.trim() } });
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Enter your email to resend the OTP');
      return;
    }

    setIsResending(true);
    const { error } = await resendOTP(email.trim());
    setIsResending(false);

    if (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } else {
      toast.success('We sent a fresh OTP to your inbox');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Activate your account</h1>
            <p className="mt-2 text-muted-foreground">Enter the OTP we emailed to finish setting up your account.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-card space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-3">6-digit OTP</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
                  containerClassName="justify-between"
                >
                  <InputOTPGroup className="flex justify-between w-full">
                    {[0, 1, 2, 3, 4, 5].map((slot) => (
                      <InputOTPSlot key={slot} index={slot} className="text-lg font-semibold" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Confirm & Activate
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-primary font-medium disabled:opacity-60"
                onClick={handleResendOTP}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resend OTP
                  </>
                )}
              </button>
              <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
