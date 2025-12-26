import { Link } from 'react-router-dom';
import { Star, MapPin, Fuel, Settings2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Vehicle {
  id: string;
  name: string;
  type: 'bike' | 'car';
  brand: string;
  model?: string;
  year: number;
  transmission: 'manual' | 'automatic';
  fuelType: string;
  pricePerDay: number;
  pricePerHour?: number;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  city?: string;
  agencyName: string;
  agencyLogo: string;
  isAvailable: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className={cn(
        "group block rounded-xl bg-card border border-border/50 overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm"
        >
          {vehicle.type === 'bike' ? 'Bike' : 'Car'}
        </Badge>
        {vehicle.isAvailable && (
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
            Available
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.brand} • {vehicle.year}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{vehicle.rating}</span>
            <span className="text-muted-foreground">({vehicle.reviewCount})</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {vehicle.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {vehicle.location}
          </span>
        </div>

        {/* Agency & Price */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <img
              src={vehicle.agencyLogo}
              alt={vehicle.agencyName}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-muted-foreground">{vehicle.agencyName}</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              ₹{vehicle.pricePerDay}
              <span className="text-xs font-normal text-muted-foreground">/day</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
