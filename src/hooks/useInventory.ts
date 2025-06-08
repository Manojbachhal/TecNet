
import { useState, useEffect, useCallback } from 'react';
import { useInventoryItems } from './inventory/useInventoryItems';
import { useInventorySearch } from './inventory/useInventorySearch';
import { useInventoryActions } from './inventory/useInventoryActions';
import { useInventoryImportExport } from './inventory/useInventoryImportExport';
import { useToast } from '@/hooks/use-toast';

export const useInventory = (session: any) => {
  const { toast } = useToast();
  // Create a stable reference to the session to prevent unnecessary re-renders
  const [currentSession, setCurrentSession] = useState(session);
  
  // Log session information for debugging
  useEffect(() => {
    if (session) {
      console.log('Session info in useInventory:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        userEmail: session?.user?.email 
      });
    } else {
      console.log('No session provided to useInventory');
    }
    
    // Only update if the session changes and there's a real difference in user ID
    if (session?.user?.id !== currentSession?.user?.id) {
      console.log('Session user ID changed, updating currentSession');
      setCurrentSession(session);
    }
  }, [session, currentSession]);
  
  // Only re-fetch data when the currentSession changes, not on every render
  const { items, setItems, isLoading } = useInventoryItems(currentSession);
  const { searchTerm, setSearchTerm, filteredItems } = useInventorySearch(items);
  const { saveItem, deleteItem } = useInventoryActions(currentSession, items, setItems);
  const { exportInventory, importInventory } = useInventoryImportExport(currentSession, items, setItems);
  
  // Log the final data for debugging
  useEffect(() => {
    console.log('Inventory data ready:', { 
      itemCount: items.length,
      filteredCount: filteredItems.length,
      isLoading
    });
  }, [items, filteredItems, isLoading]);
  
  return {
    items: filteredItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    saveItem,
    deleteItem,
    exportInventory,
    importInventory,
  };
};
