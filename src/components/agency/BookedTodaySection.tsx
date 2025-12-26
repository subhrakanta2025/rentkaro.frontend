import { Car, Calendar, User, MapPin } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: string;
  customer_name: string;
  customer_phone: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  image_url: string | null;
  city: string;
}

interface BookedTodaySectionProps {
  bookings: Booking[];
  vehicles: Vehicle[];
}

export function BookedTodaySection({ bookings, vehicles }: BookedTodaySectionProps) {
  const today = new Date();
  
  // Find bookings that are active today (today is between start and end date)
  const bookedToday = bookings.filter(booking => {
    if (booking.status === 'cancelled') return false;
    
    const startDate = startOfDay(new Date(booking.start_date));
    const endDate = endOfDay(new Date(booking.end_date));
    
    return isWithinInterval(today, { start: startDate, end: endDate });
  });

  // Get vehicle details for booked vehicles
  const bookedVehicles = bookedToday.map(booking => {
    const vehicle = vehicles.find(v => v.id === booking.vehicle_id);
    return { booking, vehicle };
  }).filter(item => item.vehicle);

  const availableCount = vehicles.length - bookedVehicles.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          Vehicles on Rent Today
        </h3>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            {bookedVehicles.length} On Rent
          </span>
          <span className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
            {availableCount} Available
          </span>
        </div>
      </div>

      {bookedVehicles.length === 0 ? (
        <div className="text-center py-8">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">All vehicles are available today!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bookedVehicles.map(({ booking, vehicle }) => (
            <div
              key={booking.id}
              className="flex gap-3 p-4 rounded-lg border border-border bg-muted/30"
            >
              {vehicle?.image_url ? (
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="w-16 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{vehicle?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {booking.customer_name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd')}
                </p>
              </div>
              <span className={cn(
                "self-start px-2 py-0.5 rounded text-xs font-medium capitalize",
                booking.status === 'confirmed' && "bg-success/10 text-success",
                booking.status === 'ongoing' && "bg-primary/10 text-primary",
                booking.status === 'pending' && "bg-warning/10 text-warning"
              )}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
