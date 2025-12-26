import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useAgencyProfile } from '@/hooks/useAgencyProfile';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';
import {
  Bike,
  Car,
  Search,
  MapPin,
  Gauge,
  Zap,
  AlertTriangle,
  Plus,
  Edit,
  Power,
} from 'lucide-react';

const getFullImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return `${baseUrl.replace('/api', '')}${url}`;
};

const formatCurrency = (value?: number | null) => {
  if (!value) return 'Set a price';
  return `₹${value.toLocaleString('en-IN')}`;
};

type OwnerVehiclesResponse = {
  vehicles: Array<{
    id: string;
    make: string;
    model: string;
    year?: number;
    vehicleType?: string;
    dailyRate?: number;
    location?: string;
    fuelType?: string | null;
    transmission?: string | null;
    seatingCapacity?: number | null;
    imageUrl?: string | null;
    status?: string | null;
    isAvailable?: boolean;
  }>;
};

export default function MyVehiclesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profileData, isLoading: profileLoading } = useAgencyProfile();
  const hasAgency = profileData?.agencyStatus?.hasAgency ?? false;
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bike' | 'car'>('all');

  const {
    data,
    isLoading: vehiclesLoading,
    isError,
    refetch,
  } = useQuery<OwnerVehiclesResponse>({
    queryKey: ['agency-vehicles', user?.id],
    queryFn: () => apiClient.getOwnerVehicles(user?.id as string),
    enabled: Boolean(user?.id && hasAgency),
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ vehicleId, isAvailable }: { vehicleId: string; isAvailable: boolean }) =>
      apiClient.updateVehicleAvailability(vehicleId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-vehicles', user?.id] });
      toast.success('Vehicle availability updated');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update availability');
    },
  });

  const vehicles = data?.vehicles ?? [];
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const type = (vehicle.vehicleType || '').toLowerCase();
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'bike' ? type.includes('bike') || type.includes('scooter') : type.includes('car'));
      const matchesSearch = `${vehicle.make} ${vehicle.model}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [vehicles, searchQuery, typeFilter]);

  const totalVehicles = vehicles.length;
  const liveVehicles = vehicles.filter((vehicle) => vehicle.isAvailable).length;
  const pausedVehicles = totalVehicles - liveVehicles;

  const isFetching = profileLoading || (vehiclesLoading && hasAgency);

  if (!profileLoading && !hasAgency) {
    return (
      <DashboardLayout title="Fleet" description="Manage the vehicles listed under your agency">
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">Agency tools locked</h2>
          <p className="mt-2 text-muted-foreground">
            Register and verify your agency to start listing vehicles and tracking fleet performance.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/agency/register">
              <Button variant="hero">Register agency</Button>
            </Link>
            <Link to="/dashboard/settings/profile">
              <Button variant="outline">Go to profile</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isFetching) {
    return (
      <DashboardLayout title="Fleet" description="Manage the vehicles listed under your agency">
        <div className="space-y-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Fleet" description="Manage the vehicles listed under your agency">
        <Card className="p-10 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-semibold text-foreground">We could not load your vehicles</h2>
          <p className="mt-2 text-muted-foreground">Please refresh or try again in a moment.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Button onClick={() => refetch()} variant="hero">Retry</Button>
            <Link to="/agency/add-vehicle">
              <Button variant="outline">Add vehicle</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Fleet" description="Manage the vehicles listed under your agency">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">You can pause listings anytime without losing progress.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total vehicles</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{totalVehicles}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Live</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-bold text-emerald-600">{liveVehicles}</p>
                  <span className="text-xs text-muted-foreground">available</span>
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Paused</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-bold text-amber-600">{pausedVehicles}</p>
                  <span className="text-xs text-muted-foreground">offline</span>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
            <Link to="/agency/add-vehicle">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add vehicle
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by make or model"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="bike">2 wheelers</TabsTrigger>
                <TabsTrigger value="car">4 wheelers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>

        {filteredVehicles.length === 0 ? (
          <Card className="p-12 text-center">
            <Car className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No vehicles match the filters</h3>
            <p className="mt-2 text-muted-foreground">Adjust search criteria or add a new listing.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setSearchQuery('')}>Clear search</Button>
              <Link to="/agency/add-vehicle">
                <Button variant="hero">Add vehicle</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => {
              const imageUrl = getFullImageUrl(vehicle.imageUrl) ||
                'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop';
              const type = (vehicle.vehicleType || '').toLowerCase();
              const isBike = type.includes('bike') || type.includes('scooter');
              const badgeColor = vehicle.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';

              return (
                <Card key={vehicle.id} className="p-5">
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="w-full md:w-52">
                      <img
                        src={imageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-36 w-full rounded-2xl object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="secondary" className="gap-1">
                          {isBike ? <Bike className="h-3.5 w-3.5" /> : <Car className="h-3.5 w-3.5" />}
                          {isBike ? '2 Wheeler' : '4 Wheeler'}
                        </Badge>
                        <Badge className={badgeColor}>{vehicle.isAvailable ? 'Live' : 'Paused'}</Badge>
                        {vehicle.status && (
                          <Badge variant="outline" className="text-xs">
                            {vehicle.status.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {vehicle.location || 'Location not set'}
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-border/60 p-3">
                          <p className="text-xs text-muted-foreground">Daily rate</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(vehicle.dailyRate)}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-3">
                          <p className="text-xs text-muted-foreground">Powertrain</p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-foreground">
                            <Zap className="h-4 w-4 text-primary" />
                            {vehicle.fuelType || vehicle.transmission || 'Details pending'}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-3">
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-foreground">
                            <Gauge className="h-4 w-4 text-primary" />
                            {vehicle.seatingCapacity ? `${vehicle.seatingCapacity} seats` : 'Update seats'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-4 md:w-52">
                      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Availability</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">
                            {availabilityMutation.isPending && availabilityMutation.variables?.vehicleId === vehicle.id
                              ? 'Updating...'
                              : vehicle.isAvailable ? 'Live' : 'Paused'}
                          </span>
                          <Switch
                            checked={Boolean(vehicle.isAvailable)}
                            disabled={availabilityMutation.isPending}
                            onCheckedChange={(checked) =>
                              availabilityMutation.mutate({ vehicleId: vehicle.id, isAvailable: checked })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/agency/edit-vehicle/${vehicle.id}`}>
                          <Button variant="outline" className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Edit listing
                          </Button>
                        </Link>
                        <Link to={`/agency/bookings?vehicle=${vehicle.id}`}>
                          <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                            <Power className="h-4 w-4" />
                            View activity
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
