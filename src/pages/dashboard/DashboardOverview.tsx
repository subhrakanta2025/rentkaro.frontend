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
      <div className="rounded-xl border border-border bg-card p-4 shadow-card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* City Select with Location Button */}
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground mb-1 block">City</label>
            <div className="flex gap-2">
              <Popover open={isCityPickerOpen} onOpenChange={setIsCityPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-10 flex-1 justify-between"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">
                        {selectedCity || 'All cities'}
                      </span>
                    </span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
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
                className="h-10 w-10 shrink-0"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                title="Use current location"
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4 text-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-muted-foreground mb-1 block">Pickup Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-10 justify-start text-left font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
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
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-muted-foreground mb-1 block">Dropoff Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-10 justify-start text-left font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
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
            <Button className="h-10 px-8 bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Filter Options Row */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Vehicle Type */}
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="w-[130px] h-9">
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
            <SelectTrigger className="w-[130px] h-9">
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
            <SelectTrigger className="w-[120px] h-9">
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
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading vehicles...' : (
            <>
              Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> vehicles in{' '}
              <span className="font-semibold text-foreground">{selectedCity || 'all cities'}</span>
            </>
          )}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Vehicle Grid */}
      {isError && (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-destructive mb-4">
          Unable to load vehicles. Please refresh.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <VehicleCardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          No vehicles match your filters. Try adjusting search or vehicle category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredVehicles.map((vehicle: any) => {
            const isBooked = vehicle.isAvailable === false || (vehicle.status || '').toLowerCase() === 'booked';
            return (
              <div
                key={vehicle.id}
                className={cn(
                  'rounded-xl border border-border bg-card shadow-card overflow-hidden hover:shadow-lg transition-shadow',
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
                className="w-full h-36 object-cover"
              />
              {isBooked && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="bg-pink-600 text-white uppercase font-bold px-4 py-1 rounded">
                    Out of Stock
                  </div>
                </div>
              )}
              {/* Rating Badge */}
              <div
                className={cn(
                  'absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white',
                  getRatingColor(vehicle.rating || 4.5)
                )}
              >
                <Star className="h-3 w-3 fill-current" />
                {(vehicle.rating || 4.5).toFixed(1)} ({vehicle.reviewCount || vehicle.reviews || 0} reviews)
              </div>

              {/* Top Right Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {vehicle.pickupAvailable && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 py-0.5">
                    Pay at Pickup Available
                  </Badge>
                )}
                {vehicle.homeDelivery && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0.5">
                    <Truck className="h-3 w-3 mr-1" />
                    Home Delivery
                  </Badge>
                )}
              </div>

              {/* Trips Badge */}
              <div className="absolute bottom-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                {vehicle.trips || 0} Trips
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground">{vehicle.name}</h3>
                <Button variant="link" className="h-auto p-0 text-primary text-xs">
                  View All Packages
                </Button>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Settings2 className="h-3 w-3" />
                  {vehicle.transmission || 'Manual'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {(vehicle.seatingCapacity || vehicle.seats || 4)} Seater
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  {vehicle.fuelType || 'Petrol'}
                </span>
              </div>

              {/* Location Dropdown */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Available at</p>
                <Select defaultValue={vehicle.location || vehicle.locations?.[0]}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {(vehicle.locations || [vehicle.location || 'Pickup shared post booking']).map((loc: string) => (
                      <SelectItem key={loc} value={loc} className="text-xs">
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Section */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">₹{(vehicle.pricePerDay || vehicle.dailyRate || 0).toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">(incl. Tax)</span>
                  </div>
                  {vehicle.originalPrice && vehicle.discount && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{vehicle.originalPrice}
                      </span>
                      <span className="text-xs text-green-500 font-semibold">
                        ({vehicle.discount}% off)
                      </span>
                    </div>
                  )}
                  {vehicle.kmLimit && vehicle.extraKm && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {vehicle.kmLimit} • Extra {vehicle.extraKm}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">Fuel Excluded</p>
                </div>
                <Button
                  size="sm"
                  className={cn(
                    isBooked ? 'bg-gray-200 text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                  )}
                  onClick={(e) => { e.stopPropagation(); if (!isBooked) handleViewDetails(vehicle); }}
                  disabled={isBooked}
                >
                  View Details
                </Button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <span>Deposit: ₹{(vehicle.deposit || vehicle.securityDeposit || 0).toLocaleString()}</span>
                <span>Make Year: {vehicle.year || new Date().getFullYear()}</span>
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
