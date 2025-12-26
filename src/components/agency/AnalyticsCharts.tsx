import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval, subMonths, startOfMonth, eachMonthOfInterval } from 'date-fns';

interface Booking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface AnalyticsChartsProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  transactions: Transaction[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];

export function AnalyticsCharts({ bookings, vehicles, transactions }: AnalyticsChartsProps) {
  // Booking trends - last 7 days
  const bookingTrends = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const count = bookings.filter(b => {
        const bookingDate = startOfDay(new Date(b.created_at));
        return bookingDate.getTime() === dayStart.getTime();
      }).length;

      return {
        date: format(day, 'EEE'),
        bookings: count,
      };
    });
  }, [bookings]);

  // Revenue over time - last 6 months
  const revenueOverTime = useMemo(() => {
    const today = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(startOfMonth(today), 5),
      end: startOfMonth(today),
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const revenue = transactions
        .filter(t => {
          if (t.status !== 'success') return false;
          const txnMonth = startOfMonth(new Date(t.created_at));
          return txnMonth.getTime() === monthStart.getTime();
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        month: format(month, 'MMM'),
        revenue: revenue,
      };
    });
  }, [transactions]);

  // Popular vehicles
  const popularVehicles = useMemo(() => {
    const vehicleBookings: Record<string, number> = {};
    
    bookings.forEach(booking => {
      if (booking.status !== 'cancelled') {
        vehicleBookings[booking.vehicle_id] = (vehicleBookings[booking.vehicle_id] || 0) + 1;
      }
    });

    return Object.entries(vehicleBookings)
      .map(([vehicleId, count]) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return {
          name: vehicle?.name?.split(' ').slice(0, 2).join(' ') || 'Unknown',
          bookings: count,
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [bookings, vehicles]);

  // Booking status distribution
  const statusDistribution = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    
    bookings.forEach(booking => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Trends */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h4 className="text-base font-semibold text-foreground mb-4">Booking Trends (Last 7 Days)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Over Time */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h4 className="text-base font-semibold text-foreground mb-4">Revenue Over Time (6 Months)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis 
                  className="text-xs" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Vehicles */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h4 className="text-base font-semibold text-foreground mb-4">Most Popular Vehicles</h4>
          <div className="h-64">
            {popularVehicles.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No booking data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularVehicles} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h4 className="text-base font-semibold text-foreground mb-4">Booking Status Distribution</h4>
          <div className="h-64">
            {statusDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No booking data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
