import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Bike, Car, ChevronDown } from 'lucide-react';
import { cities } from '@/data/vehicles';
import { cn } from '@/lib/utils';

type VehicleType = 'bike' | 'car' | 'all';

export function HeroSection() {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState<VehicleType>('all');
  const [city, setCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (vehicleType !== 'all') params.set('type', vehicleType);
    if (city) params.set('city', city);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative py-10 md:py-14 lg:py-18">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Trusted by 10,000+ customers across India
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-slide-up">
            Rent Bikes & Cars
            <span className="block text-gradient">Anytime, Anywhere</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Find the perfect ride from verified rental agencies. Affordable hourly & daily rentals with doorstep delivery across major Indian cities.
          </p>

          {/* Search Box */}
          <div className="mt-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="mx-auto max-w-3xl rounded-2xl bg-card p-4 shadow-xl border border-border/50">
              {/* Vehicle Type Tabs */}
              <div className="flex items-center gap-2 mb-4 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setVehicleType('all')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                    vehicleType === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  All Vehicles
                </button>
                <button
                  onClick={() => setVehicleType('bike')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                    vehicleType === 'bike'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Bike className="h-4 w-4" />
                  Bikes
                </button>
                <button
                  onClick={() => setVehicleType('car')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                    vehicleType === 'car'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Car className="h-4 w-4" />
                  Cars
                </button>
              </div>

              {/* Search Fields */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {/* City Selector */}
                <div className="relative flex-1">
                  <div
                    className="flex items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                  >
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground">
                        {city || 'Select city'}
                      </p>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      showCityDropdown && "rotate-180"
                    )} />
                  </div>
                  
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg z-10 animate-slide-down">
                      {cities.map((c) => (
                        <button
                          key={c}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => {
                            setCity(c);
                            setShowCityDropdown(false);
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Selector */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">When</p>
                      <p className="text-sm font-medium text-foreground">
                        Today
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  variant="hero"
                  size="lg"
                  className="gap-2 md:px-8"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div>
              <p className="text-3xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Vehicles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Agencies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
