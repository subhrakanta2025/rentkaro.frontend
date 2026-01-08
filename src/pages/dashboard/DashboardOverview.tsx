import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Star,
  MapPin,
  Fuel,
  Users,
  Settings2,
  Truck,
  Search,
  CalendarIcon,
  SlidersHorizontal,
  LocateFixed,
  Loader2,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { VehicleDetailsModal } from '@/components/dashboard/VehicleDetailsModal';
import { useCities } from '@/hooks/useCities';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleCardSkeleton } from '@/components/vehicles/VehicleCardSkeleton';

const vehicleTypes = ['All', '2 Wheeler', '4 Wheeler'];
const transmissions = ['All', 'Automatic', 'Manual'];
const fuelTypes = ['All', 'Petrol', 'Electric', 'CNG'];

export default function DashboardOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [dropoffDate, setDropoffDate] = useState<Date>(new Date(Date.now() + 86400000));
  const [vehicleType, setVehicleType] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const { data: cityOptions = [], isLoading: citiesLoading } = useCities();

  const wheelersFilter = vehicleType === '2 Wheeler' ? '2' : vehicleType === '4 Wheeler' ? '4' : undefined;
  const { data: vehicles = [], isLoading, isError, refetch } = useVehicles({
    search: searchQuery,
    wheelers: wheelersFilter as any,
    city: selectedCity || undefined,
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle: any) => {
      const matchesTransmission = transmission === 'All' || (vehicle.transmission || '').toLowerCase() === transmission.toLowerCase();
      const matchesFuel = fuelType === 'All' || (vehicle.fuelType || '').toLowerCase() === fuelType.toLowerCase();
      return matchesTransmission && matchesFuel;
    });
  }, [vehicles, transmission, fuelType]);

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simple reverse geocoding using coordinates to find nearest city
        // In production, you'd use a proper geocoding API
        const cityCoordinates: Record<string, { lat: number; lng: number }> = {
          'Hyderabad': { lat: 17.385, lng: 78.4867 },
          'Bangalore': { lat: 12.9716, lng: 77.5946 },
          'Chennai': { lat: 13.0827, lng: 80.2707 },
          'Mumbai': { lat: 19.076, lng: 72.8777 },
          'Delhi': { lat: 28.7041, lng: 77.1025 },
          'Pune': { lat: 18.5204, lng: 73.8567 },
        };

        // Find closest city
        let closestCity = 'Hyderabad';
        let minDistance = Infinity;

        Object.entries(cityCoordinates).forEach(([city, coords]) => {
          const distance = Math.sqrt(
            Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCity = city;
          }
        });

        setSelectedCity(closestCity);
        setIsLocating(false);
        toast.success(`Location detected: ${closestCity}`);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-green-400';
    if (rating >= 3.0) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <DashboardLayout title="Available Vehicles" description="Browse and book vehicles near you">
      {/* Search Bar Section */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-card mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* City Select with Location Button */}
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] text-muted-foreground mb-0.5 block">City</label>
            <div className="flex gap-1.5">
              <Popover open={isCityPickerOpen} onOpenChange={setIsCityPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-8 flex-1 justify-between text-xs"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">
                        {selectedCity || 'All cities'}
                      </span>
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      {citiesLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Loading cities...
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No cities found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              key="all-cities"
                              value="All cities"
                              onSelect={() => {
                                setSelectedCity('');
                                setIsCityPickerOpen(false);
                              }}
                            >
                              <span>All cities</span>
                              {selectedCity === '' && (
                                <Check className="ml-auto h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                            {cityOptions.map((city) => (
                              <CommandItem
                                key={city.id}
                                value={city.name}
                                onSelect={() => {
                                  setSelectedCity(city.name);
                                  setIsCityPickerOpen(false);
                                }}
                              >
                                <span>{city.name}</span>
                                {selectedCity === city.name && (
                                  <Check className="ml-auto h-4 w-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                title="Use current location"
              >
                {isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="h-3.5 w-3.5 text-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] text-muted-foreground mb-0.5 block">Pickup Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-8 justify-start text-left font-normal text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {format(pickupDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={(date) => date && setPickupDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Dropoff Date */}
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] text-muted-foreground mb-0.5 block">Dropoff Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-8 justify-start text-left font-normal text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {format(dropoffDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dropoffDate}
                  onSelect={(date) => date && setDropoffDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button className="h-8 px-5 bg-primary hover:bg-primary/90 text-xs">
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Search
            </Button>
          </div>
        </div>

        {/* Filter Options Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[150px] max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-7 text-xs"
            />
          </div>

          {/* Vehicle Type */}
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="w-[110px] h-7 text-xs">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Transmission */}
          <Select value={transmission} onValueChange={setTransmission}>
            <SelectTrigger className="w-[100px] h-7 text-xs">
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              {transmissions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Fuel Type */}
          <Select value={fuelType} onValueChange={setFuelType}>
            <SelectTrigger className="w-[90px] h-7 text-xs">
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Loading vehicles...' : (
            <>
              Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> vehicles in{' '}
              <span className="font-semibold text-foreground">{selectedCity || 'all cities'}</span>
            </>
          )}
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => refetch()} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Vehicle Grid */}
      {isError && (
        <div className="rounded-lg border border-border bg-card p-4 text-center text-xs text-destructive mb-3">
          Unable to load vehicles. Please refresh.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <VehicleCardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No vehicles match your filters. Try adjusting search or vehicle category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {filteredVehicles.map((vehicle: any) => {
            const isBooked = vehicle.isAvailable === false || (vehicle.status || '').toLowerCase() === 'booked';
            return (
              <div
                key={vehicle.id}
                className={cn(
                  'rounded-lg border border-border bg-card shadow-card overflow-hidden hover:shadow-lg transition-shadow',
                  isBooked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                )}
                onClick={() => !isBooked && handleViewDetails(vehicle)}
                onDoubleClick={() => !isBooked && handleViewDetails(vehicle)}
              >
            {/* Header badges */}
            <div className="relative">
              <img
                src={vehicle.image || vehicle.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'}
                alt={vehicle.name}
                className="w-full h-28 object-cover"
              />
              {isBooked && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="bg-pink-600 text-white uppercase font-bold px-2 py-0.5 rounded text-[10px]">
                    Out of Stock
                  </div>
                </div>
              )}
              {/* Rating Badge */}
              <div
                className={cn(
                  'absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white',
                  getRatingColor(vehicle.rating || 4.5)
                )}
              >
                <Star className="h-2.5 w-2.5 fill-current" />
                {(vehicle.rating || 4.5).toFixed(1)} ({vehicle.reviewCount || vehicle.reviews || 0})
              </div>

              {/* Trips Badge */}
              <div className="absolute bottom-1.5 right-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {vehicle.trips || 0} Trips
              </div>
            </div>

            {/* Content */}
            <div className="p-2">
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <h3 className="font-semibold text-xs text-foreground line-clamp-2 leading-tight">{vehicle.name}</h3>
                <Button variant="link" className="h-auto p-0 text-primary text-[10px] shrink-0 hidden sm:block">
                  View All Packages
                </Button>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                <span className="flex items-center gap-0.5">
                  <Settings2 className="h-2.5 w-2.5" />
                  {(vehicle.transmission || 'manual').substring(0, 4)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Users className="h-2.5 w-2.5" />
                  {(vehicle.seatingCapacity || vehicle.seats || 2)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Fuel className="h-2.5 w-2.5" />
                  {(vehicle.fuelType || 'Petrol').substring(0, 3)}
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-end justify-between gap-1">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-primary">₹{(vehicle.pricePerDay || vehicle.dailyRate || 0).toLocaleString()}</span>
                    <span className="text-[9px] text-muted-foreground hidden sm:inline">/day</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">Fuel Excl.</p>
                </div>
                <Button
                  size="sm"
                  className={cn(
                    'h-6 text-[10px] px-2',
                    isBooked ? 'bg-gray-200 text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                  )}
                  onClick={(e) => { e.stopPropagation(); if (!isBooked) handleViewDetails(vehicle); }}
                  disabled={isBooked}
                >
                  View
                </Button>
              </div>

              {/* Footer - hidden on small screens */}
              <div className="hidden sm:flex items-center justify-between pt-2 mt-2 border-t border-border text-[10px] text-muted-foreground">
                <span>Deposit: ₹{(vehicle.deposit || vehicle.securityDeposit || 0).toLocaleString()}</span>
                <span>{vehicle.year || new Date().getFullYear()}</span>
              </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}
