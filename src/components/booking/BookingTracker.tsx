import { Search, Calendar, Key, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { icon: Search, label: 'Search & Compare' },
  { icon: Calendar, label: 'Book Online' },
  { icon: Key, label: 'Pick Up & Ride' },
  { icon: ThumbsUp, label: 'Return & Rate' },
];

interface BookingTrackerProps {
  currentStep: number;
}

export function BookingTracker({ currentStep }: BookingTrackerProps) {
  return (
    <div className="flex items-center justify-between w-full p-4">
      {steps.map((step, index) => (
        <>
          <div key={index} className="flex flex-col items-center text-center w-20">
            <div
              className={cn(
                'relative flex h-16 w-16 items-center justify-center rounded-lg border-2 transition-colors',
                currentStep > index + 1 ? 'bg-green-100 border-green-500 text-green-500' : 
                currentStep === index + 1 ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'
              )}
            >
              <step.icon className="h-8 w-8" />
              <div className={cn(
                'absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                 currentStep > index + 1 ? 'bg-green-500' :
                 currentStep === index + 1 ? 'bg-primary' : 'bg-muted-foreground'
              )}>
                {index + 1}
              </div>
            </div>
            <p className={cn("mt-2 text-xs font-medium", currentStep >= index + 1 ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={cn("flex-1 h-0.5 mx-2", currentStep > index + 1 ? "bg-green-500" : "bg-border")} />
          )}
        </>
      ))}
    </div>
  );
}
