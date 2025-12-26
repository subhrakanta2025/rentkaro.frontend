import { format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface BookingSummaryProps {
  vehicle: {
    name: string;
    image: string;
    pricePerDay: number;
  };
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  pickupLocation: string;
  totalDays: number;
  rentalCost: number;
  serviceFee: number;
  deliveryFee: number;
  totalAmount: number;
}

export function BookingSummary({
  vehicle,
  startDate,
  startTime,
  endDate,
  endTime,
  pickupLocation,
  totalDays,
  rentalCost,
  serviceFee,
  deliveryFee,
  totalAmount,
}: BookingSummaryProps) {
  return (
    <div className="p-6 bg-muted/30 rounded-lg space-y-6">
      <div className="flex items-center gap-4">
        <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 rounded-lg object-cover" />
        <div>
          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
          <p className="text-muted-foreground">Price per day: ₹{vehicle.pricePerDay}</p>
        </div>
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Rental Cost ({totalDays} days)</span>
          <span>₹{rentalCost}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Service Fee (5%)</span>
          <span>₹{serviceFee}</span>
        </div>
        {pickupLocation === 'delivery' && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
        )}
        <div className="flex justify-between items-center font-bold text-lg border-t border-border pt-3">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-muted-foreground">{format(new Date(startDate), 'MMM dd, yyyy')} at {startTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="font-medium">Dropoff</p>
            <p className="text-muted-foreground">{format(new Date(endDate), 'MMM dd, yyyy')} at {endTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{pickupLocation === 'agency' ? 'Agency Hub' : 'Home Delivery'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
