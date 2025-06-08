
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '@/components/trading/types/tradingTypes';
import { TradingListingRow } from '@/components/trading/types/tradingTypes';
import { 
  RealtimePostgresChangesPayload, 
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload
} from '@supabase/supabase-js';

interface UseTradingRealtimeProps {
  setListings: React.Dispatch<React.SetStateAction<ListingItem[]>>;
}

export const useTradingRealtime = ({ setListings }: UseTradingRealtimeProps) => {
  useEffect(() => {
    const channel = supabase
      .channel('trading_listings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'trading_listings',
          filter: 'status=eq.active'
        }, 
        (payload: RealtimePostgresChangesPayload<TradingListingRow>) => {
          console.log('Real-time update received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT': {
              const newItem = (payload as RealtimePostgresInsertPayload<TradingListingRow>).new;
              const newListing: ListingItem = {
                id: newItem.id,
                title: newItem.title,
                price: Number(newItem.price),
                location: newItem.location || '',
                condition: newItem.condition || 'Good',
                sellerName: newItem.seller_name || 'Anonymous',
                sellerRating: newItem.seller_rating || 5,
                postedDate: 'Just now',
                images: newItem.image_url ? [newItem.image_url] : [],
                description: newItem.description || '',
                favorite: false,
                firearmId: newItem.firearm_id,
                reported: newItem.reported || false
              };
              
              setListings(prevListings => [newListing, ...prevListings]);
              break;
            }
            case 'UPDATE': {
              const updatedItem = (payload as RealtimePostgresUpdatePayload<TradingListingRow>).new;
              setListings(prevListings => 
                prevListings.map(listing => 
                  listing.id === updatedItem.id ? {
                    ...listing,
                    title: updatedItem.title,
                    price: Number(updatedItem.price),
                    location: updatedItem.location || '',
                    condition: updatedItem.condition || 'Good',
                    images: updatedItem.image_url ? [updatedItem.image_url] : listing.images,
                    description: updatedItem.description || '',
                    reported: updatedItem.reported || false
                  } : listing
                )
              );
              break;
            }
            case 'DELETE': {
              const removedId = (payload as RealtimePostgresDeletePayload<TradingListingRow>).old.id;
              setListings(prevListings => 
                prevListings.filter(listing => listing.id !== removedId)
              );
              break;
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setListings]);
};
