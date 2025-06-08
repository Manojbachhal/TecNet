
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FirearmItem } from '@/components/inventory/InventoryItem';
import { useToast } from '@/hooks/use-toast';

export const useInventoryIntegration = (session: any) => {
  const [userFirearms, setUserFirearms] = useState<any[]>([]);
  const [initialFirearm, setInitialFirearm] = useState<FirearmItem | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Effect to check for creation from inventory
  useEffect(() => {
    console.log('Location state:', location.state);
    
    if (location.state?.listItem && location.state?.action === 'createListing') {
      console.log('Creating new listing from inventory item:', location.state.listItem);
      setInitialFirearm(location.state.listItem);
      
      // Clear the state from location to prevent persistence after page refresh
      navigate(location.pathname, { replace: true, state: null });
      
      toast({
        title: "Create Listing",
        description: `Ready to list ${location.state.listItem.make} ${location.state.listItem.model} for trading.`
      });
    }
  }, [location, navigate, toast]);
  
  // Effect to fetch user's firearms
  useEffect(() => {
    const fetchUserFirearms = async () => {
      if (!session?.user?.id) return;
      
      try {
        console.log('Fetching firearms for trading integration, user ID:', session.user.id);
        
        const { data, error } = await supabase
          .from('firearms')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (error) throw error;
        
        console.log('Fetched firearms for trading:', data?.length || 0, 'items');
        
        // Map to FirearmItem format for consistency
        const mappedItems = (data || []).map((item: any) => ({
          id: item.id,
          make: item.make,
          model: item.model,
          caliber: item.caliber || '',
          serialNumber: item.serial_number,
          condition: item.condition || 'Good',
          purchaseDate: item.purchase_date || new Date().toISOString().split('T')[0],
          value: Number(item.value) || 0,
          notes: item.notes || '',
          image: item.image_url || '',
          image_url: item.image_url || ''
        }));
        
        setUserFirearms(mappedItems);
      } catch (error) {
        console.error('Error fetching firearms for trading:', error);
      }
    };
    
    fetchUserFirearms();
  }, [session]);

  return {
    userFirearms,
    initialFirearm,
    setInitialFirearm,
  };
};
