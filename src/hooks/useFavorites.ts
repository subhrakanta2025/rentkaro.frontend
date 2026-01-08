import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

export function useFavorites() {
  const queryClient = useQueryClient();

  const addFavorite = useMutation({
    mutationFn: (vehicleId: string) => apiClient.addFavorite(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Added to favorites');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to favorites');
    },
  });

  const removeFavorite = useMutation({
    mutationFn: (vehicleId: string) => apiClient.removeFavorite(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Removed from favorites');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from favorites');
    },
  });

  const toggleFavorite = (vehicleId: string, isFavorite: boolean) => {
    if (isFavorite) {
      removeFavorite.mutate(vehicleId);
    } else {
      addFavorite.mutate(vehicleId);
    }
  };

  return {
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    toggleFavorite,
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
}
