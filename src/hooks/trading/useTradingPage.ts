import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTradingListings } from "@/hooks/useTradingListings";
import { useTradeFilters } from "@/hooks/trading/useTradeFilters";
import { useInventoryIntegration } from "@/hooks/trading/useInventoryIntegration";
import { ListingItem } from "@/components/trading/types/tradingTypes";
import { ReportData } from "@/components/trading/ReportListingDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const useTradingPage = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [contactItem, setContactItem] = useState<ListingItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListingItem | null>(null);

  const sessionUsername = session?.user?.user_metadata?.username;

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("trading_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedListings = data.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          location: item.location,
          condition: item.condition,
          sellerName: item.seller_name,
          sellerRating: item.seller_rating,
          postedDate: item.created_at,
          images: item.image_url ? [item.image_url] : [],
          description: item.description,
          favorite: false,
          isSold: item.is_sold || false,
          owner_id: item.owner_id,
          listing_type: item.listing_type,
          reported: item.reported,
        }));

        setListings(formattedListings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch in useEffect
  useEffect(() => {
    fetchListings();
  }, []); // Empty dependency array means this runs once on mount

  const handleCreateListing = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create a listing.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleSaveListing = async (listing: ListingItem, editingId?: string) => {
    try {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "You must be signed in to create or edit listings.",
          variant: "destructive"
        });
        return false;
      }

      const listingData = {
        title: listing.title,
        price: listing.price,
        location: listing.location,
        condition: listing.condition,
        description: listing.description,
        image_url: listing.images[0] || null,
        owner_id: session.user.id,
        firearm_id: listing.firearmId,
        listing_type: "sale" as const,
        status: "active" as const,
        is_sold: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from("trading_listings")
          .update(listingData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("trading_listings")
          .insert([listingData]);

        if (error) throw error;
      }

      await fetchListings();
      return true;
    } catch (error) {
      console.error("Error saving listing:", error);
      toast({
        title: "Error",
        description: "Failed to save listing. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleContactSeller = (id: string) => {
    const item = listings.find((item) => item.id === id);
    if (item) {
      setContactItem(item);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to favorite listings.",
        variant: "destructive",
      });
      return;
    }

    const updatedListings = listings.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setListings(updatedListings);
  };

  const handleEditListing = (id: string) => {
    const item = listings.find((item) => item.id === id);
    if (item) {
      setEditItem(item);
      setIsCreateDialogOpen(true);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await supabase.from("trading_listings").delete().eq("id", id);
      toast({
        title: "Listing Deleted",
        description: "Your listing has been removed.",
      });
      fetchListings();
      return true;
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete your listing. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleReportListing = async (reportData: any) => {
    try {
      await supabase.from("trading_listings").update({ reported: true }).eq("id", reportData.id);
      toast({
        title: "Listing Reported",
        description: "Thank you for your report. We will review it shortly.",
      });
      fetchListings();
    } catch (error) {
      console.error("Error reporting listing:", error);
      toast({
        title: "Error",
        description: "Failed to report the listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSold = async (id: string) => {
    try {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "You must be signed in to mark items as sold.",
          variant: "destructive"
        });
        return;
      }

      // Update the listing as sold
      const { error: updateError } = await supabase
        .from("trading_listings")
        .update({ 
          is_sold: true,
          status: "sold" as const,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating listing:", updateError);
        throw updateError;
      }

      // Remove from favourites table if present
      const { error: favouritesError } = await supabase
        .from("favourites")
        .delete()
        .eq("tradeId", id);

      if (favouritesError) {
        console.error("Error removing from favourites:", favouritesError);
        // Don't throw here, as this is not critical
      }

      await fetchListings();
      toast({
        title: "Success",
        description: "Item marked as sold successfully."
      });
    } catch (error) {
      console.error("Error marking item as sold:", error);
      toast({
        title: "Error",
        description: "Failed to mark item as sold. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFilteredListings = () => {
    let filtered = [...listings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((item) => item.price >= min && item.price <= max);
    }

    // Filter by active tab
    if (activeTab === "my-listings") {
      filtered = filtered.filter((item) => item.owner_id === session?.user.id);
    } else if (activeTab === "favorites") {
      filtered = filtered.filter((item) => item.favorite);
    }

    // Sort listings
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
        break;
    }

    return filtered;
  };

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
    sessionUsername,
    contactItem,
    setContactItem,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    editItem,
    handleCreateListing,
    handleSaveListing,
    handleContactSeller,
    handleToggleFavorite,
    handleEditListing,
    handleDeleteListing,
    handleReportListing,
    handleSold,
    refetchListings: fetchListings,
  };
};

export { useTradingPage };
