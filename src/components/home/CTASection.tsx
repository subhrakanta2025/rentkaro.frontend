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
    <section className="py-8 sm:py-10 md:py-14 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center px-2">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-primary-foreground/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-primary-foreground mb-3 sm:mb-4">
            <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            For Vehicle Owners & Agencies
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-foreground">
            Own a Rental Business?
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-primary-foreground/90">
            Join India's fastest-growing vehicle rental marketplace. List your bikes and cars to reach thousands of customers.
          </p>

          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-primary-foreground/90"
              >
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-foreground flex-shrink-0" />
                <span className="truncate">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Link to="/agency/register">
              <Button
                size="default"
                className="gap-1.5 bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs sm:text-sm w-full sm:w-auto"
              >
                Register Your Agency
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                variant="outline"
                size="default"
                className="gap-1.5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent text-xs sm:text-sm w-full sm:w-auto"
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
