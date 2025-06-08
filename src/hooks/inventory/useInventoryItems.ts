
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FirearmItem } from '@/components/inventory/InventoryItem';

export const useInventoryItems = (session: any) => {
  const { toast } = useToast();
  const [items, setItems] = useState<FirearmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch firearms from Supabase
  useEffect(() => {
    const fetchFirearms = async () => {
      setIsLoading(true);
      
      try {
        if (!session?.user?.id) {
          // If no user in session, just use an empty array
          console.log('No user ID in session, setting empty items array');
          setItems([]);
          setIsLoading(false);
          return;
        }
        
        const userId = session.user.id;
        console.log('Fetching firearms for user ID:', userId);
        
        const { data, error } = await supabase
          .from('firearms')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        console.log('Fetched firearms data:', data);
        
        // Map Supabase data to FirearmItem format
        const mappedItems = data.map((item: any) => ({
          id: item.id,
          make: item.make,
          model: item.model,
          caliber: item.caliber || '',
          serialNumber: item.serial_number,
          condition: item.condition,
          purchaseDate: item.purchase_date || new Date().toISOString().split('T')[0],
          value: Number(item.value) || 0,
          notes: item.notes || '',
          image: item.image_url || '',
          image_url: item.image_url || ''
        }));
        
        console.log('Mapped items:', mappedItems);
        setItems(mappedItems);
      } catch (error: any) {
        console.error('Error fetching firearms:', error);
        toast({
          title: "Failed to load inventory",
          description: error.message || "Could not load your firearms inventory",
          variant: "destructive"
        });
        setItems([]); // Reset items on error
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      console.log('Session detected, fetching firearms');
      fetchFirearms();
    } else {
      console.log('No session detected, not fetching firearms');
      setIsLoading(false);
      setItems([]);
    }
  }, [session, toast]);
  
  return {
    items,
    setItems,
    isLoading
  };
};
