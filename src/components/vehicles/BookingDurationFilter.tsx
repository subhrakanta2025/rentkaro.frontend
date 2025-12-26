import { cn } from '@/lib/utils';

interface BookingDurationFilterProps {
  selectedDuration: string | null;
  onDurationChange: (duration: string | null) => void;
}

const durations = [
  { id: '3hrs', label: '3 Hours Package' },
  { id: '6hrs', label: '6 Hours Package' },
  { id: 'halfday', label: 'Half Day Package' },
  { id: 'daily', label: 'Daily Package' },
  { id: 'weekly', label: 'Weekly Package' },
  { id: '15days', label: '15 Days Package' },
  { id: 'monthly', label: 'Monthly Package' },
  { id: '3months', label: '3 Months Package' },
  { id: '6months', label: '6 Months Package' },
  { id: 'yearly', label: 'Yearly Package' },
];

export function BookingDurationFilter({
  selectedDuration,
  onDurationChange,
}: BookingDurationFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">BOOKING DURATION</h3>
      <div className="space-y-2">
        {durations.map((duration) => (
          <label
            key={duration.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full border-2 transition-colors',
                selectedDuration === duration.id
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground group-hover:border-primary'
              )}
            >
              {selectedDuration === duration.id && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                </div>
              )}
            </div>
            <span
              className={cn(
                'text-sm transition-colors',
                selectedDuration === duration.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {duration.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
