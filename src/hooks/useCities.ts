import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export interface CityOption {
  id: string;
  name: string;
  slug: string;
}

async function fetchCities(): Promise<CityOption[]> {
  const response = await apiClient.getCities();
  return response.cities;
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
