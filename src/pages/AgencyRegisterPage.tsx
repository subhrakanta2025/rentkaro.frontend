import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { APP_FAVICON_PATH } from '@/lib/logo';

export default function AgencyRegisterPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    agencyName: '',
    city: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
    gstNumber: '',
  });
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [businessPhoto, setBusinessPhoto] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setVerifiedEmail('');
      setOtp('');
      setShowOtp(false);
    }
    setFormData({ ...formData, [name]: value });
  };

  // Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your business email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Call backend to send OTP
      const response = await apiClient.post<any>('/auth/send-otp-email', {
        email: formData.email.toLowerCase().trim(),
      });
      
      if (response.message) {
        setShowOtp(true);
        toast.success('OTP sent to your email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<any>('/auth/verify-email-otp', {
        email: formData.email.toLowerCase().trim(),
        otp: otp,
      });
      
      if (response.verified) {
        toast.success('Email verified successfully!');
        setVerifiedEmail(formData.email);
        setShowOtp(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Submit full form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactName || !formData.email || !formData.phone || !formData.agencyName || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (verifiedEmail !== formData.email) {
      toast.error('Please verify your email first');
      return;
    }

    if (!formData.gstNumber || !gstDoc || !businessPhoto) {
      toast.error('Please provide GST number and upload required documents');
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('agencyName', formData.agencyName);
      fd.append('businessType', 'individual');
      fd.append('agencyEmail', formData.email);
      fd.append('agencyPhone', formData.phone);
      fd.append('city', formData.city);
      fd.append('state', formData.state);
      fd.append('address', formData.address);
      if (formData.latitude) fd.append('latitude', formData.latitude);
      if (formData.longitude) fd.append('longitude', formData.longitude);
      fd.append('description', formData.description);
      fd.append('gstNumber', formData.gstNumber);
      fd.append('registrationNumber', formData.gstNumber);
      if (gstDoc) fd.append('gstDoc', gstDoc);
      if (businessPhoto) fd.append('businessPhoto', businessPhoto);

      await apiClient.post('/agencies', fd);
      await refreshProfile();

      toast.success('Agency registered successfully');
      navigate('/dashboard/settings/profile');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Basic Details', 'Location', 'Compliance'];

  return (
    <DashboardLayout title="Register Agency" description="Register your vehicle rental agency">
      <div className="container-dashboard">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={APP_FAVICON_PATH} alt="RentKaro" className="mx-auto h-12 w-auto object-contain" />
            <h1 className="text-2xl font-bold text-foreground">Partner with RentKaro</h1>
            <p className="mt-2 text-muted-foreground">
              Register as a rental agency and grow your business
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6 flex items-center justify-center gap-3">
            {steps.map((label, idx) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    idx === step ? 'bg-primary text-primary-foreground border-primary' : idx < step ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  {idx < step ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <span className="text-muted-foreground">{label}</span>
                {idx < steps.length - 1 && <div className="w-10 border-t border-dashed border-border" />}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            {/* Main Registration Form */}
            <form onSubmit={verifiedEmail === formData.email ? handleSubmit : handleSendOTP} className="space-y-6">

              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Contact Person Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Business Email <span className="text-destructive">*</span>
                      {verifiedEmail === formData.email && (
                        <CheckCircle className="h-4 w-4 text-success ml-auto" />
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="agency@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {verifiedEmail !== formData.email && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendOTP}
                          disabled={isLoading || !formData.email}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>

                  {showOtp && verifiedEmail !== formData.email && (
                    <div>
                      <Label htmlFor="otp" className="mb-2 block">
                        Enter OTP <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="otp"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="text-center text-xl tracking-widest font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleVerifyOTP}
                          disabled={isLoading || otp.length !== 6}
                        >
                          Verify OTP
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: value });
                      }}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agencyName" className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Agency Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="agencyName"
                      name="agencyName"
                      placeholder="e.g., City Bike Rentals"
                      value={formData.agencyName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="e.g., Hyderabad"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="mb-2 block">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="e.g., Telangana"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="mb-2 block">Full Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Shop/Office address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude" className="mb-2 block">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        placeholder="17.3850"
                        value={formData.latitude}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="mb-2 block">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        placeholder="78.4867"
                        value={formData.longitude}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-2 block">Business Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your agency..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gstNumber" className="flex items-center gap-2 mb-2">
                      GST Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gstNumber"
                      name="gstNumber"
                      placeholder="Enter GST number"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">GST Certificate <span className="text-destructive">*</span></Label>
                      <Input type="file" accept="image/*,application/pdf" onChange={(e) => setGstDoc(e.target.files?.[0] || null)} />
                      {gstDoc && <p className="text-xs text-muted-foreground">Selected: {gstDoc.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">Business Photo <span className="text-destructive">*</span></Label>
                      <Input type="file" accept="image/*" onChange={(e) => setBusinessPhoto(e.target.files?.[0] || null)} />
                      {businessPhoto && <p className="text-xs text-muted-foreground">Selected: {businessPhoto.name}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => (s > 0 ? (s - 1) as 0 | 1 | 2 : s))}>
                  Back
                </Button>
                {step < 2 ? (
                  <Button type="button" onClick={() => setStep((s) => (s < 2 ? (s + 1) as 0 | 1 | 2 : s))}>
                    Next
                  </Button>
                ) : (
                  verifiedEmail === formData.email ? (
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Register as Agency'}
                    </Button>
                  ) : (
                    <div className="text-sm text-amber-600 bg-amber-50 rounded p-3 text-center w-full">
                      Verify your email first to continue
                    </div>
                  )
                )}
              </div>

            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
