import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store, CheckCircle } from 'lucide-react';

const benefits = [
  'Free listing for agencies',
  'Reach thousands of customers',
  'Easy booking management',
  'Secure payments',
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground mb-6">
            <Store className="h-4 w-4" />
            For Vehicle Owners & Agencies
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Own a Rental Business?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Join India's fastest-growing vehicle rental marketplace. List your bikes and cars to reach thousands of customers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-primary-foreground/90"
              >
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/agency/register">
              <Button
                size="xl"
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Register Your Agency
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                variant="outline"
                size="xl"
                className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
