import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVehicle, useVehicles } from '@/hooks/useVehicles';
import {
  Star,
  MapPin,
  Fuel,
  Settings2,
  Users,
  Gauge,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone,
  Share2,
  Heart,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: vehicle, isLoading, error } = useVehicle(id || '');
  const { data: allVehicles = [] } = useVehicles();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Vehicle not found</h1>
          <p className="mt-2 text-muted-foreground">
            The vehicle you're looking for doesn't exist.
          </p>
          <Link to="/vehicles">
            <Button className="mt-6">Browse All Vehicles</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/new-booking/${vehicle.id}`);
  };

  const similarVehicles = allVehicles
    .filter((v) => v.type === vehicle.type && v.id !== vehicle.id)
    .slice(0, 3);

  const vehicleImages = vehicle.images.length > 0 ? vehicle.images : [vehicle.image];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
          <span>/</span>
          <span className="text-foreground">{vehicle.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
              <img
                src={vehicleImages[currentImageIndex] || vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {vehicleImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors"
                    onClick={() => setCurrentImageIndex((i) => (i === 0 ? vehicleImages.length - 1 : i - 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors"
                    onClick={() => setCurrentImageIndex((i) => (i === vehicleImages.length - 1 ? 0 : i + 1))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {vehicleImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicleImages.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        index === currentImageIndex
                          ? "bg-primary w-6"
                          : "bg-card/60 hover:bg-card"
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                  {vehicle.type === 'bike' ? 'Bike' : 'Car'}
                </Badge>
                {vehicle.isAvailable && (
                  <Badge className="bg-success text-success-foreground">Available</Badge>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                    isFavorite
                      ? "bg-destructive/90 text-destructive-foreground"
                      : "bg-card/80 text-foreground hover:bg-card"
                  )}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Vehicle Info */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {vehicle.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {vehicle.brand} {vehicle.model} • {vehicle.year}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{vehicle.rating}</span>
                  <span className="text-muted-foreground">({vehicle.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {vehicle.location}, {vehicle.city}
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="font-medium text-foreground capitalize">{vehicle.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Settings2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p className="font-medium text-foreground capitalize">{vehicle.transmission}</p>
                  </div>
                </div>
                {vehicle.seats && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Seats</p>
                      <p className="font-medium text-foreground">{vehicle.seats} Seater</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Gauge className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mileage</p>
                    <p className="font-medium text-foreground">{vehicle.mileage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">About this vehicle</h2>
              <p className="text-muted-foreground">{vehicle.description}</p>
            </div>

            {/* Features */}
            {vehicle.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Features Included</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicle.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agency Info */}
            <div className="rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Rental Agency</h2>
              <div className="flex items-start gap-4">
                <img
                  src={vehicle.agencyLogo}
                  alt={vehicle.agencyName}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{vehicle.agencyName}</h3>
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vehicle.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-card">
              {/* Price */}
              <div className="text-center pb-6 border-b border-border">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-primary">₹{vehicle.pricePerDay}</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  or ₹{vehicle.pricePerHour}/hour
                </p>
              </div>

              {/* Quick Info */}
              <div className="py-6 space-y-4 border-b border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minimum rental</span>
                  <span className="font-medium text-foreground">4 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Security deposit</span>
                  <span className="font-medium text-foreground">₹2,000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fuel policy</span>
                  <span className="font-medium text-foreground">Same-to-same</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 space-y-3">
                <Button variant="hero" size="lg" className="w-full" onClick={handleBookNow}>
                  Book Now
                </Button>
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Agency
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-success" />
                  <span>Verified vehicle with insurance cover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
