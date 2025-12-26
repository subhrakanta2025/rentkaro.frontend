import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) { toast.error('Please fill in all required fields'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (!agreed) { toast.error('Please agree to the terms and conditions'); return; }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone);
    if (error) { toast.error(error.message || 'Registration failed'); setIsLoading(false); return; }
    toast.success('Account created! Please verify the OTP we emailed.');
    navigate('/activate-account', { state: { email: formData.email } });
  };

  const benefits = ['Book bikes & cars instantly', 'Manage all your bookings', 'Get exclusive offers', 'Track rental history'];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary"><Car className="h-6 w-6 text-primary-foreground" /></div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Join RentKaro and start renting today</p>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {benefits.map((benefit) => (<div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-success" />{benefit}</div>))}
          </div>
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="name" className="flex items-center gap-2 mb-2"><User className="h-4 w-4 text-muted-foreground" />Full Name</Label><Input id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} /></div>
              <div><Label htmlFor="email" className="flex items-center gap-2 mb-2"><Mail className="h-4 w-4 text-muted-foreground" />Email Address</Label><Input id="email" name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} /></div>
              <div><Label htmlFor="phone" className="flex items-center gap-2 mb-2"><Phone className="h-4 w-4 text-muted-foreground" />Phone Number</Label><Input id="phone" name="phone" type="tel" placeholder="10-digit phone number" value={formData.phone} onChange={(e) => { const value = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData({ ...formData, phone: value }); }} /></div>
              <div><Label htmlFor="password" className="flex items-center gap-2 mb-2"><Lock className="h-4 w-4 text-muted-foreground" />Password</Label><div className="relative"><Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
              <div><Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2"><Lock className="h-4 w-4 text-muted-foreground" />Confirm Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} /></div>
              <div className="flex items-start gap-2"><input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /><label htmlFor="terms" className="text-sm text-muted-foreground">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></label></div>
              <Button type="submit" variant="hero" size="lg" className="w-full gap-2 mt-2" disabled={isLoading}>{isLoading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />Creating account...</>) : (<>Create Account<ArrowRight className="h-4 w-4" /></>)}</Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
