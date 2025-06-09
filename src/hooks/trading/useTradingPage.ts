import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTradingListings } from '@/hooks/useTradingListings';
import { useTradeFilters } from '@/hooks/trading/useTradeFilters';
import { useInventoryIntegration } from '@/hooks/trading/useInventoryIntegration';
import { ListingItem } from '@/components/trading/types/tradingTypes';
import { ReportData } from '@/components/trading/ReportListingDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTradingPage = () => {
  // State from the useTradingListings hook
  const { listings, isLoading, toggleFavorite, reportListing, setListings } = useTradingListings();

  // Local state for UI management
  const [activeTab, setActiveTab] = useState('all');
  const [contactItem, setContactItem] = useState<ListingItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListingItem | null>(null);
  
  // Auth context for user information
  const { session } = useAuth();
  const sessionUsername = session ? session.user.email?.split('@')[0] : null;
  const { toast } = useToast();

  // Filters and sorting
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    getFilteredListings,
  } = useTradeFilters(listings, activeTab, session);
  
  // Inventory integration (for creating listings from inventory items)
  const {
    userFirearms,
    initialFirearm,
    setInitialFirearm,
  } = useInventoryIntegration(session);
  
  // Define handler functions that use the core actions
  const handleContactSeller = (id: string) => {
    const item = listings.find(item => item.id === id);
    if (item) {
      setContactItem(item);
    }
    return item;
  };
  
  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };
  
  const handleReportListing = (reportData: ReportData) => {
    reportListing(reportData);
  };
  
  const handleDeleteListing = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trading_listings')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setListings(prevListings => 
        prevListings.filter(item => item.id !== id)
      );
      
      toast({
        title: "Listing Deleted",
        description: "Your listing has been removed successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const handleSaveListing = async (data: any, editingId?: string) => {
    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a listing");
      }

      // Ensure we have a valid image URL or null
      let imageUrl = null;
      if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.trim() !== '') {
        imageUrl = data.imageUrl;
      } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        imageUrl = data.images[0];
      }
      
      // Format the data for the database
      const formattedData = {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description || null,
        condition: data.condition || 'Good',
        location: data.location || null,
        image_url: imageUrl,
        firearm_id: data.firearmId || null,
        seller_name: sessionUsername,
        seller_rating: 5,
        owner_id: session.user.id,
        status: 'active' as const,
        listing_type: 'sale' as const
      };

      console.log('Saving listing with data:', formattedData, 'editingId:', editingId);
      
      let result;
      if (editingId) {
        // Update existing listing
        result = await supabase
          .from('trading_listings')
          .update(formattedData)
          .eq('id', editingId)
          .eq('owner_id', session.user.id)
          .select()
          .single();
          
        if (result.error) {
          console.error('Error updating listing:', result.error);
          throw result.error;
        }
        
        toast({
          title: "Listing Updated",
          description: "Your listing has been updated successfully.",
        });
      } else {
        // Create new listing
        result = await supabase
          .from('trading_listings')
          .insert(formattedData)
          .select()
          .single();
          
        if (result.error) {
          console.error('Error creating listing:', result.error);
          throw result.error;
        }
        
        toast({
          title: "Listing Created",
          description: "Your listing has been created successfully.",
        });
      }

      // Fetch fresh listings after successful save
      const { data: freshListings, error: fetchError } = await supabase
        .from('trading_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!fetchError && freshListings) {
        const transformedListings = freshListings.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          location: item.location || '',
          condition: item.condition || 'Good',
          sellerName: item.seller_name || 'Anonymous',
          sellerRating: item.seller_rating || 5,
          postedDate: 'Just now',
          images: item.image_url ? [item.image_url] : [],
          description: item.description || '',
          favorite: false,
          firearmId: item.firearm_id,
          reported: item.reported || false
        }));
        setListings(transformedListings);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save listing. Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Custom UI handlers that combine other handlers
  const handleEditListing = (id: string) => {
    const item = listings.find(item => item.id === id);
    if (item) {
      setEditItem(item);
      setIsCreateDialogOpen(true);
    }
  };
  
  const handleCreateListing = () => {
    if (!session) {
      return;
    }
    
    setEditItem(null);
    setInitialFirearm(null);
    setIsCreateDialogOpen(true);
  };

  // Get filtered listings
  const filteredListings = getFilteredListings();

  return {
    listings,
    filteredListings,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    activeTab,
    setActiveTab,
    contactItem,
    setContactItem,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    editItem,
    userFirearms,
    initialFirearm,
    setInitialFirearm,
    sessionUsername,
    handleContactSeller,
    handleToggleFavorite,
    handleEditListing,
    handleCreateListing,
    handleSaveListing,
    handleDeleteListing,
    handleReportListing,
  };
};
