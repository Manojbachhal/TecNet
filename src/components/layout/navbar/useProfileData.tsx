
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useProfileData(user: User | null) {
  const [userInitial, setUserInitial] = useState("U");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Set user initial from email or username
    if (user?.email) {
      setUserInitial(user.email.charAt(0).toUpperCase());
    }
    
    // Fetch user profile data to get avatar URL
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
      
      if (data?.username) {
        setUserInitial(data.username.charAt(0).toUpperCase());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return { userInitial, avatarUrl };
}
