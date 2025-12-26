import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { addDays } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EnhancedVehicleCard } from '@/components/vehicles/EnhancedVehicleCard';
import { VehicleCardSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { BookingSearchBar } from '@/components/vehicles/BookingSearchBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/hooks/useVehicles';
import { Search, Car, Bike } from 'lucide-react';

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [wheelers, setWheelers] = useState<'2' | '4' | ''>((searchParams.get('wheelers') as '2' | '4' | '') || '');
  const { data: vehicles = [], isLoading, error, refetch } = useVehicles({
    search: searchTerm,
    wheelers: wheelers || undefined,
    city: searchParams.get('city') || undefined,
  });

  // Search bar state
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Hyderabad');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState('05:00 PM');
  const [dropoffDate, setDropoffDate] = useState(addDays(new Date(), 1));
  const [dropoffTime, setDropoffTime] = useState('05:00 PM');

  const cityFilter = searchParams.get('city');
  const typeFilter = wheelers ? (wheelers === '2' ? '2 Wheeler' : '4 Wheeler') : undefined;

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedCity) params.city = selectedCity;
    if (wheelers) params.wheelers = wheelers;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCity, wheelers, setSearchParams]);

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    return vehicles;
  }, [vehicles]);

  const handleSearch = () => {
    setSearchParams({
      city: selectedCity,
      q: searchTerm || '',
      wheelers: wheelers || '',
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
        <div className="bg-muted/30 py-6">
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

        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
              <span>/</span>
              <span className="text-foreground">Vehicles</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {typeFilter || 'All Vehicles'}
              {cityFilter && ` in ${cityFilter}`}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredVehicles.length} vehicles available for rent`}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_0.8fr_auto] items-end mb-8">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Search (make/model/location)</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by make, model, location"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Input
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Vehicle category</label>
              <Select value={wheelers} onValueChange={(val) => setWheelers(val as '2' | '4')}>
                <SelectTrigger>
                  <SelectValue placeholder="2 wheeler or 4 wheeler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Bike className="h-4 w-4" />
                      <span>2 Wheeler</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>4 Wheeler</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="w-full gap-2">
                <Search className="h-4 w-4" />
                Apply
              </Button>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setWheelers(''); setSelectedCity(''); setSearchParams({}); refetch(); }}>
                Clear
              </Button>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <VehicleCardSkeleton />
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="text-center py-16">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No vehicles found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
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