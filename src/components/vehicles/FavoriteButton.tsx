import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  vehicleId: string;
  isFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ vehicleId, isFavorite = false, size = 'md', className }: FavoriteButtonProps) {
  const { toggleFavorite, isLoading } = useFavorites();
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    toggleFavorite(vehicleId, isFavorite);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        'rounded-full bg-white/90 hover:bg-white shadow-sm',
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
        )}
      />
    </Button>
  );
}
