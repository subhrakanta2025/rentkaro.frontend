import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { ProfileResponse } from '@/types/profile';

export function useAgencyProfile() {
  return useQuery<ProfileResponse>({
    queryKey: ['profile-overview'],
    queryFn: () => apiClient.getUserProfile(),
  });
}
