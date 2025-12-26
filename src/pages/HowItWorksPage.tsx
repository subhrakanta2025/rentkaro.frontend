import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HowItWorks as HowItWorksSection } from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Shield,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  Headphones,
  FileCheck,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Vehicles',
    description: 'All vehicles are inspected and verified before listing. Insurance and documentation checked.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Pay via Cash, UPI, or Card. Security deposit is fully refundable.',
  },
  {
    icon: Clock,
    title: 'Hourly & Daily Rentals',
    description: 'Rent by the hour or day. Minimum 4-hour booking. Extend anytime.',
  },
  {
    icon: MapPin,
    title: 'Doorstep Delivery',
    description: 'Get the vehicle delivered to your location for a small fee.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our support team is available round the clock for any assistance.',
  },
  {
    icon: FileCheck,
    title: 'Simple Documentation',
    description: 'Just bring your valid driving license and ID proof. Quick verification.',
  },
  {
    icon: RefreshCw,
    title: 'Free Cancellation',
    description: 'Cancel up to 24 hours before pickup for a full refund.',
  },
  {
    icon: Phone,
    title: 'Direct Contact',
    description: 'Connect directly with agencies for queries and special requests.',
  },
];

const faqs = [
  {
    question: 'What documents do I need to rent a vehicle?',
    answer: 'You need a valid driving license (matching the vehicle type) and a government-issued ID proof like Aadhaar or Passport.',
  },
  {
    question: 'Is there a security deposit?',
    answer: 'Yes, a refundable security deposit of ₹2,000-5,000 is collected depending on the vehicle type. It is refunded on safe return.',
  },
  {
    question: 'Can I extend my rental period?',
    answer: 'Yes, you can extend your rental by contacting the agency directly. Extension is subject to vehicle availability.',
  },
  {
    question: 'What is the fuel policy?',
    answer: 'We follow a same-to-same fuel policy. Return the vehicle with the same fuel level as when you picked it up.',
  },
  {
    question: 'What if I return the vehicle late?',
    answer: 'Late returns are charged at the hourly rate. Please inform the agency if you expect a delay.',
  },
  {
    question: 'Are helmets provided with bikes?',
    answer: 'Yes, all bike rentals include one helmet. Additional helmets can be requested for a nominal charge.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              How RentKaro Works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Renting a vehicle has never been easier. Follow our simple process and hit the road in minutes.
            </p>
          </div>
        </section>

        {/* Steps */}
        <HowItWorksSection />

        {/* Features */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Why Choose RentKaro?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                We make vehicle rental safe, convenient, and affordable
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="rounded-xl bg-card border border-border/50 p-6 shadow-card animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-primary">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Ready to Rent?
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Browse our collection of bikes and cars
            </p>
            <Link to="/vehicles">
              <Button
                size="lg"
                className="mt-6 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Browse Vehicles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
