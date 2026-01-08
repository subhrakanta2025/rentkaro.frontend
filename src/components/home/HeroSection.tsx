import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Bike, Car, ChevronDown, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays } from 'date-fns';
import { useCities } from '@/hooks/useCities';

type VehicleType = 'bike' | 'car' | 'all';

const timeSlots = [
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export function HeroSection() {
  const navigate = useNavigate();
  const { data: citiesData = [], isLoading: citiesLoading } = useCities();
  const [vehicleType, setVehicleType] = useState<VehicleType>('all');
  const [city, setCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState('05:00 PM');
  const [dropoffDate, setDropoffDate] = useState<Date>(addDays(new Date(), 1));
  const [dropoffTime, setDropoffTime] = useState('05:00 PM');

  const combineDateTimeISO = (date: Date, time: string) => {
    const [timePart, meridian] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map((v) => parseInt(v, 10));
    let hour24 = hours % 12;
    if (meridian?.toUpperCase() === 'PM') hour24 += 12;
    const dt = new Date(date);
    dt.setHours(hour24, minutes || 0, 0, 0);
    return dt.toISOString();
  };

  const handleSearch = () => {
    if (!city) {
      alert('Please select a city before searching');
      return;
    }

    const pickupISO = combineDateTimeISO(pickupDate, pickupTime);
    const dropoffISO = combineDateTimeISO(dropoffDate, dropoffTime);

    if (new Date(dropoffISO) <= new Date(pickupISO)) {
      alert('Dropoff must be after pickup');
      return;
    }

    const params = new URLSearchParams();
    if (vehicleType !== 'all') params.set('type', vehicleType);
    params.set('city', city);
    params.set('start_date', pickupISO);
    params.set('end_date', dropoffISO);
    navigate(`/vehicles?${params.toString()}`);
  };

  const filteredCities = citiesData.filter((item) =>
    item.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative py-5 sm:py-6 md:py-10 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-primary animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
            </span>
            <span className="hidden sm:inline">Trusted by 10,000+ customers across India</span>
            <span className="sm:hidden">10,000+ happy customers</span>
          </div>

          {/* Headline */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl animate-slide-up">
            Rent Bikes & Cars
            <span className="block text-gradient">Anytime, Anywhere</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto animate-slide-up px-2" style={{ animationDelay: '100ms' }}>
            Find the perfect ride from verified rental agencies. Affordable hourly & daily rentals with doorstep delivery across major Indian cities.
          </p>

          {/* Search Box */}
          <div className="mt-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="mx-auto max-w-2xl rounded-xl bg-card p-3 shadow-lg border border-border/50">
              {/* Vehicle Type Tabs */}
              <div className="flex items-center gap-1 mb-3 p-0.5 bg-muted rounded-md">
                <button
                  onClick={() => setVehicleType('all')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                    vehicleType === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  All Vehicles
                </button>
                <button
                  onClick={() => setVehicleType('bike')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                    vehicleType === 'bike'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Bike className="h-3.5 w-3.5" />
                  Bikes
                </button>
                <button
                  onClick={() => setVehicleType('car')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                    vehicleType === 'car'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Car className="h-3.5 w-3.5" />
                  Cars
                </button>
              </div>

              {/* Search Fields */}
              <div className="flex flex-col gap-2 md:grid md:grid-cols-[1fr_1.2fr_1.2fr_auto] md:items-stretch">
                {/* City Selector */}
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border bg-background px-3 py-2 h-[48px] cursor-pointer transition-colors",
                      city
                        ? "border-input hover:border-primary/50"
                        : "border-red-300 hover:border-red-400"
                    )}
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[10px] text-muted-foreground">
                        Location <span className="text-red-500">*</span>
                      </p>
                      <p className={cn(
                        "text-xs font-medium truncate",
                        city ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {city || 'Select city'}
                      </p>
                    </div>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0",
                      showCityDropdown && "rotate-180"
                    )} />
                  </div>
                  
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-background shadow-lg z-50 animate-slide-down max-h-56 overflow-y-auto">
                      {citiesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      ) : citiesData.length === 0 ? (
                        <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                          No cities available
                        </div>
                      ) : (
                        <div className="py-1">
                          <div className="px-2 pb-1">
                            <input
                              type="text"
                              className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Search city..."
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                          {filteredCities.length === 0 ? (
                            <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                              No matching cities
                            </div>
                          ) : (
                            filteredCities.map((cityItem) => (
                              <button
                                key={cityItem.id}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-muted transition-colors"
                                onClick={() => {
                                  setCity(cityItem.name);
                                  setShowCityDropdown(false);
                                  setCitySearch('');
                                }}
                              >
                                {cityItem.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pickup Date & Time */}
                <div className="flex gap-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex-1 justify-start text-left font-normal h-[48px] px-2.5 py-1.5',
                          !pickupDate && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground">Pickup</p>
                          <p className="text-xs font-medium truncate">
                            {pickupDate ? format(pickupDate, 'MMM dd') : 'Select'}
                          </p>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={pickupDate}
                        onSelect={(date) => date && setPickupDate(date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger className="w-[80px] h-[48px] text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px]">{pickupTime.split(' ')[0]}</span>
                      </div>
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

                {/* Dropoff Date & Time */}
                <div className="flex gap-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex-1 justify-start text-left font-normal h-[48px] px-2.5 py-1.5',
                          !dropoffDate && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground">Dropoff</p>
                          <p className="text-xs font-medium truncate">
                            {dropoffDate ? format(dropoffDate, 'MMM dd') : 'Select'}
                          </p>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dropoffDate}
                        onSelect={(date) => date && setDropoffDate(date)}
                        disabled={(date) => date < pickupDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Select value={dropoffTime} onValueChange={setDropoffTime}>
                    <SelectTrigger className="w-[80px] h-[48px] text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px]">{dropoffTime.split(' ')[0]}</span>
                      </div>
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

                {/* Search Button */}
                <Button
                  variant="hero"
                  size="lg"
                  className="gap-2 h-[48px] md:w-full px-4 sm:px-6"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 animate-fade-in px-2" style={{ animationDelay: '400ms' }}>
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/30">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">500+</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Vehicles</p>
            </div>
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/30">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">50+</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Agencies</p>
            </div>
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 border border-border/30">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">8</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Cities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
