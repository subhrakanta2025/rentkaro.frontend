import { useLocation, Link, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Car,
  Download,
  Home,
  User,
} from 'lucide-react';

interface BookingConfirmationData {
  bookingId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function BookingConfirmationPage() {
  const location = useLocation();
  const data = location.state as BookingConfirmationData | null;

  if (!data) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout title="Booking Confirmed" description="Your booking has been successfully placed">
      <div className="container-dashboard">
        <div className="mx-auto max-w-lg text-center">
          {/* Success Icon */}
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-6 animate-scale-in">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your booking has been successfully placed
          </p>

          {/* Booking Details Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card text-left mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="text-lg font-bold text-primary">
                  #{data.bookingId.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                Confirmed
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{data.vehicleName}</p>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {format(new Date(data.startDate), 'MMM dd, yyyy')} - {format(new Date(data.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">Rental Period</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{data.pickupLocation}</p>
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{data.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mb-8 text-left">
            <h3 className="font-medium text-foreground mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• A confirmation email has been sent to {data.customerEmail}</li>
              <li>• Bring your original Driving License and ID proof at pickup</li>
              <li>• Security deposit of ₹2,000 will be collected at pickup</li>
              <li>• Contact the agency for any special requests</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button variant="hero" className="gap-2 w-full sm:w-auto">
                <User className="h-4 w-4" />
                View My Bookings
              </Button>
            </Link>
            <Link to="/vehicles">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Car className="h-4 w-4" />
                Browse More Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
