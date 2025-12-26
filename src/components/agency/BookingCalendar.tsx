import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Car, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: string;
  customer_name: string;
  total_amount: number;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  image_url: string | null;
}

interface BookingCalendarProps {
  bookings: Booking[];
  vehicles: Vehicle[];
}

export function BookingCalendar({ bookings, vehicles }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Get bookings for selected date
  const bookingsForDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return bookings.filter(booking => {
      if (booking.status === 'cancelled') return false;
      
      const startDate = startOfDay(new Date(booking.start_date));
      const endDate = endOfDay(new Date(booking.end_date));
      
      return isWithinInterval(selectedDate, { start: startDate, end: endDate });
    });
  }, [bookings, selectedDate]);

  // Get dates that have bookings
  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    
    bookings.forEach(booking => {
      if (booking.status === 'cancelled') return;
      
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      let current = new Date(start);
      
      while (current <= end) {
        dates.add(format(current, 'yyyy-MM-dd'));
        current.setDate(current.getDate() + 1);
      }
    });
    
    return dates;
  }, [bookings]);

  const getVehicle = (vehicleId: string) => vehicles.find(v => v.id === vehicleId);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
        <CalendarIcon className="h-5 w-5 text-primary" />
        Booking Calendar
      </h3>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-lg border border-border pointer-events-auto"
            modifiers={{
              booked: (date) => bookedDates.has(format(date, 'yyyy-MM-dd')),
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                fontWeight: 600,
              },
            }}
            components={{
              DayContent: ({ date }) => {
                const isBooked = bookedDates.has(format(date, 'yyyy-MM-dd'));
                return (
                  <div className="relative">
                    {date.getDate()}
                    {isBooked && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        {/* Bookings for selected date */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h4>
            <span className="text-sm text-muted-foreground">
              {bookingsForDate.length} booking{bookingsForDate.length !== 1 ? 's' : ''}
            </span>
          </div>

          {bookingsForDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No bookings for this date</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {bookingsForDate.map(booking => {
                const vehicle = getVehicle(booking.vehicle_id);
                return (
                  <div
                    key={booking.id}
                    className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30"
                  >
                    {vehicle?.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-14 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-14 h-10 bg-muted rounded flex items-center justify-center">
                        <Car className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {vehicle?.name || 'Unknown Vehicle'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {booking.customer_name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d')}
                        </span>
                        <span className="text-xs font-medium text-primary">
                          ₹{Number(booking.total_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "self-start px-2 py-0.5 rounded text-xs font-medium capitalize",
                      booking.status === 'confirmed' && "bg-success/10 text-success",
                      booking.status === 'ongoing' && "bg-primary/10 text-primary",
                      booking.status === 'pending' && "bg-warning/10 text-warning",
                      booking.status === 'completed' && "bg-muted text-muted-foreground"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
