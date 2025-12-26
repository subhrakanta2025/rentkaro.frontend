import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CalendarIcon, Filter } from 'lucide-react';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  exportToCSV,
  exportToPDF,
  bookingColumns,
  transactionColumns,
  exportAnalyticsPDF,
} from '@/lib/exportUtils';

interface Booking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
}

interface ExportButtonsProps {
  type: 'bookings' | 'transactions' | 'analytics';
  bookings?: Booking[];
  transactions?: Transaction[];
  vehicles?: Vehicle[];
  agencyName?: string;
}

export function ExportButtons({
  type,
  bookings = [],
  transactions = [],
  vehicles = [],
  agencyName = 'Agency',
}: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filterByDateRange = <T extends { created_at: string }>(data: T[]): T[] => {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.created_at);
      
      if (startDate && endDate) {
        return isWithinInterval(itemDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      }
      
      if (startDate) {
        return itemDate >= startOfDay(startDate);
      }
      
      if (endDate) {
        return itemDate <= endOfDay(endDate);
      }
      
      return true;
    });
  };

  const handleExport = (exportFormat: 'csv' | 'pdf') => {
    try {
      const filteredBookings = filterByDateRange(bookings);
      const filteredTransactions = filterByDateRange(transactions);

      const dateRangeSuffix = startDate || endDate
        ? `_${startDate ? format(startDate, 'yyyy-MM-dd') : 'start'}_to_${endDate ? format(endDate, 'yyyy-MM-dd') : 'end'}`
        : '';

      if (type === 'bookings') {
        if (filteredBookings.length === 0) {
          toast.error('No bookings found for the selected date range');
          return;
        }
        if (exportFormat === 'csv') {
          exportToCSV(filteredBookings, bookingColumns, `bookings${dateRangeSuffix}`);
          toast.success(`Exported ${filteredBookings.length} bookings as CSV`);
        } else {
          const title = startDate || endDate
            ? `Bookings Report (${startDate ? format(startDate, 'MMM dd, yyyy') : 'Start'} - ${endDate ? format(endDate, 'MMM dd, yyyy') : 'Present'})`
            : 'Bookings Report';
          exportToPDF(filteredBookings, bookingColumns, `bookings${dateRangeSuffix}`, title);
          toast.success(`Exported ${filteredBookings.length} bookings as PDF`);
        }
      } else if (type === 'transactions') {
        if (filteredTransactions.length === 0) {
          toast.error('No transactions found for the selected date range');
          return;
        }
        if (exportFormat === 'csv') {
          exportToCSV(filteredTransactions, transactionColumns, `transactions${dateRangeSuffix}`);
          toast.success(`Exported ${filteredTransactions.length} transactions as CSV`);
        } else {
          const title = startDate || endDate
            ? `Transactions Report (${startDate ? format(startDate, 'MMM dd, yyyy') : 'Start'} - ${endDate ? format(endDate, 'MMM dd, yyyy') : 'Present'})`
            : 'Transactions Report';
          exportToPDF(filteredTransactions, transactionColumns, `transactions${dateRangeSuffix}`, title);
          toast.success(`Exported ${filteredTransactions.length} transactions as PDF`);
        }
      } else if (type === 'analytics') {
        if (exportFormat === 'pdf') {
          exportAnalyticsPDF(filteredBookings, filteredTransactions, vehicles, agencyName);
          toast.success('Analytics report exported as PDF');
        } else {
          const summary = [
            {
              metric: 'Total Vehicles',
              value: vehicles.length,
            },
            {
              metric: 'Total Bookings',
              value: filteredBookings.length,
            },
            {
              metric: 'Confirmed Bookings',
              value: filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length,
            },
            {
              metric: 'Cancelled Bookings',
              value: filteredBookings.filter(b => b.status === 'cancelled').length,
            },
            {
              metric: 'Total Revenue',
              value: filteredTransactions
                .filter(t => t.status === 'success')
                .reduce((sum, t) => sum + Number(t.amount), 0),
            },
          ];
          exportToCSV(
            summary,
            [
              { header: 'Metric', key: 'metric' },
              { header: 'Value', key: 'value' },
            ],
            `analytics_summary${dateRangeSuffix}`
          );
          toast.success('Analytics summary exported as CSV');
        }
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const filteredCount = () => {
    if (!startDate && !endDate) return null;
    
    if (type === 'bookings') {
      return filterByDateRange(bookings).length;
    } else if (type === 'transactions') {
      return filterByDateRange(transactions).length;
    }
    return null;
  };

  const count = filteredCount();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
          <DialogDescription>
            Select a date range to filter the data before exporting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {(startDate || endDate) && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {count !== null ? `${count} records match` : 'Filter applied'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="gap-2 flex-1"
            onClick={() => handleExport('csv')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="default"
            className="gap-2 flex-1"
            onClick={() => handleExport('pdf')}
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
