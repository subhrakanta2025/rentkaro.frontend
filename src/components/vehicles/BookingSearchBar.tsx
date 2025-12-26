import { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BookingSearchBarProps {
  city: string;
  onCityChange: (city: string) => void;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
  onPickupDateChange: (date: Date) => void;
  onPickupTimeChange: (time: string) => void;
  onDropoffDateChange: (date: Date) => void;
  onDropoffTimeChange: (time: string) => void;
  onSearch: () => void;
}

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
const timeSlots = [
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

// City coordinates for reverse geocoding matching
const cityCoordinates: Record<string, { lat: number; lng: number; radius: number }> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777, radius: 50 },
  'Delhi': { lat: 28.6139, lng: 77.2090, radius: 50 },
  'Bangalore': { lat: 12.9716, lng: 77.5946, radius: 50 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, radius: 50 },
  'Chennai': { lat: 13.0827, lng: 80.2707, radius: 50 },
  'Pune': { lat: 18.5204, lng: 73.8567, radius: 50 },
  'Kolkata': { lat: 22.5726, lng: 88.3639, radius: 50 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, radius: 50 },
};

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const findNearestCity = (lat: number, lng: number): string | null => {
  let nearestCity: string | null = null;
  let minDistance = Infinity;
  
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    const distance = getDistance(lat, lng, coords.lat, coords.lng);
    if (distance < coords.radius && distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }
  
  return nearestCity;
};

export function BookingSearchBar({
  city,
  onCityChange,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  onPickupDateChange,
  onPickupTimeChange,
  onDropoffDateChange,
  onDropoffTimeChange,
  onSearch,
}: BookingSearchBarProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestCity(latitude, longitude);
        
        if (nearestCity) {
          onCityChange(nearestCity);
          toast.success(`Location detected: ${nearestCity}`);
        } else {
          toast.error('No service available in your area. Please select a city manually.');
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An error occurred while getting your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr_2fr_auto]">
        {/* City Selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            City
          </label>
          <div className="flex gap-1">
            <Select value={city} onValueChange={onCityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCurrentLocation}
              disabled={isLocating}
              className="shrink-0"
              title="Use current location"
            >
              <Navigation className={cn("h-4 w-4", isLocating && "animate-pulse")} />
            </Button>
          </div>
        </div>

        {/* Pickup Date & Time */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Pickup Date & Time
          </label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !pickupDate && 'text-muted-foreground'
                  )}
                >
                  {pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={pickupDate}
                  onSelect={(date) => date && onPickupDateChange(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={pickupTime} onValueChange={onPickupTimeChange}>
              <SelectTrigger className="w-28">
                <Clock className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dropoff Date & Time */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Dropoff Date & Time
          </label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !dropoffDate && 'text-muted-foreground'
                  )}
                >
                  {dropoffDate ? format(dropoffDate, 'MMM dd, yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dropoffDate}
                  onSelect={(date) => date && onDropoffDateChange(date)}
                  disabled={(date) => date < pickupDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={dropoffTime} onValueChange={onDropoffTimeChange}>
              <SelectTrigger className="w-28">
                <Clock className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full gap-2 bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
