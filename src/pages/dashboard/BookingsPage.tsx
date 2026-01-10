import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  History,
  MapPin,
  Phone,
  Eye,
  CheckCircle,
  RotateCcw,
  Mail,
  RefreshCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fallbackVehicleImage = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=700&h=500&fit=crop';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
  ongoing: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  active: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border border-rose-200',
};

const paymentStyles: Record<string, string> = {
  paid: 'text-emerald-600',
  completed: 'text-emerald-600',
  pending: 'text-amber-600',
  refunded: 'text-blue-600',
};

type BookingRecord = {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType?: string | null;
  vehicleImage?: string | null;
  startDate: string;
  endDate: string;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customer?: {
    id?: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  createdAt?: string | null;
};

type BookingsResponse = {
  bookings: BookingRecord[];
};

type StatusMutationVars = {
  bookingId: string;
  status: 'ongoing' | 'completed';
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

  const { data, isLoading, isError, refetch } = useQuery<BookingsResponse>({
    queryKey: ['bookings'],
    queryFn: () => apiClient.getBookings(),
  });

  const bookings = data?.bookings ?? [];
  const isAgency = userRole === 'agency';

  const { upcomingBookings, historyBookings } = useMemo(() => {
    const now = new Date();
    const upcoming = bookings.filter((booking) => {
      const endDate = new Date(booking.endDate);
      return endDate >= now && booking.status !== 'cancelled';
    });
    const history = bookings.filter((booking) => {
      const endDate = new Date(booking.endDate);
      return endDate < now || booking.status === 'cancelled';
    });
    return { upcomingBookings: upcoming, historyBookings: history };
  }, [bookings]);

  const statusMutation = useMutation({
    mutationFn: ({ bookingId, status }: StatusMutationVars) => apiClient.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
    onError: () => {
      toast.error('Failed to update booking status');
    },
  });

  const currentList = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

  const statusOptions = useMemo(() => {
    const statuses = bookings.map((b) => b.status).filter(Boolean);
    return Array.from(new Set(statuses));
  }, [bookings]);

  const filteredList = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return currentList.filter((booking) => {
      const matchesTerm = term
        ? [
            booking.id,
            booking.vehicleName,
            booking.pickupLocation,
            booking.dropoffLocation,
            booking.customer?.name,
          ]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(term))
        : true;

      const matchesStatus = statusFilter === 'all' ? true : booking.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [currentList, searchTerm, statusFilter]);

  const handleOpenDetails = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleOpenContact = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setContactOpen(true);
  };

  const renderStatusActions = (booking: BookingRecord) => {
    if (activeTab !== 'upcoming') return null;
    if (!isAgency) return null; // Only agencies can update pickup/return status
    if (booking.status === 'confirmed' || booking.status === 'pending') {
      return (
        <Button
          size="sm"
          variant="hero"
          className="gap-2"
          disabled={statusMutation.isPending}
          onClick={() => statusMutation.mutate({ bookingId: booking.id, status: 'ongoing' })}
        >
          <CheckCircle className="h-4 w-4" />
          Picked up
        </Button>
      );
    }
    if (booking.status === 'ongoing' || booking.status === 'active') {
      return (
        <Button
          size="sm"
          variant="hero"
          className="gap-2"
          disabled={statusMutation.isPending}
          onClick={() => statusMutation.mutate({ bookingId: booking.id, status: 'completed' })}
        >
          <RotateCcw className="h-4 w-4" />
          Return vehicle
        </Button>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Bookings" description="Track upcoming rides and completed trips in one place">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total bookings</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{bookings.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
              <p className="mt-2 text-3xl font-bold text-primary">{upcomingBookings.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">History</p>
              <p className="mt-2 text-3xl font-bold text-muted-foreground">{historyBookings.length}</p>
            </Card>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by booking ID, vehicle, or location"
                className="w-72"
              />
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'history')}>
                <TabsList>
                  <TabsTrigger value="upcoming" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <History className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">We could not load your bookings</p>
              <p className="text-sm text-muted-foreground">Please refresh or try again later.</p>
              <Button className="mt-4" onClick={() => refetch()} variant="hero">
                Try again
              </Button>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12">
              {activeTab === 'upcoming' ? (
                <Calendar className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              ) : (
                <History className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              )}
              <p className="text-lg font-semibold text-foreground">
                {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'upcoming'
                  ? 'Book a vehicle to see it appear here.'
                  : 'Completed and cancelled trips will show up in history.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredList.map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-border/70 p-4">
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="w-full md:w-48">
                      <img
                        src={booking.vehicleImage || fallbackVehicleImage}
                        alt={booking.vehicleName}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Vehicle</p>
                          <h3 className="text-xl font-semibold text-foreground">{booking.vehicleName || 'Reserved vehicle'}</h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(booking.startDate), 'MMM dd, yyyy')} – {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {booking.pickupLocation || 'Pickup details TBD'}
                          </div>
                        </div>
                        <Badge className={cn('text-xs font-semibold capitalize', statusStyles[booking.status] || statusStyles.pending)}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-border/60 p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Drop-off</p>
                          <p className="mt-1 font-semibold text-foreground">
                            {booking.dropoffLocation || 'Same as pickup'}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment status</p>
                          <p className={cn('mt-1 font-semibold capitalize', paymentStyles[booking.paymentStatus] || 'text-muted-foreground')}>
                            {booking.paymentStatus || 'pending'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenDetails(booking)}>
                          <Eye className="h-4 w-4" />
                          View details
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenContact(booking)}>
                          <Phone className="h-4 w-4" />
                          Contact
                        </Button>
                        {renderStatusActions(booking)}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-4 md:w-44">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Trip total</p>
                        <p className="text-2xl font-bold text-foreground">
                          ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-muted/40 p-3 w-full text-sm text-muted-foreground">
                        <p>Booked on</p>
                        <p className="font-semibold text-foreground">
                          {booking.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>Full snapshot of the reservation</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Booking ID</p>
                  <p className="mt-1 font-semibold text-foreground">#{selectedBooking.id.slice(0, 12)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                  <p className="mt-1 font-semibold capitalize">
                    {selectedBooking.status}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Start date</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {format(new Date(selectedBooking.startDate), 'dd MMM yyyy, p')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">End date</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {format(new Date(selectedBooking.endDate), 'dd MMM yyyy, p')}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Pickup</p>
                  <p className="mt-1 font-semibold text-foreground">{selectedBooking.pickupLocation || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Drop-off</p>
                  <p className="mt-1 font-semibold text-foreground">{selectedBooking.dropoffLocation || 'Same as pickup'}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Total amount</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    ₹{Number(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment status</p>
                  <p className="mt-1 font-semibold capitalize">
                    {selectedBooking.paymentStatus || 'pending'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Contact details</DialogTitle>
            <DialogDescription>Reach out regarding this booking</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer name</p>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedBooking.customer?.name || 'Not shared'}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                {selectedBooking.customer?.phone ? (
                  <a
                    className="mt-1 inline-flex items-center gap-2 font-semibold text-primary"
                    href={`tel:${selectedBooking.customer.phone}`}
                  >
                    <Phone className="h-4 w-4" />
                    {selectedBooking.customer.phone}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-muted-foreground">Not provided</p>
                )}
              </div>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                {selectedBooking.customer?.email ? (
                  <a
                    className="mt-1 inline-flex items-center gap-2 font-semibold text-primary"
                    href={`mailto:${selectedBooking.customer.email}`}
                  >
                    <Mail className="h-4 w-4" />
                    {selectedBooking.customer.email}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
