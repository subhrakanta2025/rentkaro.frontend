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
  const primaryImage =
    apiVehicle.imageUrl ||
    images.find((img: any) => img.isPrimary)?.imageUrl ||
    images[0]?.imageUrl;

  const agencyLocation = apiVehicle.agency || apiVehicle.agencyLocation;

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
    image: primaryImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    location: apiVehicle.location || apiVehicle.city || 'India',
    city: apiVehicle.location || apiVehicle.city || 'India',
    agencyName: apiVehicle.agencyName || 'Ride India Rentals',
    agencyLogo: apiVehicle.agencyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
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

export function useVehicles(params?: { search?: string; wheelers?: '2' | '4'; city?: string; type?: string; startDate?: string; endDate?: string; favorite?: boolean }) {
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

  return useQuery({
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
  });
}

export function useVehicle(id: string) {
  return useQuery({
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
