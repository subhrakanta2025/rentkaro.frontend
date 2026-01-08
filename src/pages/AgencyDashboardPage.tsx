import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import { useAgencyProfile } from '@/hooks/useAgencyProfile';
import {
  Building2,
  Car,
  Calendar,
  Wallet,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type OwnerVehiclesResponse = {
  vehicles: Array<{
    id: string;
    make: string;
    model: string;
    year: number;
    vehicleType: string;
    fuelType?: string;
    dailyRate?: number;
    isAvailable?: boolean;
    status?: string;
    imageUrl?: string | null;
  }>;
};

type BookingRecord = {
  id: string;
  agencyId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType?: string | null;
  vehicleImage?: string | null;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customer?: {
    id?: string | null;
    name?: string;
    phone?: string;
    email?: string;
  };
};

type BookingsResponse = {
  bookings: BookingRecord[];
};

type AgencyDetailResponse = {
  agency: {
    id: string;
    agencyName: string;
    businessType?: string | null;
    registrationNumber?: string | null;
    gstNumber?: string | null;
    panNumber?: string | null;
    agencyPhone?: string | null;
    agencyEmail?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
  };
};

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-indigo-100 text-indigo-800',
  ongoing: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 font-semibold text-foreground">{value || 'Not provided'}</p>
  </div>
);

export default function AgencyDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading: profileLoading } = useAgencyProfile();
  const agencyStatus = data?.agencyStatus;
  const agencyId = agencyStatus?.agencyId || undefined;

  const { data: agencyDetailData, isLoading: agencyDetailLoading } = useQuery<AgencyDetailResponse>({
    queryKey: ['agency-detail', agencyId],
    queryFn: () => apiClient.getAgency(agencyId as string),
    enabled: Boolean(agencyId),
  });

  const agencyDetails = agencyDetailData?.agency;

  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery<OwnerVehiclesResponse>({
    queryKey: ['agency-vehicles', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve({ vehicles: [] } as OwnerVehiclesResponse);
      }
      return apiClient.getOwnerVehicles(user.id);
    },
    enabled: Boolean(user?.id),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery<BookingsResponse>({
    queryKey: ['agency-bookings'],
    queryFn: () => apiClient.getBookings(),
    enabled: Boolean(agencyId),
  });

  const filteredBookings = useMemo(
    () => (bookingsData?.bookings || []).filter((booking) => booking.agencyId === agencyId),
    [bookingsData?.bookings, agencyId]
  );

  const vehicles = vehiclesData?.vehicles || [];
  const stats = agencyStatus?.stats || {};

  const totalVehicles = vehicles.length;
  const totalBookings = stats.lifetimeBookings ?? filteredBookings.length;
  const totalEarnings = stats.lifetimeEarnings ?? filteredBookings.reduce((sum, booking) => {
    if (booking.status === 'cancelled') return sum;
    return sum + (booking.totalAmount || 0);
  }, 0);
  const upcomingBookings = filteredBookings
    .filter((booking) => ['pending', 'confirmed', 'ongoing', 'active'].includes(booking.status))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const isLoading = profileLoading || agencyDetailLoading || vehiclesLoading || bookingsLoading;

  if (isLoading) {
    return (
      <DashboardLayout title="Agency Profile" description="Monitor how your business is performing">
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!agencyDetails || !agencyId) {
    return (
      <DashboardLayout title="Agency Profile" description="Monitor how your business is performing">
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-foreground">Almost there!</h2>
          <p className="mt-2 text-muted-foreground">Finish your agency registration to unlock fleet tools.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/agency/register">
              <Button variant="hero" className="gap-2">
                Complete registration
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard/settings/profile">
              <Button variant="outline">Go to profile</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Agency Profile" description="Monitor how your business is performing">
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Registered agency</p>
                <h1 className="text-2xl font-bold text-foreground">{agencyDetails.agencyName || 'Your agency'}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {[agencyDetails.city, agencyDetails.state].filter(Boolean).join(', ') || 'Location not set'}
                </p>
              </div>
            </div>
            <Badge className={cn('w-fit px-4 py-1 text-sm', agencyDetails.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
              {agencyDetails.isVerified ? 'Verified' : 'Under review'}
            </Badge>
            <Link to={`/agency/edit/${agencyId}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Fleet size</p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-bold">{totalVehicles}</p>
                <span className="text-xs text-muted-foreground">vehicles</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime bookings</p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-bold">{totalBookings}</p>
                <span className="text-xs text-muted-foreground">rides</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Earnings</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Active bookings</p>
              <p className="mt-2 text-3xl font-bold">{upcomingBookings.length}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Business type" value={agencyDetails.businessType || 'Not provided'} />
            <InfoRow label="GST number" value={agencyDetails.gstNumber || 'Not provided'} />
            <InfoRow label="Contact email" value={agencyDetails.agencyEmail || 'Not provided'} />
            <InfoRow label="Support phone" value={agencyDetails.agencyPhone || 'Not provided'} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming bookings</p>
                <h2 className="text-xl font-semibold text-foreground">{upcomingBookings.length ? 'Stay on top of check-ins' : 'No bookings scheduled'}</h2>
              </div>
              <Link to="/agency/bookings">
                <Button variant="outline" size="sm">View all</Button>
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {upcomingBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-border/70 bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{booking.vehicleName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.startDate), 'dd MMM')} — {format(new Date(booking.endDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <Badge className={cn('text-xs', statusBadge[booking.status] || 'bg-slate-100 text-slate-800')}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.pickupLocation}</span>
                    <span>→</span>
                    <span>{booking.dropoffLocation}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-semibold text-foreground">{formatCurrency(booking.totalAmount)}</span>
                    {booking.customer?.name && (
                      <span className="text-muted-foreground">Customer: {booking.customer.name}</span>
                    )}
                  </div>
                </div>
              ))}
              {!upcomingBookings.length && (
                <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                  New bookings will appear here as soon as customers confirm their ride.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fleet snapshot</p>
                <h2 className="text-xl font-semibold text-foreground">Your top vehicles</h2>
              </div>
              <Link to="/agency/my-vehicles">
                <Button variant="outline" size="sm">Manage fleet</Button>
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {vehicles.slice(0, 4).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Car className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.vehicleType} • {vehicle.year}</p>
                  </div>
                  <Badge variant="outline" className={vehicle.isAvailable ? 'border-emerald-200 text-emerald-700' : 'border-rose-200 text-rose-700'}>
                    {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              ))}

              {!vehicles.length && (
                <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                  No vehicles added yet. Start with your first listing today.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Add more vehicles</p>
                  <p className="text-xs text-muted-foreground">Hosts with 3+ vehicles appear in 2× more searches.</p>
                </div>
              </div>
              <Link to="/agency/add-vehicle" className="mt-4 inline-flex">
                <Button size="sm" variant="hero">Add vehicle</Button>
              </Link>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Support line</p>
                <p className="font-semibold text-foreground">{agencyDetails.agencyPhone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Agency email</p>
                <p className="font-semibold text-foreground">{agencyDetails.agencyEmail || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Active payouts</p>
                <p className="font-semibold text-foreground">{formatCurrency(totalEarnings)}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
