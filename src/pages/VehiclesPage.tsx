import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EnhancedVehicleCard } from '@/components/vehicles/EnhancedVehicleCard';
import { VehicleCardSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { BookingSearchBar } from '@/components/vehicles/BookingSearchBar';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/hooks/useVehicles';
import { Search } from 'lucide-react';

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [wheelers, setWheelers] = useState<'2' | '4' | ''>((searchParams.get('wheelers') as '2' | '4' | '') || '');

  const parseDate = (value: string | null, fallback: Date) => {
    if (!value) return fallback;
    const d = new Date(value);
    return isNaN(d.getTime()) ? fallback : d;
  };

  const startParam = searchParams.get('start_date');
  const endParam = searchParams.get('end_date');

  const [pickupDate, setPickupDate] = useState(() => parseDate(startParam, new Date()));
  const [dropoffDate, setDropoffDate] = useState(() => parseDate(endParam, addDays(new Date(), 1)));

  const timeFromDate = (date: Date, fallback: string) => {
    if (!date) return fallback;
    return format(date, 'hh:mm a');
  };

  const [pickupTime, setPickupTime] = useState(() => timeFromDate(parseDate(startParam, new Date()), '05:00 PM'));
  const [dropoffTime, setDropoffTime] = useState(() => timeFromDate(parseDate(endParam, addDays(new Date(), 1)), '05:00 PM'));

  const combineDateTimeISO = (date: Date, time: string) => {
    const [timePart, meridian] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map((v) => parseInt(v, 10));
    let hour24 = hours % 12;
    if (meridian?.toUpperCase() === 'PM') hour24 += 12;
    const dt = new Date(date);
    dt.setHours(hour24, minutes || 0, 0, 0);
    return dt.toISOString();
  };

  const pickupDateTimeISO = combineDateTimeISO(pickupDate, pickupTime);
  const dropoffDateTimeISO = combineDateTimeISO(dropoffDate, dropoffTime);
  const hasValidRange = new Date(dropoffDateTimeISO) > new Date(pickupDateTimeISO);

  const { data: vehicles = [], isLoading, error, refetch } = useVehicles({
    search: searchTerm,
    wheelers: wheelers || undefined,
    city: selectedCity || undefined,
    startDate: hasValidRange ? pickupDateTimeISO : undefined,
    endDate: hasValidRange ? dropoffDateTimeISO : undefined,
  });

  // Search bar state
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');

  const cityFilter = searchParams.get('city');
  const typeFilter = wheelers ? (wheelers === '2' ? '2 Wheeler' : '4 Wheeler') : undefined;

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedCity) params.city = selectedCity;
    if (wheelers) params.wheelers = wheelers;
    if (hasValidRange) {
      params.start_date = pickupDateTimeISO;
      params.end_date = dropoffDateTimeISO;
    }
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCity, wheelers, hasValidRange, pickupDateTimeISO, dropoffDateTimeISO, setSearchParams]);

  useEffect(() => {
    if (!hasValidRange) {
      const correctedDropoff = addDays(pickupDate, 1);
      setDropoffDate(correctedDropoff);
      setDropoffTime(pickupTime);
    }
  }, [hasValidRange, pickupDate, pickupTime]);

  useEffect(() => {
    if (!selectedCity && searchParams.get('city')) {
      const params = Object.fromEntries(searchParams.entries());
      delete params.city;
      setSearchParams(params, { replace: true });
    }
  }, [selectedCity, searchParams, setSearchParams]);

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    return vehicles;
  }, [vehicles]);

  const handleSearch = () => {
    if (new Date(dropoffDateTimeISO) <= new Date(pickupDateTimeISO)) {
      alert('Dropoff must be after pickup');
      return;
    }
    setSearchParams({
      ...(selectedCity ? { city: selectedCity } : {}),
      q: searchTerm || '',
      wheelers: wheelers || '',
      start_date: pickupDateTimeISO,
      end_date: dropoffDateTimeISO,
    });
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <p className="text-destructive">Failed to load vehicles. Please try again later.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Booking Search Bar */}
        <div className="bg-muted/30 py-3 sm:py-4 md:py-6">
          <div className="container">
            <BookingSearchBar
              city={selectedCity}
              onCityChange={setSelectedCity}
              pickupDate={pickupDate}
              pickupTime={pickupTime}
              dropoffDate={dropoffDate}
              dropoffTime={dropoffTime}
              onPickupDateChange={setPickupDate}
              onPickupTimeChange={setPickupTime}
              onDropoffDateChange={setDropoffDate}
              onDropoffTimeChange={setDropoffTime}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="container py-4 sm:py-6 md:py-8">
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
                  <span>/</span>
                  <span className="text-foreground">Vehicles</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {typeFilter || 'All Vehicles'}
                  {cityFilter && ` in ${cityFilter}`}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {isLoading ? 'Loading...' : `${filteredVehicles.length} vehicles available for rent`}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
                onClick={() => { 
                  setSearchTerm(''); 
                  setWheelers(''); 
                  setSelectedCity(''); 
                  setPickupDate(new Date());
                  setDropoffDate(addDays(new Date(), 1));
                  setSearchParams({}); 
                  refetch(); 
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-3 sm:gap-4 lg:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <VehicleCardSkeleton />
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 lg:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <EnhancedVehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-16">
                <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted mb-3 sm:mb-4">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">No vehicles found</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 sm:mt-4"
                  onClick={() => setSearchParams({})}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}