import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/services/api';
import rentkaroLogo from '@/assets/rentkaro-logo.png';
import { toast } from 'sonner';
import { differenceInCalendarDays } from 'date-fns';
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Shield,
  Loader2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BookingData {
  vehicleId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  totalAmount: number;
  rentalCost: number;
  serviceFee: number;
  dailyRate?: number;
  securityDeposit?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  agencyId: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const bookingData = location.state as BookingData | null;
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    if (!bookingData) {
      navigate('/vehicles');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setIsProcessing(true);

    try {
      const daysDiff = differenceInCalendarDays(new Date(bookingData.endDate), new Date(bookingData.startDate));
      const numberOfDays = Math.max(1, daysDiff || 1);
      const dailyRate = bookingData.dailyRate || Math.max(1, Math.round(bookingData.rentalCost / numberOfDays));

      const baseAmount = bookingData.totalAmount || (bookingData.rentalCost + bookingData.serviceFee);
      const platformFee = 15;
      const gstAmount = parseFloat(((baseAmount + platformFee) * 0.18).toFixed(2));
      const totalAmount = baseAmount + platformFee + gstAmount;

      // 1) Create booking as pending
      const bookingPayload = {
        vehicleId: bookingData.vehicleId,
        agencyId: bookingData.agencyId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation || bookingData.pickupLocation,
        dailyRate,
        numberOfDays,
        subtotal: baseAmount + platformFee,
        tax: gstAmount,
        discount: 0,
        totalAmount,
        securityDeposit: bookingData.securityDeposit || 0,
        status: 'pending',
        paymentStatus: 'pending',
      };

      const bookingResp = await apiClient.createBooking(bookingPayload);
      const bookingId = (bookingResp as any)?.booking?.id;
      if (!bookingId) throw new Error('Booking creation failed');

      // 2) Create Razorpay order
      const orderResp: any = await apiClient.createPaymentOrder({ bookingId });
      const { order, keyId } = orderResp;
      if (!order?.id) throw new Error('Failed to create payment order');

      // 3) Load Razorpay SDK and open checkout
      await loadRazorpay();
      const brandLogo = `${window.location.origin}/rentkaro-logo.png`;
      const rzp = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'RentKaro',
        image: brandLogo,
        description: bookingData.vehicleName,
        order_id: order.id,
        prefill: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          contact: bookingData.customerPhone,
        },
        notes: {
          bookingId,
          vehicleId: bookingData.vehicleId,
        },
        theme: { color: '#16a34a' },
        handler: async (response: any) => {
          try {
            await apiClient.verifyPayment({
              bookingId,
              ...response,
              email: bookingData.customerEmail,
              contact: bookingData.customerPhone,
              method: paymentMethod,
            });
            toast.success('Payment successful and booking confirmed!');
            navigate('/booking-confirmation', {
              state: {
                bookingId,
                ...bookingData,
              },
            });
            setIsProcessing(false);
          } catch (err) {
            toast.error((err as Error)?.message || 'Payment verification failed');
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
          toast.error((err as Error)?.message || 'Payment failed and could not be recorded.');
        } finally {
          setIsProcessing(false);
        }
      });

      rzp.open();
    } catch (error) {
      toast.error((error as Error)?.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay using any UPI app' },
    { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit/Debit Card' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container py-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Secure Payment</h1>
            <p className="mt-2 text-muted-foreground">Complete your booking payment</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Select Payment Method</h2>
                
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left",
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        paymentMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                      <div className={cn(
                        "ml-auto flex h-5 w-5 items-center justify-center rounded-full border-2",
                        paymentMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {paymentMethod === method.id && (
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="upi" className="mb-2 block">
                        Enter UPI ID <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="upi"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        e.g., 9876543210@paytm, yourname@okaxis
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="mb-2 block">Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Expiry</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label className="mb-2 block">CVV</Label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to your bank's website to complete the payment.
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-success/5 border border-success/20 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Your payment is secured with 256-bit encryption
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ₹{bookingData.totalAmount.toLocaleString()}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{bookingData.vehicleName}</p>
                    <p className="text-muted-foreground">{bookingData.pickupLocation}</p>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rental Cost</span>
                      <span className="text-foreground">₹{bookingData.rentalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="text-foreground">₹{bookingData.serviceFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{bookingData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
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
