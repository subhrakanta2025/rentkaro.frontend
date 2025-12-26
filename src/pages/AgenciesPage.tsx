import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { agencies, vehicles } from '@/data/vehicles';
import { Star, MapPin, CheckCircle2, Car, Bike } from 'lucide-react';

export default function AgenciesPage() {
  const getAgencyVehicleCounts = (agencyId: string) => {
    const agencyVehicles = vehicles.filter((v) => v.agencyId === agencyId);
    return {
      bikes: agencyVehicles.filter((v) => v.type === 'bike').length,
      cars: agencyVehicles.filter((v) => v.type === 'car').length,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/agencies" className="hover:text-foreground">Agencies</Link>
            <span>/</span>
            <span className="text-foreground">Agencies</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Rental Agencies</h1>
          <p className="mt-2 text-muted-foreground">
            {agencies.length} verified agencies across major cities
          </p>
        </div>

        {/* Agencies Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {agencies.map((agency, index) => {
            const counts = getAgencyVehicleCounts(agency.id);
            return (
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
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {agency.name}
                      </h2>
                      {agency.verified && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium text-foreground">{agency.rating}</span>
                      <span className="text-muted-foreground">({agency.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {agency.location}, {agency.city}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                  {agency.description}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{counts.bikes} Bikes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{counts.cars} Cars</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {agency.totalVehicles} Total
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
