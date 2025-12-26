import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, differenceInDays } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  Shield,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';

type BookingStep = 'details' | 'customer' | 'kyc';

const fallbackVehicleImage = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=600&fit=crop';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isKYCVerified, kycStatus } = useAuth();

  const { data: vehicleResponse, isLoading: isVehicleLoading, isError: isVehicleError, refetch } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => apiClient.getVehicle(id || ''),
    enabled: Boolean(id),
  });

  const vehicle = vehicleResponse?.vehicle;

  const [step, setStep] = useState<BookingStep>('details');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState('10:00');
  const [pickupLocation, setPickupLocation] = useState('agency');

  // Customer details - pre-fill from profile
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setCustomerName(profile.fullName || '');
      setCustomerEmail(profile.email || user?.email || '');
      setCustomerPhone(profile.phone || '');
    }
  }, [profile, user]);

  if (isVehicleLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="container py-16">
          <div className="mx-auto max-w-2xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 rounded-lg bg-muted" />
              <div className="h-6 w-32 rounded-lg bg-muted" />
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isVehicleError || !vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Vehicle not found</h1>
          <p className="text-muted-foreground">We could not load this vehicle right now.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => refetch()}>Retry</Button>
            <Link to="/vehicles">
              <Button>Browse All Vehicles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  const totalDays = Math.max(1, differenceInDays(endDateTime, startDateTime));

  const rentalCost = totalDays * (vehicle.dailyRate || 0);
  const serviceFee = Math.round(rentalCost * 0.05);
  const deliveryFee = pickupLocation === 'delivery' ? 100 : 0;
  const totalAmount = rentalCost + serviceFee + deliveryFee;

  const vehicleName = `${vehicle.make} ${vehicle.model}`.trim();
  const vehicleImage = vehicle.images?.find((img: any) => img.isPrimary)?.imageUrl 
    || vehicle.images?.[0]?.imageUrl 
    || fallbackVehicleImage;
  const pickupLabel = pickupLocation === 'agency'
    ? (vehicle.location || 'Agency pickup')
    : 'Home Delivery';

  const steps = [
    { id: 'details', label: 'Rental Details' },
    { id: 'customer', label: 'Your Details' },
    { id: 'kyc', label: 'KYC & Payment' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const handleContinue = () => {
    if (step === 'details') {
      if (endDateTime <= startDateTime) {
        toast.error('End date must be after start date');
        return;
      }
      setStep('customer');
    } else if (step === 'customer') {
      if (!customerName || !customerEmail || !customerPhone) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
      if (!/^\d{10}$/.test(customerPhone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
      setStep('kyc');
    } else if (step === 'kyc') {
      // Check KYC status and redirect accordingly
      if (!isKYCVerified) {
        navigate('/kyc-verification', {
          state: {
            from: {
              pathname: '/payment',
              state: {
                vehicleId: vehicle.id,
                vehicleName,
                startDate: `${startDate}T${startTime}`,
                endDate: `${endDate}T${endTime}`,
                pickupLocation: pickupLabel,
                dropoffLocation: pickupLabel,
                totalAmount,
                rentalCost,
                serviceFee,
                dailyRate: vehicle.dailyRate,
                securityDeposit: vehicle.securityDeposit,
                customerName,
                customerEmail,
                customerPhone,
                agencyId: vehicle.agencyId,
              },
            },
          },
        });
      } else {
        // KYC is verified, go directly to payment
        navigate('/payment', {
          state: {
            vehicleId: vehicle.id,
            vehicleName,
            startDate: `${startDate}T${startTime}`,
            endDate: `${endDate}T${endTime}`,
            pickupLocation: pickupLabel,
            dropoffLocation: pickupLabel,
            totalAmount,
            rentalCost,
            serviceFee,
            dailyRate: vehicle.dailyRate,
            securityDeposit: vehicle.securityDeposit,
            customerName,
            customerEmail,
            customerPhone,
            agencyId: vehicle.agencyId,
          },
        });
      }
    }
  };

  const handleBack = () => {
    if (step === 'customer') setStep('details');
    else if (step === 'kyc') setStep('customer');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
          <span>/</span>
          <Link to={`/vehicles/${vehicle.id}`} className="hover:text-foreground">{vehicleName}</Link>
          <span>/</span>
          <span className="text-foreground">Booking</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                      index < currentStepIndex
                        ? "bg-success text-success-foreground"
                        : index === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-16 sm:w-24 mx-2",
                      index < currentStepIndex ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              {step === 'details' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Select Rental Duration
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="startDate" className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Pickup Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime" className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Pickup Time
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="endDate" className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Return Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime" className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Return Time
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="mt-6">
                    <Label className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Pickup Location
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        className={cn(
                          "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors",
                          pickupLocation === 'agency'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setPickupLocation('agency')}
                      >
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          pickupLocation === 'agency' ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {pickupLocation === 'agency' && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Pickup from Agency</p>
                          <p className="text-sm text-muted-foreground">{vehicle.location || 'Pickup location shared after confirmation'}</p>
                        </div>
                      </button>
                      <button
                        className={cn(
                          "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors",
                          pickupLocation === 'delivery'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setPickupLocation('delivery')}
                      >
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          pickupLocation === 'delivery' ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {pickupLocation === 'delivery' && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Home Delivery</p>
                          <p className="text-sm text-muted-foreground">+₹100 delivery fee</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'customer' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Enter Your Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit phone number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Documents Required at Pickup</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Valid Driving License (matching vehicle type) and Government ID proof
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'kyc' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    KYC Verification & Payment
                  </h2>

                  <div className={cn(
                    "p-4 rounded-lg border mb-6",
                    isKYCVerified 
                      ? "bg-success/5 border-success/20" 
                      : "bg-warning/5 border-warning/20"
                  )}>
                    <div className="flex items-start gap-3">
                      <Shield className={cn("h-5 w-5 mt-0.5", isKYCVerified ? "text-success" : "text-warning")} />
                      <div>
                        <p className="font-medium text-foreground">
                          {isKYCVerified ? 'KYC Verified ✓' : 'KYC Verification Required'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isKYCVerified 
                            ? 'Your Aadhaar and Driving License are verified. You can proceed to payment.' 
                            : 'DigiLocker verification of Aadhaar and Driving License is mandatory before payment.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {kycStatus && (
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm text-muted-foreground">Aadhaar Verification</span>
                        <span className={cn(
                          "text-sm font-medium",
                          kycStatus.aadhaar_verified ? "text-success" : "text-warning"
                        )}>
                          {kycStatus.aadhaar_verified ? '✓ Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm text-muted-foreground">Driving License</span>
                        <span className={cn(
                          "text-sm font-medium",
                          kycStatus.dl_verified ? "text-success" : "text-warning"
                        )}>
                          {kycStatus.dl_verified ? '✓ Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      {isKYCVerified 
                        ? 'Click "Proceed to Payment" to complete your booking.' 
                        : 'Click "Continue to KYC" to verify your identity via DigiLocker, then proceed to payment.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step !== 'details' ? (
                  <Button variant="outline" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                <Button variant="hero" onClick={handleContinue} className="gap-2">
                  {step === 'kyc' 
                    ? (isKYCVerified ? 'Proceed to Payment' : 'Continue to KYC')
                    : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card sticky top-24">
              {/* Vehicle Info */}
              <div className="flex gap-4 pb-4 border-b border-border">
                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{vehicleName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{vehicle.vehicleType} • {vehicle.transmission}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="py-4 space-y-3 text-sm border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="text-foreground font-medium">{format(startDateTime, 'MMM dd, hh:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return</span>
                  <span className="text-foreground font-medium">{format(endDateTime, 'MMM dd, hh:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-medium">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="py-4 space-y-3 text-sm border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">₹{vehicle.dailyRate}/day × {totalDays} days</span>
                  <span className="text-foreground">₹{rentalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">₹{serviceFee.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">₹{deliveryFee}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Note */}
              <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Free cancellation up to 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
