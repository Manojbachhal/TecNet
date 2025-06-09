import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import InventoryForm from '@/components/inventory/InventoryForm';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryGrid from '@/components/inventory/InventoryGrid';
import AuthCheck from '@/components/inventory/AuthCheck';
import { FirearmItem } from '@/components/inventory/InventoryItem';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/contexts/AuthContext';

export default function Inventory() {
  const { toast } = useToast();
  const { session, user } = useAuth(); // Use the AuthContext
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<FirearmItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log('Inventory page - Auth state:', {
      hasSession: !!session,
      userId: user?.id,
      userEmail: user?.email
    });
  }, [session, user]);
  
  // Create storage bucket if it doesn't exist (handled in AuthCheck component)
  
  // Get inventory hook
  const {
    items: filteredItems,
    isLoading,
    searchTerm,
    setSearchTerm,
    saveItem,
    deleteItem,
    exportInventory,
    importInventory,
  } = useInventory(session);
  
  // Check location state for any actions from Trading
  useEffect(() => {
    if (location.state?.fromTrading && location.state?.action === 'createListing') {
      toast({
        title: "List Item for Trade",
        description: "Select an item from your inventory to list on the trading platform."
      });
    }
  }, [location, toast]);
  
  const handleAddItem = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };
  
  const handleEditItem = (item: FirearmItem) => {
    setEditItem(item);
    setIsFormOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id);
  };
  
  const confirmDelete = async () => {
    if (!deleteItemId) return;
    
    const { error: deleteListingsError } = await supabase
      .from('trading_listings')
      .delete()
      .eq('firearm_id', deleteItemId)
      .eq('owner_id', user?.id);
    
    const success = await deleteItem(deleteItemId);
    if (success) {
      setDeleteItemId(null);
    }
  };
  
  const handleSaveItem = async (item: FirearmItem) => {
    const success = await saveItem(item);
    if (success) {
      setIsFormOpen(false);
    }
  };

  const handleListForTrading = (item: FirearmItem) => {
    navigate('/trading', {
      state: {
        listItem: item,
        action: 'createListing'
      }
    });
    
    toast({
      title: "Create Listing",
      description: `${item.make} ${item.model} ready to list for trading.`
    });
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <InventoryHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddItem={handleAddItem}
          onExportInventory={exportInventory}
          onImportInventory={importInventory}
        />
        
        <AuthCheck isAuthenticated={!!session} isLoading={isLoading} />
        
        {session && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InventoryGrid 
              items={filteredItems}
              searchTerm={searchTerm}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              onListForTrading={handleListForTrading}
            />
          </motion.div>
        )}
        
        <InventoryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveItem}
          editItem={editItem}
        />
        
        <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this firearm from your inventory? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
