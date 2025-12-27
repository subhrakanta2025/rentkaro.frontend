import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import { LockKeyhole, RefreshCw } from 'lucide-react';
import { APP_FAVICON_PATH } from '@/lib/logo';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') ?? '').trim();
  const normalizedToken = useMemo(() => token.replace(/\s+/g, ''), [token]);
  const decodedEmail = useMemo(() => {
    if (!normalizedToken) return null;
    try {
      const base64 = normalizedToken.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(atob(base64 + padding));
      return payload?.email || null;
    } catch (error) {
      console.error('Unable to decode reset token', error);
      return null;
    }
  }, [normalizedToken]);
  const missingToken = !normalizedToken;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (missingToken) {
      toast.error('Reset link is invalid or expired. Please request a new one.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.resetPassword({ token: normalizedToken, password });
      toast.success('Password reset successful! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      const message = error?.message || error?.error || 'Unable to reset password';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!decodedEmail) {
      toast.error('Unable to identify your account. Please request a new reset link.');
      return;
    }

    setIsResending(true);
    try {
      await apiClient.resendPasswordReset(decodedEmail);
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
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-6">
            <img src={APP_FAVICON_PATH} alt="RentKaro" className="mx-auto h-12 w-auto object-contain" />
            <h1 className="mt-3 text-2xl font-bold text-foreground">Reset your password</h1>
            <p className="mt-1 text-muted-foreground">
              Follow the secure link from your email and choose a new password.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            {missingToken ? (
              <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                This reset link is invalid or has expired. Please head back to the forgot password page and request a new email.
              </div>
            ) : (
              <div className="mb-6 rounded-lg border border-muted/40 bg-muted/10 p-4 text-sm">
                <p className="text-muted-foreground">Resetting password for</p>
                <p className="font-semibold text-foreground">{decodedEmail ?? 'your account'}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  We automatically applied the secure details from your email link.
                </p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting || missingToken}>
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
              <p>Need a new link?</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
                disabled={isResending || !decodedEmail}
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

            <div className="mt-4 text-center text-xs text-muted-foreground">
              If this link was opened accidentally, you can safely ignore it.
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
              Need to start over?{' '}
              <Link to="/forgot-password" className="text-primary font-medium hover:underline">
                Request a new reset email
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
