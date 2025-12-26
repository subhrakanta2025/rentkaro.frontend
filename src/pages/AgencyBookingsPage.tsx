import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Car,
  Bike,
  Clock,
  DollarSign,
  User,
  Filter,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  PackageCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BookingRecord = {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType?: string | null;
  vehicleImage?: string | null;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  startDate: string;
  endDate: string;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt?: string | null;
};

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-500',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-500',
    icon: CheckCircle,
  },
  ongoing: {
    label: 'Ongoing',
    color: 'bg-green-500',
    icon: Clock,
  },
  active: {
    label: 'Ongoing',
    color: 'bg-green-500',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-500',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: XCircle,
  },
} as const;

export default function AgencyBookingsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [filterType, setFilterType] = useState<'all' | 'bike' | 'car'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadBookings = async (opts?: { search?: string; status?: string; vehicleType?: string }) => {
    setLoading(true);
    try {
      const resp: any = await apiClient.getBookings({
        search: opts?.search,
        status: opts?.status,
        vehicleType: opts?.vehicleType,
      });
      const apiBookings: BookingRecord[] = (resp.bookings || []).map((b: any) => ({
        id: b.id,
        vehicleId: b.vehicleId,
        vehicleName: b.vehicleName || 'Vehicle',
        vehicleType: b.vehicleType,
        vehicleImage: b.vehicleImage,
        customerName: b.customer?.name,
        customerPhone: b.customer?.phone,
        customerEmail: b.customer?.email,
        startDate: b.startDate,
        endDate: b.endDate,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        totalAmount: Number(b.totalAmount || 0),
        status: b.status,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt,
      }));
      setBookings(apiBookings);
    } catch (error: any) {
      console.error('Failed to load bookings', error);
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      loadBookings({
        search: searchQuery.trim() || undefined,
        status: filterStatus === 'all' ? undefined : filterStatus,
        vehicleType: filterType === 'all' ? undefined : filterType,
      });
    }, 250);
    return () => clearTimeout(handle);
  }, [searchQuery, filterStatus, filterType]);

  // Update booking status
  const updateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'ongoing' | 'completed' | 'cancelled') => {
    setUpdatingStatus(true);
    apiClient.updateBookingStatus(bookingId, newStatus)
      .then(() => {
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        const statusText = newStatus === 'ongoing' ? 'Vehicle Picked Up' : 'Vehicle Returned';
        toast.success(`Status updated: ${statusText}`);
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      })
      .catch((error: any) => {
        console.error('Failed to update status', error);
        toast.error(error.message || 'Failed to update booking status');
      })
      .finally(() => setUpdatingStatus(false));
  };

  // Client-side safety filter (after backend filters)
  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const lookup = `${booking.id} ${booking.vehicleName || ''} ${booking.customerName || ''}`.toLowerCase();
    const matchesSearch = searchQuery.trim() ? lookup.includes(searchQuery.toLowerCase()) : true;
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesType = filterType === 'all' || booking.vehicleType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  }), [bookings, searchQuery, filterStatus, filterType]);

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const ongoingBookings = bookings.filter((b) => b.status === 'ongoing' || b.status === 'active').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <DashboardLayout title="Bookings" description="Manage and track all your vehicle bookings">
      <div className="container-dashboard">
        {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-foreground">{totalBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                  <p className="text-xl font-bold text-blue-600">{confirmedBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                  <Clock className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ongoing</p>
                  <p className="text-xl font-bold text-green-600">{ongoingBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-500/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold text-gray-600">{completedBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking ID, customer, or vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bike">2 Wheelers</SelectItem>
                <SelectItem value="car">4 Wheelers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBookings.length} of {totalBookings} bookings
          </p>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your filters'
                : 'You have no bookings yet'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusKey = (booking.status || 'pending') as keyof typeof statusConfig;
              const statusMeta = statusConfig[statusKey] || statusConfig.pending;
              const StatusIcon = statusMeta.icon;
              const durationDays = Math.max(
                1,
                Math.round((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))
              );

              return (
                <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vehicle Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={booking.vehicleImage || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=700&h=500&fit=crop'}
                        alt={booking.vehicleName}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{booking.vehicleName}</h3>
                            <Badge variant="outline">
                              {booking.vehicleType === 'bike' ? (
                                <Bike className="h-3 w-3 mr-1" />
                              ) : (
                                <Car className="h-3 w-3 mr-1" />
                              )}
                              {booking.vehicleType === 'bike' ? '2W' : booking.vehicleType === 'car' ? '4W' : booking.vehicleType || '—'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Booking ID: {booking.id?.slice(0, 10) || '—'}</p>
                        </div>
                        <Badge className={statusMeta.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusMeta.label}
                        </Badge>
                      </div>

                      {/* Customer & Date Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{booking.customerName || 'Customer'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{booking.customerPhone || 'Not shared'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{booking.customerEmail || 'Not shared'}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(booking.startDate), 'dd MMM yyyy')} -{' '}
                              {format(new Date(booking.endDate), 'dd MMM yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{durationDays} days</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              ₹{Number(booking.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p>
                            <span className="font-medium">Pickup:</span> {booking.pickupLocation || 'Pickup TBD'}
                          </p>
                          <p>
                            <span className="font-medium">Drop:</span> {booking.dropoffLocation || 'Same as pickup'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowContactModal(true);
                          }}
                        >
                          <Phone className="h-4 w-4" />
                          Contact Customer
                        </Button>
                        
                        {/* Status Update Buttons */}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => updateBookingStatus(booking.id, 'ongoing')}
                            disabled={updatingStatus}
                          >
                            <PackageCheck className="h-4 w-4" />
                            Mark Picked Up
                          </Button>
                        )}
                        
                        {(booking.status === 'ongoing' || booking.status === 'active') && (
                          <Button
                            size="sm"
                            variant="default"
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            disabled={updatingStatus}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Mark Returned
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Vehicle Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={selectedBooking.vehicleImage || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=700&h=500&fit=crop'}
                  alt={selectedBooking.vehicleName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-semibold text-foreground">{selectedBooking.id?.slice(0, 12) || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={cn('capitalize', statusConfig[selectedBooking.status as keyof typeof statusConfig].color)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="text-lg font-semibold text-foreground">{selectedBooking.vehicleName}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {selectedBooking.vehicleType === 'bike' ? (
                    <span className="flex items-center gap-1">
                      <Bike className="h-4 w-4" /> 2 Wheeler
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" /> 4 Wheeler
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold text-foreground">
                    {format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold text-foreground">
                    {format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Location</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <span><span className="font-medium">Pickup:</span> {selectedBooking.pickupLocation || 'Pickup TBD'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-destructive mt-0.5" />
                    <span><span className="font-medium">Drop:</span> {selectedBooking.dropoffLocation || 'Same as pickup'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold text-foreground">
                    {Math.max(
                      1,
                      Math.round(
                        (new Date(selectedBooking.endDate).getTime() - new Date(selectedBooking.startDate).getTime()) / (1000 * 60 * 60 * 24)
                      )
                    )} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{Number(selectedBooking.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="font-semibold text-foreground">
                  {selectedBooking.createdAt
                    ? format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy')
                    : format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Customer Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
            <DialogDescription>
              Customer contact information for this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                </div>
                <p className="text-lg font-semibold text-foreground">{selectedBooking.customerName || 'Not shared'}</p>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                </div>
                <a 
                  href={selectedBooking.customerPhone ? `tel:${selectedBooking.customerPhone}` : '#'} 
                  className="text-lg font-semibold text-primary hover:underline flex items-center gap-2"
                >
                  {selectedBooking.customerPhone || 'Not shared'}
                  {selectedBooking.customerPhone && <Phone className="h-4 w-4" />}
                </a>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
                {selectedBooking.customerEmail ? (
                  <a 
                    href={`mailto:${selectedBooking.customerEmail}`} 
                    className="text-lg font-semibold text-primary hover:underline break-all flex items-center gap-2"
                  >
                    {selectedBooking.customerEmail}
                    <Mail className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-foreground">Not shared</p>
                )}
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                <p className="text-lg font-semibold text-foreground">{selectedBooking.id?.slice(0, 12) || '—'}</p>
              </div>

              <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
                <p className="text-sm text-warning font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Important Notes:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Confirm pickup time with customer 24 hours before</li>
                  <li>Inspect vehicle condition before handover</li>
                  <li>Take photos/videos of vehicle condition</li>
                  <li>Verify customer ID and documents</li>
                  <li>Check driving license validity</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
