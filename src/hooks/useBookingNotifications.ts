import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'>;

export function useBookingNotifications() {
  const { user, userRole } = useAuth();
  const [newBookings, setNewBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user || userRole !== 'agency') return;

    // First get the agency ID for this user
    const fetchAgencyAndSubscribe = async () => {
      const { data: agency } = await supabase
        .from('agencies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agency) return;

      console.log('Setting up realtime subscription for agency:', agency.id);

      const channel = supabase
        .channel('agency-bookings')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
            filter: `agency_id=eq.${agency.id}`,
          },
          async (payload) => {
            console.log('New booking received:', payload);
            const newBooking = payload.new as Booking;
            
            // Fetch vehicle details for the notification
            const { data: vehicle } = await supabase
              .from('vehicles')
              .select('name')
              .eq('id', newBooking.vehicle_id)
              .single();

            toast.success('New Booking Received!', {
              description: `${newBooking.customer_name} booked ${vehicle?.name || 'a vehicle'} for ₹${newBooking.total_amount}`,
              duration: 10000,
            });

            setNewBookings((prev) => [newBooking, ...prev]);
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      return () => {
        console.log('Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      };
    };

    const cleanup = fetchAgencyAndSubscribe();
    return () => {
      cleanup.then((unsub) => unsub?.());
    };
  }, [user, userRole]);

  return { newBookings };
}
