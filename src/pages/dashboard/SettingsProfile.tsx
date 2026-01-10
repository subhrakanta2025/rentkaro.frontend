import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import { useAgencyProfile } from '@/hooks/useAgencyProfile';
import { ProfileResponse } from '@/types/profile';
import {
  User,
  Shield,
  Building2,
  Sparkles,
  Phone,
  Mail,
  CalendarDays,
  Gauge,
  Car,
  ListChecks,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to get full image URL
const getFullImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8085/api';
  return `${baseUrl.replace('/api', '')}${url}`;
};

type FleetResponse = {
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

export default function SettingsProfile() {
  const { user, profile: authProfile, isKYCVerified } = useAuth();

  const { data, isLoading } = useAgencyProfile();

  const hasAgency = data?.agencyStatus?.hasAgency ?? false;
  const listingEnabled = (user?.canListVehicles ?? false) || hasAgency;
  const { data: fleetData, isLoading: fleetLoading } = useQuery<FleetResponse>({
    queryKey: ['profile-fleet', user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve({ vehicles: [] } as FleetResponse);
      }
      return apiClient.getOwnerVehicles(user.id);
    },
    enabled: Boolean(user?.id && listingEnabled),
  });
  const profileData = data?.profile;
  const metrics = data?.metrics ?? {};
  const agencyStatus = data?.agencyStatus ?? { hasAgency: false };
  const agencyStats = agencyStatus.stats ?? {};
  const agencyDetails = data?.agencyDetails ?? null;
  const agencyRegisteredOn = agencyDetails?.createdAt ? new Date(agencyDetails.createdAt) : null;
  const agencyRegisteredLabel = agencyRegisteredOn ? format(agencyRegisteredOn, 'dd MMM yyyy') : null;
  const agencyDisplayName = agencyStatus.agencyName || agencyDetails?.agencyName || 'Your agency';
  const fleetVehicles = fleetData?.vehicles ?? [];

  const safeProfile = {
    fullName: profileData?.fullName || authProfile?.fullName || 'Rider',
    email: profileData?.email || authProfile?.email || user?.email || 'Not specified',
    phone: profileData?.phone || authProfile?.phone || 'Add a phone number',
    memberSince: profileData?.memberSince || null,
  };
  const avatarUrl = getFullImageUrl(profileData?.avatarUrl || authProfile?.avatarUrl || null);
  const avatarLocked = profileData?.avatarLocked ?? authProfile?.avatarLocked ?? false;

  const memberSinceDate = safeProfile.memberSince ? new Date(safeProfile.memberSince) : null;
  const memberSinceLabel = memberSinceDate ? format(memberSinceDate, 'MMM yyyy') : 'Just joined';
  const vehiclesListed = metrics.vehiclesListed ?? agencyStats.listedVehicles ?? 0;
  const bookingsCompleted = metrics.completedTrips ?? agencyStats.lifetimeBookings ?? 0;
  const loyaltyScore = Math.min(100, Math.max(0, metrics.loyaltyScore ?? 45));
  const nextMilestone = metrics.nextMilestoneTrips ?? Math.max(0, 5 - (bookingsCompleted % 5));

  const aiInsight = useMemo(() => {
    if (!isKYCVerified) {
      return {
        title: 'Finish your verification',
        message: 'Complete KYC to unlock instant booking approvals and priority support.',
        action: 'Verify identity',
        cta: '/kyc-verification',
      };
    }

    if (!listingEnabled) {
      return {
        title: 'Turn your wheels into income',
        message: 'Register your agency and list at least one vehicle to start earning within 24 hours.',
        action: 'Register agency',
        cta: '/agency/register',
      };
    }

    if ((agencyStats.listedVehicles ?? 0) < 3) {
      return {
        title: 'Boost discoverability',
        message: 'Hosts with 3+ active vehicles appear in 2.3× more searches in their city.',
        action: 'Add another vehicle',
        cta: '/agency/add-vehicle',
      };
    }

    return {
      title: 'Fleet is in demand',
      message: 'Bookings look healthy. Enable premium doorstep delivery to capture corporate rentals.',
      action: 'Manage fleet',
      cta: '/agency/my-vehicles',
    };
  }, [agencyStats.listedVehicles, isKYCVerified, listingEnabled]);

  const contactRows = [
    { label: 'Email', value: safeProfile.email, icon: Mail },
    { label: 'Phone', value: safeProfile.phone, icon: Phone },
    { label: 'Member since', value: memberSinceLabel, icon: CalendarDays },
  ];

  const heroStats = [
    { label: 'Completed trips', value: bookingsCompleted ? `${bookingsCompleted}+` : 'Getting started' },
    { label: 'Vehicles live', value: listingEnabled ? vehiclesListed : 'Locked' },
    { label: 'Next milestone', value: `${nextMilestone} trips to unlock perks` },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="My Profile" description="Manage your personal information">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-60 rounded-2xl" />
            <Skeleton className="h-60 rounded-2xl" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile" description="Manage your personal information">
      <div className="space-y-6">
        {/* Hero - Green Gradient Design */}
        <section className="rounded-3xl border-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-700 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80 font-semibold">Profile intelligence</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 overflow-hidden border-2 border-white/30 shadow-lg">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-4xl font-bold leading-tight">{safeProfile.fullName}</h2>
                  <p className="text-sm text-white/80 mt-1">{safeProfile.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 border">
                {listingEnabled ? 'Agency Partner' : 'Rider' }
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs uppercase tracking-wide border',
                  isKYCVerified ? 'bg-emerald-600/40 text-white border-white/30' : 'bg-amber-400/40 text-white border-white/30'
                )}
              >
                {isKYCVerified ? '✓ KYC Verified' : 'KYC pending'}
              </Badge>
              {avatarUrl && (
                <Badge variant="secondary" className={cn(
                  'text-xs uppercase tracking-wide border',
                  avatarLocked ? 'bg-blue-600/40 text-white border-white/30' : 'bg-white/20 text-white border-white/30'
                )}>
                  {avatarLocked ? '🔒 Selfie locked' : 'Photo editable'}
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
                <p className="text-xs uppercase text-white/70 font-semibold tracking-wide">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {typeof stat.value === 'string' ? stat.value : `${stat.value}`}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact + KYC */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Contact details</p>
            <div className="mt-4 space-y-4">
              {contactRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <row.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
                    <p className="font-medium text-foreground">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" disabled>
              Edit profile (coming soon)
            </Button>
          </div>

          {hasAgency ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{agencyDisplayName}</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your agency profile, compliance documents, and fleet from the dedicated agency module.
                    </p>
                    {agencyRegisteredLabel && (
                      <p className="mt-2 text-xs text-muted-foreground">Active since {agencyRegisteredLabel}</p>
                    )}
                  </div>
                </div>
                <Badge
                  className={agencyStatus.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}
                  variant="secondary"
                >
                  {agencyStatus.isVerified ? 'Verified' : 'In review'}
                </Badge>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/agency/dashboard">
                  <Button size="sm" variant="hero">Open agency dashboard</Button>
                </Link>
                <Link to="/agency/my-vehicles">
                  <Button size="sm" variant="outline">Manage fleet</Button>
                </Link>
                <Link to="/agency/bookings">
                  <Button size="sm" variant="outline">Agency bookings</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-2xl border p-6 shadow-sm transition-colors',
                avatarLocked 
                  ? 'border-blue-200 bg-blue-50' 
                  : isKYCVerified ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
              )}
            >
              <div className="flex items-start gap-3">
                <Shield className={cn(
                  'h-6 w-6',
                  avatarLocked 
                    ? 'text-blue-600' 
                    : isKYCVerified ? 'text-emerald-600' : 'text-amber-500'
                )} />
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {avatarLocked ? 'Profile Photo Locked' : 'KYC Verification'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {avatarLocked
                      ? 'Your KYC selfie is now your locked profile photo and cannot be changed.'
                      : isKYCVerified
                      ? 'Identity confirmed. You are ready for premium bookings.'
                      : 'Verify once to unlock bookings, payouts, and insurance cover.'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={avatarLocked ? 100 : isKYCVerified ? 100 : 45} className={cn(
                  avatarLocked 
                    ? 'bg-blue-100' 
                    : isKYCVerified ? 'bg-emerald-100' : 'bg-amber-100'
                )} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {avatarLocked 
                    ? 'Profile secured with KYC verification'
                    : isKYCVerified ? 'Completed' : '2 quick steps left'}
                </p>
              </div>
              {!isKYCVerified && (
                <Link to="/kyc-verification">
                  <Button size="sm" variant="hero" className="mt-4 w-full">
                    Complete KYC
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Insight + Metrics + Agency */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">AI insight</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{aiInsight.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{aiInsight.message}</p>
            {isKYCVerified ? (
              <Button size="sm" variant="outline" disabled className="mt-4">
                ✓ Verified
              </Button>
            ) : (
              <Link to={aiInsight.cta} className="mt-4 inline-flex">
                <Button size="sm" variant="outline">
                  {aiInsight.action}
                </Button>
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary">
              <Gauge className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">Engagement index</p>
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{loyaltyScore}/100</h3>
            <p className="text-sm text-muted-foreground">Consistency unlocks tailored discounts and marketing boosts.</p>
            <Progress value={loyaltyScore} className="mt-4" />
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                {bookingsCompleted} completed trips
              </li>
              <li className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                {vehiclesListed} vehicles listed
              </li>
              <li className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                {nextMilestone} trips to next perk
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary">Agency & fleet</p>
                  <h3 className="text-xl font-semibold text-foreground">
                    {listingEnabled ? agencyDisplayName : 'Become a partner'}
                  </h3>
                </div>
              </div>
              <Badge variant="secondary" className={listingEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                {listingEnabled ? (agencyStatus.isVerified ? 'Verified' : 'In review') : 'Locked'}
              </Badge>
            </div>

            {listingEnabled ? (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicles</p>
                    <p className="text-lg font-semibold text-foreground">{agencyStats.listedVehicles ?? vehiclesListed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                    <p className="text-lg font-semibold text-foreground">{agencyStats.lifetimeBookings ?? bookingsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Earnings</p>
                    <p className="text-lg font-semibold text-foreground">₹{(agencyStats.lifetimeEarnings ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {fleetLoading ? (
                    <>
                      <Skeleton className="h-16 rounded-xl" />
                      <Skeleton className="h-16 rounded-xl" />
                    </>
                  ) : fleetVehicles.length ? (
                    fleetVehicles.slice(0, 3).map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center gap-3 rounded-xl border border-primary/30 bg-white/70 p-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Car className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.year} · {vehicle.vehicleType}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={vehicle.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                        >
                          {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No vehicles listed yet.</p>
                  )}
                  {fleetVehicles.length > 3 && (
                    <p className="text-xs text-muted-foreground">Showing first 3 vehicles</p>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/agency/my-vehicles">
                    <Button size="sm" variant="hero">View fleet</Button>
                  </Link>
                  <Link to="/agency/add-vehicle">
                    <Button size="sm" variant="outline">Add vehicle</Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>List your vehicles, set availability, and start getting bookings instantly.</p>
                <Link to="/agency/register">
                  <Button variant="hero" className="w-full">
                    Register agency
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
