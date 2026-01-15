import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agencies } from '@/data/vehicles';

export function TopAgencies() {
  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <span className="inline-block text-xs font-medium text-primary mb-1">Verified Partners</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Top Rental Agencies
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Trusted agencies with excellent track record
            </p>
          </div>
          <Link to="/agencies">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              View All Agencies
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {agencies.slice(0, 8).map((agency, index) => (
            <Link
              key={agency.id}
              to="/agencies"
              className="group rounded-lg bg-card border border-border/50 p-2.5 sm:p-4 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <img
                  src={agency.logo}
                  alt={agency.name}
                  loading="lazy"
                  width="64"
                  height="64"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {agency.name}
                    </h3>
                    {agency.verified && (
                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-primary text-primary" />
                    <span className="text-[10px] sm:text-xs font-medium text-foreground">{agency.rating}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">({agency.reviewCount})</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                <span className="truncate">{agency.location}, {agency.city}</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <Badge variant="secondary" className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5">
                  {agency.totalVehicles} Vehicles
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
