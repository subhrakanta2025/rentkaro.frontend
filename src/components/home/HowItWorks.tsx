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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-medium text-primary mb-2">Simple Process</span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            How RentKaro Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Renting a vehicle is as easy as ordering food. Just four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-card border border-border/50">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
