import { Link } from 'react-router-dom';
import { Star, MapPin, Fuel, Settings2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/vehicles/FavoriteButton';
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
  isFavorite?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  return (
    <Link
      to="/vehicles"
      className={cn(
        "group h-full flex flex-col rounded-lg bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Badge
          variant="secondary"
          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white/95 backdrop-blur-sm shadow-sm border-0 font-medium text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5"
        >
          {vehicle.type === 'bike' ? '🏍️ Bike' : '🚗 Car'}
        </Badge>
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex gap-1 items-center">
          {vehicle.isAvailable && (
            <Badge className="hidden sm:flex bg-green-500 hover:bg-green-600 text-white shadow-md border-0 text-[10px] px-1.5 py-0.5">
              ✓ Available
            </Badge>
          )}
          <FavoriteButton vehicleId={vehicle.id} isFavorite={vehicle.isFavorite} size="sm" />
        </div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
          <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-full px-1 sm:px-1.5 py-0.5 shadow-sm">
            <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-900">{vehicle.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-1 sm:mb-1.5">
          <h3 className="font-semibold text-[11px] sm:text-sm text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {vehicle.name}
          </h3>
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium mt-0.5">{vehicle.brand} • {vehicle.year}</p>
        </div>

        {/* Features - Hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-gray-100">
          <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] text-gray-600">
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded bg-blue-50 flex items-center justify-center">
              <Fuel className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
            </div>
            <span className="font-medium leading-none">{vehicle.fuelType}</span>
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] text-gray-600">
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded bg-purple-50 flex items-center justify-center">
              <Settings2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-600" />
            </div>
            <span className="font-medium hidden sm:inline leading-none">{vehicle.transmission}</span>
            <span className="font-medium sm:hidden leading-none">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </span>
        </div>

        {/* Footer - Price & Agency */}
        <div className="flex items-center justify-between mt-auto">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full overflow-hidden ring-1 ring-gray-100">
              <img
                src={vehicle.agencyLogo}
                alt={vehicle.agencyName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wide">Agency</span>
              <span className="text-[9px] sm:text-[10px] text-gray-700 font-semibold truncate max-w-[60px] sm:max-w-[70px]">{vehicle.agencyName}</span>
            </div>
          </div>
          <div className="text-left sm:text-right flex-1 sm:flex-none">
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm sm:text-lg font-bold text-primary">₹{vehicle.pricePerDay}</span>
              <span className="text-[8px] sm:text-[9px] text-gray-500 font-medium">/day</span>
            </div>
          </div>
        </div>

        {/* Location Tag */}
        <div className="mt-1 sm:mt-1.5 pt-1 sm:pt-1.5 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-gray-500">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
            <span className="font-medium truncate">{vehicle.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
