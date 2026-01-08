import { Search, Calendar, Key, ThumbsUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Compare',
    description: 'Browse vehicles by type, location, and price. Compare options from multiple agencies.',
  },
  {
    icon: Calendar,
    title: 'Book Online',
    description: 'Select your dates, fill in details, and confirm your booking in minutes.',
  },
  {
    icon: Key,
    title: 'Pick Up & Ride',
    description: 'Collect your vehicle from the agency or get doorstep delivery. Documents verified on spot.',
  },
  {
    icon: ThumbsUp,
    title: 'Return & Rate',
    description: 'Return the vehicle on time and share your experience to help others.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-8 sm:py-10 md:py-14 bg-muted/30">
      <div className="container">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block text-[10px] sm:text-xs font-medium text-primary mb-1 sm:mb-1.5">Simple Process</span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            How RentKaro Works
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto px-2">
            Renting a vehicle is as easy as ordering food. Just four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex">
                <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-card shadow-card border border-border/50">
                  <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
