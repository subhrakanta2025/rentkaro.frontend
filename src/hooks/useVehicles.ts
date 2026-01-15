import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export interface Vehicle {
  id: string;
  name: string;
  type: 'bike' | 'car';
  brand: string;
  model: string;
  year: number;
  transmission: 'manual' | 'automatic';
  fuelType: string;
  pricePerDay: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  features?: string[];
  location: string;
  city: string;
  agencyName: string;
  agencyLogo: string;
  isAvailable: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
  seatingCapacity?: number;
  status?: string;
  mileage?: string;
  securityDeposit?: number;
  deposit?: number;
  agencyId?: string;
  displacement?: string;
  topSpeed?: string;
  fuelCapacity?: string;
  weight?: string;
  timings?: string;
  excessPerKm?: number;
  lateFeePerHr?: number;
  agencyLocation?: {
    address?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
  };
}

// Lightweight visible placeholder so cards never look blank if the API omits images
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=520&fit=crop&q=50&auto=format';

const normalizeImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://api.rentkaro.online/api';
  return `${base.replace(/\/api$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
};

const mapApiVehicleToVehicle = (apiVehicle: any): Vehicle => {
  // Determine vehicle type based on vehicleType field
  const vehicleTypeMap: { [key: string]: 'bike' | 'car' } = {
    bike: 'bike',
    scooter: 'bike',
    motorcycle: 'bike',
    car: 'car',
    suv: 'car',
    sedan: 'car',
    hatchback: 'car',
  };

  const type = vehicleTypeMap[apiVehicle.vehicleType?.toLowerCase()] || 'car';

  const images = Array.isArray(apiVehicle.images) ? apiVehicle.images : [];
  const normalizedImages = images
    .map((img: any) => normalizeImageUrl(img?.imageUrl || img))
    .filter((v: string | undefined): v is string => Boolean(v));

  const primaryImage =
    normalizeImageUrl(apiVehicle.imageUrl) ||
    normalizedImages.find((_, idx) => images[idx]?.isPrimary) ||
    normalizedImages[0];

  const normalizedFeatures = Array.isArray(apiVehicle.features)
    ? apiVehicle.features.filter(Boolean).map((f: any) => String(f))
    : [];

  const agency =
    apiVehicle.agency ||
    apiVehicle.agencyDetails ||
    apiVehicle.agencyProfile ||
    apiVehicle.ownerAgency;

  const agencyName =
    apiVehicle.agencyName ||
    apiVehicle.agency_name ||
    agency?.agencyName ||
    agency?.agency_name ||
    agency?.name;

  const agencyLogo =
    normalizeImageUrl(apiVehicle.agencyLogo || apiVehicle.agency_logo) ||
    normalizeImageUrl(agency?.logoUrl || agency?.logo || agency?.logo_url || agency?.agencyLogo);

  const agencyLocation = agency?.location || apiVehicle.agencyLocation || agency;

  return {
    id: apiVehicle.id,
    name: `${apiVehicle.make} ${apiVehicle.model}`,
    type,
    brand: apiVehicle.make,
    model: apiVehicle.model,
    year: apiVehicle.year || new Date().getFullYear(),
    transmission: (apiVehicle.transmission || 'manual') as 'manual' | 'automatic',
    fuelType: apiVehicle.fuelType || 'petrol',
    pricePerDay: apiVehicle.dailyRate || 0,
    pricePerHour: Math.round((apiVehicle.dailyRate || 0) / 10),
    rating: 4.5,
    reviewCount: 0,
    image: primaryImage || PLACEHOLDER_IMAGE,
    images: normalizedImages.length ? normalizedImages : [primaryImage || PLACEHOLDER_IMAGE],
    features: normalizedFeatures,
    location: apiVehicle.location || apiVehicle.city || 'India',
    city: apiVehicle.location || apiVehicle.city || 'India',
    agencyName: agencyName || 'Ride India Rentals',
    agencyLogo:
      agencyLogo ||
      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&q=60&auto=format',
    isAvailable: apiVehicle.isAvailable ?? true,
    isFavorite: apiVehicle.isFavorite ?? false,
    imageUrl: primaryImage,
    seatingCapacity: apiVehicle.seatingCapacity,
    status: apiVehicle.status || 'available',
    mileage: `${apiVehicle.mileage || 20} km/l`,
    securityDeposit: apiVehicle.securityDeposit ?? apiVehicle.security_deposit ?? 0,
    deposit: apiVehicle.securityDeposit ?? apiVehicle.security_deposit ?? 0,
    agencyId: apiVehicle.agencyId,
    displacement: apiVehicle.displacement,
    topSpeed: apiVehicle.topSpeed,
    fuelCapacity: apiVehicle.fuelCapacity,
    weight: apiVehicle.weight,
    timings: apiVehicle.timings,
    excessPerKm: apiVehicle.excessPerKm,
    lateFeePerHr: apiVehicle.lateFeePerHr,
    agencyLocation: agencyLocation
      ? {
          address: agencyLocation.address,
          city: agencyLocation.city,
          state: agencyLocation.state,
          latitude: agencyLocation.latitude,
          longitude: agencyLocation.longitude,
          phone: agencyLocation.phone,
        }
      : undefined,
  };
};

export function useVehicles(
  params?: { search?: string; wheelers?: '2' | '4'; city?: string; type?: string; startDate?: string; endDate?: string; favorite?: boolean }
) {
  const normalizeCity = (value?: string) => {
    if (!value) return undefined;
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');
  };

  const cityNormalized = normalizeCity(params?.city);

  return useQuery<Vehicle[], Error>({
    queryKey: [
      'vehicles',
      params?.search || '',
      params?.wheelers || '',
      cityNormalized || '',
      params?.type || '',
      params?.startDate || '',
      params?.endDate || '',
      params?.favorite ? 'favorites' : '',
    ],
    queryFn: async () => {
      const response: any = await apiClient.getVehicles({
        page: 1,
        per_page: 24,
        wheelers: params?.wheelers as any,
        location: cityNormalized,
        type: params?.type,
        search: params?.search,
        startDate: params?.startDate,
        endDate: params?.endDate,
        favorite: params?.favorite,
      });

      const vehicles =
        (Array.isArray(response?.vehicles) && response.vehicles) ||
        (Array.isArray(response?.data?.vehicles) && response.data.vehicles) ||
        (Array.isArray(response?.data) && response.data) ||
        (Array.isArray(response?.results) && response.results) ||
        [];

      return vehicles.map(mapApiVehicleToVehicle);
    },
    retry: 1,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    placeholderData: (prev) => prev,
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      try {
        const response: any = await apiClient.getVehicle(id);
        if (response.vehicle) {
          return mapApiVehicleToVehicle(response.vehicle);
        }
        throw new Error('Vehicle not found in API response');
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
  });
}
