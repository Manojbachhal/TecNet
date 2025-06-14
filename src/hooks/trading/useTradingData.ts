import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ListingItem } from "@/components/trading/types/tradingTypes";
import { formatDateDifference } from "@/components/trading/utils/dateUtils";
import { useAuth } from "@/contexts/AuthContext";

export const useTradingData = () => {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);

        // Fetch active listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("trading_listings")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (listingsError) {
          throw listingsError;
        }

        // Fetch user's favorites if logged in
        let userFavorites: string[] = [];
        if (session?.user?.id) {
          const { data: favoritesData, error: favoritesError } = await supabase
            .from("favourites")
            .select("tradeId")
            .eq("userId", session.user.id);

          if (favoritesError) {
            console.error("Error fetching favorites:", favoritesError);
          } else {
            userFavorites = favoritesData.map(fav => fav.tradeId);
          }
        }

        const transformedListings: ListingItem[] = listingsData.map((item) => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          location: item.location || "",
          condition: item.condition || "Good",
          sellerName: item.seller_name || "Anonymous",
          owner_id: item.owner_id,
          sellerRating: item.seller_rating || 5,
          postedDate: formatDateDifference(new Date(item.created_at)),
          images: item.image_url ? [item.image_url] : [],
          description: item.description || "",
          favorite: userFavorites.includes(item.id),
          firearmId: item.firearm_id,
          reported: item.reported || false,
        }));

        console.log("Fetched listings:", transformedListings);
        setListings(transformedListings);
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

    fetchListings();
  }, [toast, session?.user?.id]); // Add session.user.id as dependency

  return { listings, setListings, isLoading };
};
