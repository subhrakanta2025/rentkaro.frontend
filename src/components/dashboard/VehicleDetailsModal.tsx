import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Fuel, Users, Settings2,
  Loader2, MapPin, Gauge, Activity,
  Banknote, AlertCircle, Clock, Timer, Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useVehicle } from '@/hooks/useVehicles';
import { apiClient } from '@/services/api';
import { getAppLogoUrl } from '@/lib/logo';

// --- Types ---
interface Vehicle {
  id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  trips?: number;
  transmission?: string;
  seatingCapacity?: number;
  seats?: number;
  fuelType?: string;
  price?: number;
  pricePerDay?: number;
  securityDeposit?: number;
  deposit?: number;
  year?: number;
  location?: string;
  mileage?: string;
  agencyId?: string;
  isFavorite?: boolean;
  displacement?: string;
  topSpeed?: string;
  fuelCapacity?: string;
  weight?: string;
  timings?: string;
  excessPerKm?: number;
  lateFeePerHr?: number;
  agencyLocation?: {
    address?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
  };
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AvailabilityConflict {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface AvailabilityResponse {
  vehicleId: string;
  requestedStartDate: string;
  requestedEndDate: string;
  isBooked: boolean;
  conflicts: AvailabilityConflict[];
}

// --- Icons & Helper Components ---
// Reduced padding here for compact look
const FeatureItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg border">
    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, colorClass = "text-primary" }: { icon: any, label: string, value: string, colorClass?: string }) => (
  <div className="flex flex-col items-center text-center gap-1 p-2 border rounded-md bg-white shadow-sm">
    <Icon className={cn("h-5 w-5 mb-1", colorClass)} />
    <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
    <p className={cn("text-xs font-bold", colorClass)}>{value}</p>
  </div>
);

const formatCurrency = (amount: number) => `₹${Math.max(0, amount || 0).toLocaleString('en-IN')}`;

// --- Main Component ---
export function VehicleDetailsModal({ vehicle, isOpen, onClose }: VehicleDetailsModalProps) {
  const [paymentOption, setPaymentOption] = useState<'partial' | 'full'>('partial');
  const [packageType, setPackageType] = useState('daily');
  const [isProcessing, setIsProcessing] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes

  const brandLogo = getAppLogoUrl();

  const vehicleId = vehicle?.id || '';
  const { data: fetchedVehicle } = useVehicle(vehicleId);

  const bookingStartDate = useMemo(() => new Date(), [vehicleId]);
  const bookingEndDate = useMemo(
    () => new Date(bookingStartDate.getTime() + 24 * 60 * 60 * 1000),
    [bookingStartDate]
  );
  const bookingStartIso = bookingStartDate.toISOString();
  const bookingEndIso = bookingEndDate.toISOString();

  useEffect(() => {
    if (!vehicleId) {
      setAvailability(null);
      return;
    }

    let isCancelled = false;
    const fetchAvailability = async () => {
      setIsCheckingAvailability(true);
      try {
        const response = await apiClient.checkVehicleAvailability(
          vehicleId,
          bookingStartIso,
          bookingEndIso
        ) as AvailabilityResponse;
        if (!isCancelled) {
          setAvailability(response);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Availability check failed', error);
          setAvailability(null);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingAvailability(false);
        }
      }
    };

    fetchAvailability();
    return () => {
      isCancelled = true;
    };
  }, [vehicleId, bookingEndIso, bookingStartIso]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(120);
      return;
    }

    setCountdown(120);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!vehicle) return null;

  const vehicleData = (fetchedVehicle || vehicle) as Vehicle;
  const vehicleName = vehicleData.name || `${(vehicleData as any).brand || ''} ${(vehicleData as any).model || ''}`.trim() || 'Vehicle';
  const pricePerDay = Number(vehicleData.pricePerDay ?? (vehicleData as any).dailyRate ?? vehicleData.price ?? 0);
  const deposit = Number(vehicleData.securityDeposit ?? vehicleData.deposit ?? 0);
  const makeYear = vehicleData.year ?? new Date().getFullYear();
  const seats = vehicleData.seatingCapacity ?? vehicleData.seats ?? 2;
  const primaryImage = vehicleData.image || vehicleData.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop';

  const timings = vehicleData.timings || '7:00 AM - 10:00 PM';
  const distanceLimit = vehicleData.mileage ? `${vehicleData.mileage}` : 'Unlimited';
  const excessCharge = vehicleData.excessPerKm ? `₹${vehicleData.excessPerKm}/km` : '₹4/km';
  const latePenalty = vehicleData.lateFeePerHr ? `₹${vehicleData.lateFeePerHr}/hr` : '₹100/hr';
  const fuelCapacity = vehicleData.fuelCapacity || '–';
  const topSpeed = vehicleData.topSpeed || '–';
  const displacement = vehicleData.displacement || '–';
  const weight = vehicleData.weight || '–';
  const kmsDriven = vehicleData.mileage || '—';
  const pickupLocation = vehicleData.location || (vehicleData as any).city || 'Pickup location shared after confirmation';
  const agencyLocation = (vehicleData as any).agencyLocation || (vehicleData as any).agency || null;
  const pickupLat = agencyLocation?.latitude;
  const pickupLng = agencyLocation?.longitude;

  const handleOpenRoute = () => {
    if (!pickupLat || !pickupLng) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${pickupLat},${pickupLng}`;
          window.open(url, '_blank');
        },
        () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${pickupLat},${pickupLng}`;
          window.open(url, '_blank');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${pickupLat},${pickupLng}`;
      window.open(url, '_blank');
    }
  };
  const partialPayPercentage = 0.2;

  const requestedStartLabel = availability?.requestedStartDate
    ? new Date(availability.requestedStartDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  // Simple pricing preview (1-day)
  const rentalAmount = pricePerDay;
  const platformFee = 15;
  const gstAmount = parseFloat(((rentalAmount + platformFee) * 0.18).toFixed(2));
  const total = rentalAmount + platformFee + gstAmount;
  const advancePayment = paymentOption === 'partial'
      ? Math.round(total * partialPayPercentage)
    : total;
  const remainingRent = total - advancePayment;
  const amountPayableToday = advancePayment;

  const loadRazorpay = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  const handleBookNow = async () => {
    if (!vehicleData.agencyId) {
      toast.error('Agency not found for this vehicle');
      return;
    }

    if (!pricePerDay || pricePerDay <= 0) {
      toast.error('Price not available for this vehicle');
      return;
    }

    if (availability?.isBooked) {
      toast.error('Vehicle is already booked for the selected period.');
      return;
    }

    setIsProcessing(true);

    try {
      const isoStart = bookingStartIso;
      const isoEnd = bookingEndIso;

      // 1) Create pending booking
      const bookingPayload = {
        vehicleId: vehicleData.id,
        agencyId: vehicleData.agencyId,
        startDate: isoStart,
        endDate: isoEnd,
        pickupLocation: pickupLocation,
        dropoffLocation: pickupLocation,
        dailyRate: pricePerDay,
        numberOfDays: 1,
        subtotal: rentalAmount + platformFee,
        tax: gstAmount,
        discount: 0,
        totalAmount: total,
        securityDeposit: deposit || 0,
        status: 'pending',
        paymentStatus: 'pending',
      };

      const bookingResp: any = await apiClient.createBooking(bookingPayload);
      const bookingId = bookingResp?.booking?.id;
      if (!bookingId) throw new Error('Booking creation failed');

      // 2) Create Razorpay order (respect partial/full selection)
      const orderResp: any = await apiClient.createPaymentOrder({ bookingId, amountPaise: Math.round(amountPayableToday * 100) });
      const { order, keyId } = orderResp;
      if (!order?.id) throw new Error('Failed to create payment order');

      // 3) Load Razorpay and open checkout
      await loadRazorpay();
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'RentKaro',
        image: brandLogo,
        description: vehicleName,
        order_id: order.id,
        notes: {
          bookingId,
          vehicleId: vehicleData.id,
        },
        theme: { color: '#16a34a' },
        handler: async (response: any) => {
          try {
            await apiClient.verifyPayment({
              bookingId,
              ...response,
              method: paymentOption,
            });
            toast.success('Payment successful and booking confirmed!');
            onClose();
          } catch (err) {
            toast.error((err as Error)?.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });

      rzp.on('payment.failed', async (response: any) => {
        try {
          await apiClient.failPayment({ bookingId, ...response });
          toast.error('Payment failed. Booking cancelled.');
        } catch (err) {
          toast.error((err as Error)?.message || 'Payment failed and not recorded.');
        } finally {
          setIsProcessing(false);
        }
      });

      // Close the details modal before opening Razorpay to avoid overlay conflicts
      onClose();
      rzp.open();
    } catch (error) {
      toast.error((error as Error)?.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden h-[90vh] flex flex-col bg-slate-50/50">
        
        {/* Header */}
        <DialogHeader className="px-5 py-3 border-b bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Complete Your Booking</DialogTitle>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
              <Clock className="h-3 w-3 mr-1" /> Finish in {formatCountdown(countdown)}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Vehicle Images & Key Stats */}
            <div className="lg:col-span-7 space-y-4">
              {/* Image Card - Reduced padding and height */}
              <div className="bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden">
                <Badge className="absolute top-3 left-3 bg-red-100 text-red-600 hover:bg-red-100 border-red-200 text-[10px] px-2 py-0.5">
                  Only 1 Left
                </Badge>
                
                <div className="flex justify-center my-4">
                  <img 
                    src={primaryImage} 
                    alt={vehicleName} 
                    className="h-48 object-contain mix-blend-multiply" 
                  />
                </div>

                <div className="flex justify-center gap-8 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-green-50 flex items-center justify-center">
                      <Gauge className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Kms Driven</p>
                      <p className="text-xs font-semibold text-green-700">{kmsDriven}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-green-50 flex items-center justify-center">
                      <Settings2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Make Year</p>
                      <p className="text-xs font-semibold text-green-700">{makeYear}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Things to Remember - Compact Grid */}
              <div className="bg-white rounded-xl border p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3">Things To Remember</h3>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                  <InfoItem icon={Banknote} label="Deposit" value={formatCurrency(deposit)} />
                  <InfoItem icon={Clock} label="Timings" value={timings} />
                  <InfoItem icon={MapPin} label="Limit" value={distanceLimit} colorClass="text-green-600" />
                  <InfoItem icon={AlertCircle} label="Excess" value={excessCharge} colorClass="text-green-600" />
                  <InfoItem icon={Timer} label="Late" value={latePenalty} colorClass="text-green-600" />
                </div>
              </div>

              {/* Features - Compact Grid */}
              <div className="bg-white rounded-xl border p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-3">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <FeatureItem icon={Activity} label="Displacement" value={displacement} />
                  <FeatureItem icon={Gauge} label="Top Speed" value={topSpeed} />
                  <FeatureItem icon={Fuel} label="Fuel Capacity" value={fuelCapacity} />
                  <FeatureItem icon={Users} label="Seats" value={`${seats} Seater`} />
                  <FeatureItem icon={Scale} label="Weight" value={weight} />
                  <FeatureItem icon={Settings2} label="Mileage" value={kmsDriven} />
                </div>
              </div>

              {/* Pickup Location - Reduced Height */}
              <div className="bg-white rounded-xl border p-4 shadow-sm">
                <h3 className="font-semibold text-sm mb-2">Pickup Location</h3>
                <p className="text-green-600 font-medium text-xs mb-3 flex items-center gap-1">
                   <MapPin className="h-3 w-3" /> {pickupLocation}
                </p>
                <div className="h-24 w-full bg-muted rounded-lg flex flex-col items-center justify-center border border-dashed relative overflow-hidden gap-2">
                   <span className="text-xs text-muted-foreground">Map Preview</span>
                   {pickupLat && pickupLng ? (
                     <Button size="sm" variant="secondary" onClick={handleOpenRoute} className="h-8 text-xs">
                       Open Route
                     </Button>
                   ) : (
                     <span className="text-[10px] text-muted-foreground">Coordinates unavailable</span>
                   )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Booking Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-0">
                <h2 className="text-xl font-bold mb-4">{vehicleName}</h2>
                
                {/* Package Selection */}
                <div className="space-y-1.5 mb-4">
                  <Label className="text-xs">Select Package</Label>
                  <Select value={packageType} onValueChange={setPackageType}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Package (₹{pricePerDay}/day)</SelectItem>
                      <SelectItem value="weekly">Weekly Package (₹{pricePerDay * 6}/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Option */}
                <div className="space-y-2 mb-4">
                  <Label className="text-xs">Payment Option</Label>
                  <RadioGroup value={paymentOption} onValueChange={(v: 'partial' | 'full') => setPaymentOption(v)}>
                    <div className={cn("flex items-center space-x-2 border rounded-md p-2 cursor-pointer transition-colors", paymentOption === 'partial' ? "border-primary bg-primary/5" : "")}>
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="cursor-pointer flex-1">
                        <span className="font-semibold text-sm block">Partial Payment</span>
                        <span className="text-[10px] text-muted-foreground">Pay {formatCurrency(Math.round(rentalAmount * partialPayPercentage))} now</span>
                      </Label>
                    </div>
                    <div className={cn("flex items-center space-x-2 border rounded-md p-2 cursor-pointer transition-colors", paymentOption === 'full' ? "border-primary bg-primary/5" : "")}>
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="cursor-pointer flex-1">
                        <span className="font-semibold text-sm block">Pay Now</span>
                        <span className="text-[10px] text-muted-foreground">Pay full amount now</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Fare Details */}
                <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg border">
                  <h4 className="font-semibold text-xs">Fare Details</h4>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Rent Amount</span>
                    <span>{formatCurrency(rentalAmount)}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{formatCurrency(gstAmount)}</span>
                  </div>
                  
                  <Separator className="bg-slate-200" />
                  
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {paymentOption === 'partial' && (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Pay at pickup</span>
                        <span>{formatCurrency(remainingRent)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Advance Payment</span>
                        <span>{formatCurrency(advancePayment)}</span>
                      </div>
                    </>
                  )}

                  <Separator className="bg-slate-200" />
                  
                  <div className="flex justify-between items-center text-base font-bold text-primary">
                    <span>Payable Today</span>
                    <span>{formatCurrency(amountPayableToday)}</span>
                  </div>
                </div>

                {/* Deposit Warning */}
                <div className="bg-green-50 border border-green-200 text-green-800 p-2 rounded text-xs font-medium text-center mb-4">
                  Refundable Deposit: {formatCurrency(deposit)} (Pay at pickup)
                </div>

                {/* Book Now Button - Using Default Primary Color */}
                {isCheckingAvailability && !availability?.isBooked && (
                  <p className="text-[10px] text-muted-foreground mb-2">Checking availability…</p>
                )}
                {availability?.isBooked && (
                  <p className="text-[10px] text-destructive mb-2">
                    Already booked for {requestedStartLabel || 'this date'}. Please try another day.
                  </p>
                )}
                <Button 
                  className="w-full h-11 text-base font-bold mb-4 shadow-md"
                  onClick={handleBookNow}
                  disabled={isProcessing || availability?.isBooked}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book Now"}
                </Button>

                {/* Policies Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="cancellation" className="border-b-0">
                    <AccordionTrigger className="text-xs py-2 text-blue-600 hover:no-underline">Cancellation Policy</AccordionTrigger>
                    <AccordionContent className="text-[10px] text-muted-foreground">
                      Full refund if cancelled 24 hours before pickup.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Terms */}
                <div className="mt-2">
                  <h4 className="font-semibold text-xs mb-1">Terms & Conditions</h4>
                  <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc pl-3">
                    <li>Original Aadhar & Driving License required.</li>
                    <li>Submit original DL during trip.</li>
                    <li>Fuel charges excluded.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}