import { ListingItem } from '@/components/trading/types/tradingTypes';
import { ReportData } from '@/components/trading/ReportListingDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useListingActions = (listings: ListingItem[], setListings: React.Dispatch<React.SetStateAction<ListingItem[]>>) => {
  const { toast } = useToast();
  const { session } = useAuth();

  const toggleFavorite = async (id: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      const item = listings.find(item => item.id === id);
      if (!item) return;

      if (item.favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favourites')
          .delete()
          .match({ 
            userId: session.user.id,
            tradeId: id
          });

        if (error) throw error;

        toast({
          title: "Removed from Favorites",
          description: `${item.title} has been removed from your favorites.`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favourites')
          .insert({
            userId: session.user.id,
            tradeId: id
          });

        if (error) throw error;

        toast({
          title: "Added to Favorites",
          description: `${item.title} has been added to your favorites.`,
        });
      }

      // Update local state
      const newListings = listings.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      );
      setListings(newListings);

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const reportListing = async (reportData: ReportData) => {
    try {
      // Map reason codes to human-readable labels
      const reasonMap: Record<string, string> = {
        "illegal": "Illegal item or activity",
        "prohibited": "Prohibited item",
        "fraud": "Fraudulent listing",
        "inappropriate": "Inappropriate content",
        "other": "Other"
      };
      
      // Transform reason codes to readable labels
      const readableReasons = reportData.reasons.map(reason => reasonMap[reason] || reason);
      
      // Create structured details object
      const structuredDetails = {
        listingId: reportData.listingId,
        reasons: readableReasons,
        description: reportData.description || ""
      };
      
      // First, submit the report to the reports table
      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          report_type: 'listing',
          details: JSON.stringify(structuredDetails),
          reporter_id: (await supabase.auth.getUser()).data.user?.id || null,
          status: 'pending'
        });
        
      if (reportError) throw reportError;
      
      // Then, mark the listing as reported
      const { error: updateError } = await supabase
        .from('trading_listings')
        .update({ reported: true })
        .eq('id', reportData.listingId);
        
      if (updateError) throw updateError;
      
      // Update local state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === reportData.listingId ? { ...listing, reported: true } : listing
        )
      );
      
      toast({
        title: "Thank you",
        description: "Your report has been submitted and will be reviewed by our team.",
      });
    } catch (error) {
      console.error('Error reporting listing:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return {
    toggleFavorite,
    reportListing
  };
};
