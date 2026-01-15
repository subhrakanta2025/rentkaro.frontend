import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Car,
  Bike,
  IndianRupee,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/services/api';

type RangeKey = 'week' | 'month' | 'year';

interface TopVehicle {
  name: string;
  type: string;
  bookings: number;
  earnings: number;
  avgPerBooking: number;
}

interface CategoryShare {
  name: string;
  type: string;
  earnings: number;
  percentage: number;
}

interface MonthlyTrendPoint {
  month: string;
  earnings: number;
  bookings: number;
}

interface VehiclePerformanceRow {
  name: string;
  type: string;
  bookings: number;
  earnings: number;
  avgPerBooking: number;
}

interface PaymentMethodShare {
  method: string;
  amount: number;
  percentage: number;
}

interface BookingRow {
  id: string;
  vehicleName: string;
  vehicleType?: string | null;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
}

interface EarningsResponse {
  range: RangeKey | string;
  summary: {
    totalEarnings: number;
    totalBookings: number;
    averagePerBooking: number;
    growthRate: number;
    topVehicle?: TopVehicle | null;
  };
  categories: CategoryShare[];
  monthlyTrend: MonthlyTrendPoint[];
  vehiclePerformance: VehiclePerformanceRow[];
  paymentMethods: PaymentMethodShare[];
}
const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString()}`;

const getRangeStart = (range: RangeKey, now: Date) => {
  if (range === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (range === 'year') {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  }
  // month
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

export default function AgencyEarningsPage() {
  const [timeFilter, setTimeFilter] = useState<RangeKey>('month');
  const [stats, setStats] = useState<EarningsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [chartsReady, setChartsReady] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [R, setR] = useState<typeof import('recharts') | null>(null);

  const loadEarnings = async (range: RangeKey) => {
    setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings(timeFilter);
  }, [timeFilter]);

  useEffect(() => {
    setChartsReady(true);
    let mounted = true;
    import('recharts')
      .then((mod) => {
        if (mounted) setR(mod);
      })
      .catch((err) => {
        console.error('Failed to load charts bundle', err);
        if (mounted) setChartError(err?.message || 'Charts failed to load');
      });
    return () => {
      mounted = false;
    };
  }, []);

  const renderChart = (node: React.ReactNode) => {
    if (!chartsReady || !R) return <div className="h-[300px] w-full bg-muted/40 animate-pulse rounded-lg" />;
    if (chartError) {
      return (
        <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
          Charts unavailable: {chartError}
        </div>
      );
    }
    try {
      return node;
    } catch (err: any) {
      console.error('AgencyEarningsPage chart error', err);
      setChartError(err?.message || 'Chart render failed');
      return (
        <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
          Charts unavailable. Please refresh.
        </div>
      );
    }
  };

  const summary = stats?.summary;
  const totalEarnings = summary?.totalEarnings ?? 0;
  const totalBookings = summary?.totalBookings ?? 0;
  const averagePerBooking = Math.round(summary?.averagePerBooking ?? 0);
  const growthRate = summary?.growthRate ?? 0;
  const topVehicle = summary?.topVehicle;

  const categories = stats?.categories ?? [];
  const twoW = categories.find((c) => c.type === 'bike') || { earnings: 0, percentage: 0 };
  const fourW = categories.find((c) => c.type === 'car') || { earnings: 0, percentage: 0 };

  const monthlyEarnings = stats?.monthlyTrend ?? [];
  const vehiclePerformance = stats?.vehiclePerformance ?? [];
  const paymentMethods = stats?.paymentMethods ?? [];
  const categoryChartData = categories.map((c, idx) => ({
    ...c,
    value: c.earnings,
    color: ['#3b82f6', '#10b981', '#f97316'][idx % 3]
  }));

  if (loading) {
    return (
      <DashboardLayout title="Earnings & Analytics" description="Track your revenue and performance metrics">
        <div className="container-dashboard flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p>Loading earnings…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Earnings & Analytics" description="Track your revenue and performance metrics">
      <div className="container-dashboard">
        {/* Time Filter */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
          <Select value={timeFilter} onValueChange={(value: RangeKey) => setTimeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <Badge className="bg-green-500 text-xs">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  {growthRate}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalEarnings)}</p>
              <p className="text-xs text-muted-foreground mt-1">Vs previous period</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. ₹{averagePerBooking}/booking</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Top Vehicle</p>
              <p className="text-base font-bold text-foreground truncate">{topVehicle?.name || 'No data yet'}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">{topVehicle ? formatCurrency(topVehicle.earnings) : '—'}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-orange-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+{growthRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">vs last month</p>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <Bike className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">2 Wheelers Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(twoW.earnings || 0)}</p>
                </div>
                <Badge variant="outline">{(twoW.percentage || 0).toFixed(1)}%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(twoW.percentage || 0, 100)}%` }}
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Car className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">4 Wheelers Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(fourW.earnings || 0)}</p>
                </div>
                <Badge variant="outline">{(fourW.percentage || 0).toFixed(1)}%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(fourW.percentage || 0, 100)}%` }}
                />
              </div>
            </Card>
          </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Earnings Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Monthly Earnings Trend</h2>
            </div>
            {renderChart(
              R && (
                <R.ResponsiveContainer width="100%" height={300}>
                  <R.LineChart data={monthlyEarnings}>
                    <R.CartesianGrid strokeDasharray="3 3" />
                    <R.XAxis dataKey="month" />
                    <R.YAxis />
                    <R.Tooltip
                      formatter={(value: any) => `₹${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <R.Legend />
                    <R.Line type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} name="Earnings" />
                  </R.LineChart>
                </R.ResponsiveContainer>
              )
            )}
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Revenue by Category</h2>
            </div>
            {renderChart(
              R && (
                <R.ResponsiveContainer width="100%" height={300}>
                  <R.PieChart>
                    <R.Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => {
                        const found = categoryChartData.find((c) => c.name === name);
                        const pct = found ? found.percentage : 0;
                        return `${name}: ${pct.toFixed(1)}%`;
                      }}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <R.Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </R.Pie>
                    <R.Tooltip
                      formatter={(value: any) => `₹${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                  </R.PieChart>
                </R.ResponsiveContainer>
              )
            )}
          </Card>
        </div>

        {/* Vehicle Performance Table */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Vehicle Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Bookings</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Earnings</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg/Booking</th>
                </tr>
              </thead>
              <tbody>
                {vehiclePerformance
                  .sort((a, b) => b.earnings - a.earnings)
                  .map((vehicle, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium">{vehicle.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">
                          {vehicle.type === 'bike' ? (
                            <Bike className="h-3 w-3 mr-1" />
                          ) : (
                            <Car className="h-3 w-3 mr-1" />
                          )}
                          {vehicle.type === 'bike' ? '2W' : vehicle.type === 'car' ? '4W' : vehicle.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">{vehicle.bookings}</td>
                      <td className="py-4 px-4 text-right font-semibold text-green-600">
                        {formatCurrency(vehicle.earnings)}
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground">
                        {formatCurrency(vehicle.avgPerBooking || (vehicle.bookings ? vehicle.earnings / vehicle.bookings : 0))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Bookings */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings in this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{b.vehicleName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.vehicleType || '—'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(b.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(b.endDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">{formatCurrency(b.totalAmount)}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="outline" className="mr-2">{b.status}</Badge>
                        <Badge variant="secondary">{b.paymentStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Payment Methods Distribution</h2>
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment method breakdown available.</p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{method.method}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(method.amount)} ({method.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
