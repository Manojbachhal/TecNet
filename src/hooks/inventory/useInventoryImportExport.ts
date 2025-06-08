
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FirearmItem } from '@/components/inventory/InventoryItem';

export const useInventoryImportExport = (
  session: any, 
  items: FirearmItem[],
  setItems: React.Dispatch<React.SetStateAction<FirearmItem[]>>
) => {
  const { toast } = useToast();
  
  // Export inventory
  const exportInventory = () => {
    if (items.length === 0) {
      toast({
        title: "Nothing to Export",
        description: "Your inventory is empty.",
        variant: "destructive"
      });
      return;
    }
    
    // Create JSON data
    const jsonData = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'firearms-inventory.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Your inventory has been exported as JSON."
    });
  };
  
  // Import inventory
  const importInventory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to import items to your inventory.",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedItems = JSON.parse(event.target?.result as string) as FirearmItem[];
        
        // Validate imported data
        if (!Array.isArray(importedItems)) throw new Error('Invalid format');
        
        // Basic validation of each item
        importedItems.forEach(item => {
          if (!item.id || !item.make || !item.model || !item.serialNumber) {
            throw new Error('Missing required fields');
          }
        });
        
        // Insert all items to Supabase
        const supabaseItems = importedItems.map(item => ({
          id: item.id,
          user_id: session.user.id,
          make: item.make,
          model: item.model,
          caliber: item.caliber,
          serial_number: item.serialNumber,
          condition: item.condition,
          purchase_date: item.purchaseDate,
          value: item.value,
          notes: item.notes,
          image_url: item.image
        }));
        
        // Use upsert to handle duplicates
        const { error } = await supabase
          .from('firearms')
          .upsert(supabaseItems);
          
        if (error) throw error;
        
        // Refresh the list
        const { data, error: fetchError } = await supabase
          .from('firearms')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        
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
          image: item.image_url || ''
        }));
        
        setItems(mappedItems);
        
        toast({
          title: "Import Complete",
          description: `${importedItems.length} firearms have been imported.`
        });
      } catch (error: any) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: error.message || "Invalid file format or data structure.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  return {
    exportInventory,
    importInventory
  };
};
