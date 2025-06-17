import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Classified } from "@/components/classifieds/types";

// Define the database row type to match the table structure
type ClassifiedRow = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  contact_info: string | null;
  image_url: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useClassifieds = () => {
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchClassifieds = async () => {
    try {
      setIsLoading(true);

      // Get all classifieds
      const { data, error } = await supabase
        .from("classifieds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Create a map of user IDs to fetch profile information efficiently
        const userIds = data
          .filter((item) => item.user_id) // Filter out null user_ids
          .map((item) => item.user_id);

        // Only fetch profiles if there are user IDs
        let userProfiles: Record<string, { username?: string; email?: string }> = {};

        if (userIds.length > 0) {
          // Get user profiles for all user IDs
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, email")
            .in("id", userIds);

          if (profilesError) {
            console.error("Error fetching user profiles:", profilesError);
          } else if (profilesData) {
            // Create a map of user ID to profile data for easy lookup
            userProfiles = profilesData.reduce((acc, profile) => {
              acc[profile.id] = {
                username: profile.username,
                email: profile.email,
              };
              return acc;
            }, {} as Record<string, { username?: string; email?: string }>);
          }
        }

        // Format the classified listings with profile information
        const formattedClassifieds: Classified[] = data.map((item) => {
          // Get user information from the profiles map
          const userProfile = item.user_id ? userProfiles[item.user_id] : null;
          const postedBy = userProfile?.username || userProfile?.email || "Anonymous";

          return {
            id: item.id,
            title: item.title,
            description: item.description || "",
            price: item.price || 0,
            contactInfo: item.email || "",
            phoneNumber: item.phone_number || "",
            imageUrl: item.image_url,
            userId: item.user_id,
            createdAt: item.created_at || "",
            updatedAt: item.updated_at || "",
            postedBy: postedBy,
            isSold: item.is_sold || false,
            email: item.email || "",
            phone_number: item.phone_number || "",
            image_url: item.image_url || "",
          };
        });

        setClassifieds(formattedClassifieds);
      }
    } catch (error) {
      console.error("Error fetching classifieds:", error);
      toast({
        title: "Error",
        description: "Failed to load classified ads. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifieds();

    // Set up real-time subscription
    const subscription = supabase
      .channel("classifieds_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classifieds" },
        fetchClassifieds
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter classifieds by search term
  const filteredClassifieds = searchTerm
    ? classifieds.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : classifieds;

  return {
    classifieds: filteredClassifieds,
    isLoading,
    searchTerm,
    setSearchTerm,
    refetchClassifieds: fetchClassifieds,
  };
};
