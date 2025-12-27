import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import { Mail, RefreshCw } from 'lucide-react';
import { APP_FAVICON_PATH } from '@/lib/logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.forgotPassword(email.trim());
      toast.success('If this email exists, a reset link was sent. Check your inbox.');
      setCanResend(true);
    } catch (error: any) {
      const message = error?.message || error?.error || 'Unable to start password reset';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error('Enter the email used during the first request');
      return;
    }
    setIsResending(true);
    try {
      await apiClient.resendPasswordReset(email.trim());
      toast.success('A new reset link was sent to your email');
    } catch (error: any) {
      const message = error?.message || error?.error || 'Unable to resend reset OTP';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-6">
            <img src={APP_FAVICON_PATH} alt="RentKaro" className="mx-auto h-12 w-auto object-contain" />
            <h1 className="mt-3 text-2xl font-bold text-foreground">Forgot your password?</h1>
            <p className="mt-1 text-muted-foreground">Enter your account email and we'll send you a secure reset link.</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending code...' : 'Send reset code'}
              </Button>
            </form>

            {canResend && (
              <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
                <p>Didn't receive the email?</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  disabled={isResending}
                  onClick={handleResend}
                >
                  {isResending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Resend link
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have the link? Open it from your inbox to finish resetting.
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
