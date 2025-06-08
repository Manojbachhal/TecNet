import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/layout/Navbar";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileTabs from "@/components/profile/ProfileTabs";

const Profile = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    location: "",
    phone_number: "",
    avatar_url: "",
  });
  const [isLocationVerified, setIsLocationVerified] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, location, phone_number, avatar_url, location_verified")
        .eq("id", user?.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfileData({
          username: data.username || "",
          bio: data.bio || "",
          location: data.location || "",
          phone_number: data.phone_number || "",
          avatar_url: data.avatar_url || "",
        });
        setIsLocationVerified(data.location_verified || false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          phone_number: profileData.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);
      
      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update profile data when location is verified
  useEffect(() => {
    if (user && isLocationVerified) {
      // Fetch updated profile data after location verification
      fetchProfile();
    }
  }, [isLocationVerified, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl py-10 pt-24">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <ProfileOverview 
            user={user} 
            profileData={profileData} 
            isLocationVerified={isLocationVerified} 
            setProfileData={setProfileData}
          />

          <ProfileTabs 
            user={user}
            profileData={profileData}
            isLocationVerified={isLocationVerified}
            setIsLocationVerified={setIsLocationVerified}
            loading={loading}
            setProfileData={setProfileData}
            updateProfile={updateProfile}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
