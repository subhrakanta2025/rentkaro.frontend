import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  MapPin,
  LocateFixed,
  Loader2,
  Navigation,
  Search,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Fix default marker icon issue with Leaflet + Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerMapProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string, address?: string, city?: string, state?: string) => void;
  className?: string;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter the map
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
  className,
}: LocationPickerMapProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null
  );

  // Default center (Hyderabad, India)
  const defaultCenter: [number, number] = [17.385044, 78.486671];
  const mapCenter = markerPosition || defaultCenter;

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';
        const address = data.display_name?.split(',').slice(0, 3).join(', ') || '';
        
        onLocationChange(lat.toFixed(6), lng.toFixed(6), address, city, state);
        toast.success('Location selected!');
      } else {
        onLocationChange(lat.toFixed(6), lng.toFixed(6));
        toast.success('Coordinates captured!');
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      onLocationChange(lat.toFixed(6), lng.toFixed(6));
      toast.success('Coordinates captured!');
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    await reverseGeocode(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    
    // Try with high accuracy first, fallback to low accuracy
    const tryGetLocation = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setMarkerPosition([lat, lng]);
          await reverseGeocode(lat, lng);
          setIsLocating(false);
          if (!showMap) setShowMap(true);
        },
        (error) => {
          if (highAccuracy && error.code === error.TIMEOUT) {
            // Retry with low accuracy if high accuracy times out
            tryGetLocation(false);
            return;
          }
          
          setIsLocating(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Location permission denied. Please enable it in browser settings or select on map.');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error('Location unavailable. Please select on map.');
              break;
            case error.TIMEOUT:
              toast.error('Location request timed out. Please select on map.');
              break;
            default:
              toast.error('Failed to get location. Please select on map.');
          }
          // Show map so user can select manually
          setShowMap(true);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 15000 : 30000,
          maximumAge: 60000,
        }
      );
    };

    tryGetLocation(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setMarkerPosition([lat, lng]);
        
        const addr = result.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';
        const address = result.display_name?.split(',').slice(0, 3).join(', ') || '';
        
        onLocationChange(lat.toFixed(6), lng.toFixed(6), address, city, state);
        toast.success('Location found!');
        
        if (!showMap) setShowMap(true);
      } else {
        toast.error('Location not found. Try a different search.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with GPS button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Pickup Location</span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="gap-2"
          >
            {isLocating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <LocateFixed className="h-3.5 w-3.5" />
                Use GPS
              </>
            )}
          </Button>
          <Button
            type="button"
            variant={showMap ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="gap-2"
          >
            <MapPin className="h-3.5 w-3.5" />
            {showMap ? 'Hide Map' : 'Select on Map'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showMap && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search location (e.g., Hyderabad, MG Road...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="rounded-lg overflow-hidden border border-border" style={{ height: '250px' }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleMapClick} />
            {markerPosition && (
              <>
                <Marker position={markerPosition} />
                <MapRecenter lat={markerPosition[0]} lng={markerPosition[1]} />
              </>
            )}
          </MapContainer>
        </div>
      )}

      {/* Coordinates Display */}
      {markerPosition ? (
        <div className="rounded-md bg-muted/50 border border-border/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">GPS Coordinates:</span>
            <span className="font-mono text-xs text-foreground">
              {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 ml-6">
            This location will be used as pickup point for all your vehicles
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click "Use GPS" to auto-detect or "Select on Map" to choose your agency location
        </p>
      )}
    </div>
  );
}
