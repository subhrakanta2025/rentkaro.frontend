import { Link } from 'react-router-dom';
import { ArrowRight, Bike, Car, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from './VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleCarousel } from "@/components/vehicles/VehicleCarousel";

export function FeaturedVehicles() {
  const { data: vehicles = [], isLoading, error, isError } = useVehicles();
  
  console.log('[FeaturedVehicles] vehicles:', vehicles);
  console.log('[FeaturedVehicles] vehicles.length:', vehicles?.length);
  
  const featuredBikes = vehicles.filter((v) => v.type === 'bike').slice(0, 3);
  const featuredCars = vehicles.filter((v) => v.type === 'car').slice(0, 3);
  
  console.log('[FeaturedVehicles] featuredBikes:', featuredBikes.length);
  console.log('[FeaturedVehicles] featuredCars:', featuredCars.length);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }
  
  if (isError) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6">
            <h3 className="text-red-800 font-bold mb-2">Error loading vehicles</h3>
            <pre className="text-sm text-red-700">{JSON.stringify(error, null, 2)}</pre>
          </div>
        </div>
      </section>
    );
  }
  
  if (!vehicles || vehicles.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
            <h3 className="text-yellow-800 font-bold mb-2">No vehicles to display</h3>
            <p className="text-yellow-700">The vehicles array is empty or undefined.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Debug Info */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-sm">
          <p className="font-semibold">Debug Info:</p>
          <p>Total vehicles: {vehicles.length}</p>
          <p>Bikes: {featuredBikes.length}</p>
          <p>Cars: {featuredCars.length}</p>
          <p>Vehicle types: {vehicles.map(v => v.type).join(', ')}</p>
        </div>
        
        {/* Bikes Section */}
        {featuredBikes.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Bike className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Two Wheelers</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Popular Bikes & Scooters
                </h2>
                <p className="mt-2 text-muted-foreground">
                  From daily commutes to weekend adventures
                </p>
              </div>
              <Link to="/vehicles?type=bike">
                <Button variant="ghost" className="gap-2">
                  View All Bikes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBikes.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Four Wheelers</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Popular Cars
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Hatchbacks to SUVs for every occasion
                </p>
              </div>
              <Link to="/vehicles?type=car">
                <Button variant="ghost" className="gap-2">
                  View All Cars
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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
