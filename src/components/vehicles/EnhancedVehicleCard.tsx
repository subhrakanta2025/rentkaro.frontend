import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Fuel, Settings2, Users, Check, Truck, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface EnhancedVehicle {
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
  images?: string[];
  location: string;
  city?: string;
  agencyName: string;
  agencyLogo: string;
  isAvailable: boolean;
  seats?: number;
  tripsCount?: number;
  kmLimit?: number;
  extraKmCharge?: number;
  deposit?: number;
  fuelIncluded?: boolean;
  homeDelivery?: boolean;
  payAtPickup?: boolean;
}

interface EnhancedVehicleCardProps {
  vehicle: EnhancedVehicle;
  className?: string;
  pickupHubs?: string[];
}

export function EnhancedVehicleCard({ vehicle, className, pickupHubs = [] }: EnhancedVehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const tripsCount = vehicle.tripsCount ?? Math.floor(Math.random() * 200) + 10;
  const kmLimit = vehicle.kmLimit ?? (vehicle.type === 'bike' ? 80 : 150);
  const extraKmCharge = vehicle.extraKmCharge ?? (vehicle.type === 'bike' ? 2 : 5);
  const deposit = vehicle.deposit ?? (vehicle.type === 'bike' ? 500 : 2000);
  const fuelIncluded = vehicle.fuelIncluded ?? false;
  const homeDelivery = vehicle.homeDelivery ?? Math.random() > 0.5;
  const payAtPickup = vehicle.payAtPickup ?? true;

  // Get all images - use images array if available, otherwise just the main image
  const allImages = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicle.image];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={cn(
        'group h-full flex flex-col rounded-lg bg-card border border-border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30',
        className
      )}
    >
      {/* Header with name and badges */}
      <div className="p-2 sm:p-3 pb-0">
        <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-foreground leading-tight line-clamp-2">
            {vehicle.name}
          </h3>
          <div className="hidden sm:flex flex-col gap-1 items-end shrink-0">
            {payAtPickup && (
              <Badge className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 gap-0.5 whitespace-nowrap">
                <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                Pay at Pickup
              </Badge>
            )}
            {vehicle.rating > 0 && (
              <Badge variant="outline" className="bg-background text-foreground text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 gap-0.5 border-yellow-400">
                <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-yellow-400 text-yellow-400" />
                {vehicle.rating}
              </Badge>
            )}
          </div>
          {/* Mobile rating */}
          <div className="flex sm:hidden items-center gap-0.5 shrink-0">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-medium">{vehicle.rating}</span>
          </div>
        </div>

        {/* Secondary badges row - hidden on mobile */}
        <div className="hidden sm:flex items-center justify-end gap-1.5 mb-2">
          {homeDelivery && (
            <Badge className="bg-blue-500 text-white text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 gap-0.5">
              <Truck className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
              Home Delivery
            </Badge>
          )}
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5">
            {tripsCount} Trips
          </Badge>
        </div>
      </div>

      {/* Image Gallery */}
      <div 
        className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-muted/50 to-muted mx-2 sm:mx-3 rounded-md"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={allImages[currentImageIndex]}
          alt={vehicle.name}
          className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110"
        />
        
        {/* Navigation arrows - show on hover when multiple images */}
        {allImages.length > 1 && isHovering && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-0.5 sm:p-1 shadow-md transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-0.5 sm:p-1 shadow-md transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </>
        )}
        
        {/* Image dots indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 sm:gap-1">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  idx === currentImageIndex 
                    ? "bg-primary w-3" 
                    : "bg-background/60 hover:bg-background/80"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* View All Packages button */}
      <div className="flex justify-center py-2 sm:py-3">
        <Link to={`/vehicles/${vehicle.id}`}>
          <Button variant="outline" size="sm" className="text-[10px] sm:text-xs font-medium border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200 px-2 sm:px-3 h-7 sm:h-8">
            View Packages
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="px-2 sm:px-3 pb-2 sm:pb-3">
        {/* Specs - simplified on mobile */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground border-t border-b border-border py-1.5 sm:py-2 mb-2 sm:mb-3">
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Settings2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
            <span className="xs:hidden">{vehicle.transmission === 'automatic' ? 'A' : 'M'}</span>
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {vehicle.seats ?? 2}
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Fuel className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">{vehicle.fuelType}</span>
            <span className="xs:hidden">{vehicle.fuelType.substring(0, 3)}</span>
          </span>
        </div>

        {/* Pickup Location - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Available at</span>
          {pickupHubs.length > 0 ? (
            <Select>
              <SelectTrigger className="flex-1 h-7 text-xs">
                <SelectValue placeholder="Select Gohub" />
              </SelectTrigger>
              <SelectContent>
                {pickupHubs.map((hub) => (
                  <SelectItem key={hub} value={hub} className="text-xs">
                    {hub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs font-medium text-foreground truncate">
              {vehicle.location}
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between gap-1 sm:gap-2">
          <div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-primary">
              ₹{vehicle.pricePerDay}
              <span className="text-[8px] sm:text-[10px] font-normal text-muted-foreground ml-0.5 sm:ml-1">(incl. Tax)</span>
            </p>
            <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 space-y-0 hidden sm:block">
              <p>{kmLimit} Km limit</p>
              <p>Extra: ₹{extraKmCharge}/Km</p>
              <p>{fuelIncluded ? 'Fuel Included' : 'Fuel Excluded'}</p>
            </div>
            {/* Simplified info on mobile */}
            <p className="text-[9px] text-muted-foreground sm:hidden">{kmLimit} Km/day</p>
          </div>
          <Link to={`/booking/${vehicle.id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-[10px] sm:text-xs px-2 sm:px-4 h-7 sm:h-8 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-100">
              Book
            </Button>
          </Link>
        </div>

        {/* Footer - hidden on mobile */}
        <div className="hidden sm:flex items-center justify-between text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
          <span>Deposit : ₹{deposit}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Make Year : {vehicle.year}
          </span>
        </div>
      </div>
    </div>
  );
}
