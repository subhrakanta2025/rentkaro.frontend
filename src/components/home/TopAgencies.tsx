import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agencies } from '@/data/vehicles';

export function TopAgencies() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-sm font-medium text-primary mb-2">Verified Partners</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Top Rental Agencies
            </h2>
            <p className="mt-2 text-muted-foreground">
              Trusted agencies with excellent track record
            </p>
          </div>
          <Link to="/agencies">
            <Button variant="ghost" className="gap-2">
              View All Agencies
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {agencies.map((agency, index) => (
            <Link
              key={agency.id}
              to={`/agencies/${agency.id}`}
              className="group rounded-xl bg-card border border-border/50 p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={agency.logo}
                  alt={agency.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {agency.name}
                    </h3>
                    {agency.verified && (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">{agency.rating}</span>
                    <span className="text-sm text-muted-foreground">({agency.reviewCount})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {agency.location}, {agency.city}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">
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
