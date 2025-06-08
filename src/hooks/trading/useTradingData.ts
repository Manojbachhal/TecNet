import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ListingItem } from '@/components/trading/types/tradingTypes';
import { formatDateDifference } from '@/components/trading/utils/dateUtils';

export const useTradingData = () => {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('trading_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        const transformedListings: ListingItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          location: item.location || '',
          condition: item.condition || 'Good',
          sellerName: item.seller_name || 'Anonymous',
          sellerRating: item.seller_rating || 5,
          postedDate: formatDateDifference(new Date(item.created_at)),
          images: item.image_url ? [item.image_url] : [],
          description: item.description || '',
          favorite: false,
          firearmId: item.firearm_id,
          reported: item.reported || false
        }));
        
        console.log('Fetched listings:', transformedListings);
        setListings(transformedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Error",
          description: "Failed to load listings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [toast]);

  return { listings, setListings, isLoading };
};
