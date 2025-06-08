
import React from "react";
import { User, MapPin, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserType } from "@supabase/supabase-js";
import LocationVerifier from "@/components/profile/LocationVerifier";
import ReportingSection from "@/components/profile/ReportingSection";
import ProfileSettings from "@/components/profile/ProfileSettings";

interface ProfileData {
  username: string;
  bio: string;
  location: string;
  phone_number: string;
  avatar_url: string;
}

interface ProfileTabsProps {
  user: UserType;
  profileData: ProfileData;
  isLocationVerified: boolean;
  setIsLocationVerified: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  updateProfile: () => Promise<void>;
  isMobile: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  profileData,
  isLocationVerified,
  setIsLocationVerified,
  loading,
  setProfileData,
  updateProfile,
  isMobile
}) => {
  return (
    <div className="w-full md:w-2/3">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`${isMobile ? "grid-cols-3 w-full" : "grid grid-cols-3 mb-6"}`}>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            {isMobile ? (
              <User className="h-4 w-4" />
            ) : (
              <>
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </>
            )}
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            {isMobile ? (
              <MapPin className="h-4 w-4" />
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </>
            )}
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center gap-2">
            {isMobile ? (
              <Flag className="h-4 w-4" />
            ) : (
              <>
                <Flag className="h-4 w-4" />
                <span>Reporting & Safety</span>
              </>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings 
            user={user}
            profileData={profileData}
            loading={loading}
            setProfileData={setProfileData}
            updateProfile={updateProfile}
          />
        </TabsContent>
        
        <TabsContent value="location">
          <LocationVerifier 
            isVerified={isLocationVerified} 
            setIsVerified={setIsLocationVerified} 
            location={profileData.location}
          />
        </TabsContent>
        
        <TabsContent value="reporting">
          <ReportingSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
