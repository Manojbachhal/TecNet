import { useState } from 'react';
import { FirearmItem } from '@/components/inventory/InventoryItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateUUID } from '@/lib/utils';

export const useInventoryActions = (session: any, items: FirearmItem[], setItems: React.Dispatch<React.SetStateAction<FirearmItem[]>>) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const saveItem = async (firearm: FirearmItem) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to save items.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsProcessing(true);
      const userId = session.user.id;
      console.log('Saving firearm with data:', { ...firearm, user_id: userId });
      
      // Check if firearm has an ID (for update) or not (for create)
      const isNewItem = !firearm.id || firearm.id === '' || items.findIndex(item => item.id === firearm.id) === -1;
      
      if (!isNewItem) {
        // Update existing firearm
        console.log('Updating existing firearm with ID:', firearm.id);
        const { error } = await supabase
          .from('firearms')
          .update({
            make: firearm.make,
            model: firearm.model,
            caliber: firearm.caliber,
            serial_number: firearm.serialNumber,
            condition: firearm.condition,
            purchase_date: firearm.purchaseDate,
            value: firearm.value,
            notes: firearm.notes,
            image_url: firearm.image_url || firearm.image || '',
            user_id: userId // Ensure user_id is set correctly
          })
          .eq('id', firearm.id)
          .eq('user_id', userId); // Additional safety check
          
        if (error) throw error;
        
        // Update the item in the array
        setItems(items.map(item => item.id === firearm.id ? firearm : item));
        
        toast({
          title: "Firearm Updated",
          description: `${firearm.make} ${firearm.model} has been updated.`,
        });
      } else {
        // Create new firearm
        console.log('Creating new firearm');
        
        // Generate a new ID if none exists
        if (!firearm.id) {
          firearm.id = generateUUID();
        }
        
        const { data, error } = await supabase
          .from('firearms')
          .insert({
            id: firearm.id,
            user_id: userId,
            make: firearm.make,
            model: firearm.model,
            caliber: firearm.caliber,
            serial_number: firearm.serialNumber,
            condition: firearm.condition,
            purchase_date: firearm.purchaseDate,
            value: firearm.value,
            notes: firearm.notes,
            image_url: firearm.image_url || firearm.image || ''
          })
          .select('*')
          .single();
          
        if (error) {
          console.error('Error creating firearm:', error);
          throw error;
        }
        
        console.log('Created firearm, received data:', data);
        
        // Create a proper FirearmItem to add to the array
        const newFirearm: FirearmItem = {
          id: data.id,
          make: data.make,
          model: data.model,
          caliber: data.caliber || '',
          serialNumber: data.serial_number,
          condition: data.condition,
          purchaseDate: data.purchase_date || new Date().toISOString().split('T')[0],
          value: Number(data.value) || 0,
          notes: data.notes || '',
          image: data.image_url || '',
          image_url: data.image_url || ''
        };
        
        // Add the new item to the array
        setItems(prevItems => [newFirearm, ...prevItems]);
        
        toast({
          title: "Firearm Added",
          description: `${firearm.make} ${firearm.model} has been added to your inventory.`,
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Error saving firearm:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save firearm. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const deleteItem = async (id: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to delete items.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsProcessing(true);
      const userId = session.user.id;
      
      console.log('Deleting firearm with ID:', id, 'for user:', userId);
      
      // First, check if there are any trading listings using this firearm
      const { data: listingsData, error: listingsError } = await supabase
        .from('trading_listings')
        .select('id')
        .eq('firearm_id', id)
        .eq('status', 'active');
        
      if (listingsError) throw listingsError;
      
      // If there are active listings, cancel them first
      if (listingsData && listingsData.length > 0) {
        console.log(`Found ${listingsData.length} active listings for this firearm. Cancelling them first.`);
        
        const { error: updateError } = await supabase
          .from('trading_listings')
          .update({ status: 'cancelled' })
          .eq('firearm_id', id)
          .eq('owner_id', userId);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Trading Listings Updated",
          description: `${listingsData.length} active listing(s) for this firearm have been cancelled.`,
        });
      }
      
      // Now delete the firearm
      const { error } = await supabase
        .from('firearms')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Remove the item from the array
      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: "Firearm Deleted",
        description: "The firearm has been removed from your inventory.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting firearm:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete firearm. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    saveItem,
    deleteItem,
    isProcessing
  };
};
