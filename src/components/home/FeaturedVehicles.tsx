import { Link } from 'react-router-dom';
import { ArrowRight, Bike, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from './VehicleCard';
import { vehicles } from '@/data/vehicles';

export function FeaturedVehicles() {
  const featuredBikes = vehicles.filter((v) => v.type === 'bike').slice(0, 8);
  const featuredCars = vehicles.filter((v) => v.type === 'car').slice(0, 8);

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        
        {/* Bikes Section */}
        {featuredBikes.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <Bike className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary">Two Wheelers</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  Popular Bikes & Scooters
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  From daily commutes to weekend adventures
                </p>
              </div>
              <Link to="/vehicles?type=bike">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  View All Bikes
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {featuredBikes.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars Section */}
        {featuredCars.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <Car className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary">Four Wheelers</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  Popular Cars
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Hatchbacks to SUVs for every occasion
                </p>
              </div>
              <Link to="/vehicles?type=car">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  View All Cars
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {featuredCars.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
