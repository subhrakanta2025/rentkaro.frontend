import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  User,
  Car,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Edit,
  ChevronRight,
  History,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  created_at: string;
}

export default function CustomerDashboardPage() {
  const { user, profile, kycStatus, isKYCVerified, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'profile'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.start_date) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.end_date) < new Date() || b.status === 'cancelled'
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      confirmed: 'bg-success/10 text-success border-success/20',
      ongoing: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-muted text-muted-foreground border-border',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return styles[status] || styles.pending;
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Bookings', icon: Calendar },
    { id: 'history', label: 'Booking History', icon: History },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.fullName || 'User'}!
          </h1>
          <p className="text-muted-foreground">Manage your bookings and account</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {bookings.filter((b) => b.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Wallet className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{bookings.reduce((sum, b) => sum + Number(b.total_amount), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                isKYCVerified ? "bg-success/10" : "bg-warning/10"
              )}>
                <Shield className={cn("h-6 w-6", isKYCVerified ? "text-success" : "text-warning")} />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {isKYCVerified ? 'Verified' : 'Pending'}
                </p>
                <p className="text-sm text-muted-foreground">KYC Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-4">Start exploring vehicles to book</p>
                  <Link to="/vehicles">
                    <Button variant="hero" className="gap-2">
                      Browse Vehicles
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            Booking #{booking.id.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(booking.start_date), 'MMM dd, yyyy')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {booking.pickup_location}
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                          getStatusBadge(booking.status)
                        )}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ₹{Number(booking.total_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {booking.payment_status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                </div>
              ) : pastBookings.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">Your completed rentals will appear here</p>
                </div>
              ) : (
                pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            Booking #{booking.id.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(booking.start_date), 'MMM dd, yyyy')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                          getStatusBadge(booking.status)
                        )}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ₹{Number(booking.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {profile?.fullName || 'User'}
                  </h3>
                  <p className="text-muted-foreground">{profile?.email || user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{profile?.email || user?.email}</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{profile?.phone || 'Not set'}</p>
                </div>
              </div>

              {/* KYC Status */}
              <div className={cn(
                "p-4 rounded-lg border",
                isKYCVerified ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className={cn("h-6 w-6", isKYCVerified ? "text-success" : "text-warning")} />
                    <div>
                      <p className="font-medium text-foreground">
                        KYC Verification
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isKYCVerified 
                          ? 'Your identity is verified' 
                          : 'Complete KYC to book vehicles'}
                      </p>
                    </div>
                  </div>
                  {!isKYCVerified && (
                    <Link to="/kyc-verification">
                      <Button size="sm" variant="outline">
                        Verify Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" onClick={handleSignOut} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
