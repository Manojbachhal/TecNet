import React, { useState } from "react";
import { MapPin, Flag, AlertTriangle, User, Phone, Shield, Copy, Camera, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { User as UserType } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  username: string;
  bio: string;
  location: string;
  phone_number: string;
  avatar_url: string;
}

interface ProfileOverviewProps {
  user: UserType;
  profileData: ProfileData;
  isLocationVerified: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ 
  user, 
  profileData, 
  isLocationVerified,
  setProfileData
}) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  
  const copyUserID = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast({
        title: "User ID copied",
        description: "Your user ID has been copied to clipboard"
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadLoading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image less than 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      if (data) {
        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: data.publicUrl })
          .eq("id", user?.id);
        
        if (updateError) {
          throw updateError;
        }
        
        // Update local state
        setProfileData({ ...profileData, avatar_url: data.publicUrl });
        
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error uploading avatar",
        description: "There was an error uploading your profile picture.",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setRemoveLoading(true);
      
      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user?.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setProfileData({ ...profileData, avatar_url: "" });
      
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed successfully.",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error removing avatar",
        description: "There was an error removing your profile picture.",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="relative">
        <div className="flex justify-center mb-4">
          <div className="relative rounded-full overflow-hidden w-32 h-32 border-4 border-primary/20 bg-muted flex items-center justify-center">
            {profileData.avatar_url ? (
              <img 
                src={profileData.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
            <label 
              htmlFor="profile-avatar-upload"
                  className="p-2 rounded-full bg-primary hover:bg-primary/90 text-white cursor-pointer"
            >
                  <Camera className="w-5 h-5" />
            </label>
                {profileData.avatar_url && (
                  <button
                    onClick={removeAvatar}
                    disabled={removeLoading}
                    className="p-2 rounded-full bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <input
              id="profile-avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
              disabled={uploadLoading}
            />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">
          {profileData.username || "Unnamed User"}
        </CardTitle>
        <CardDescription className="text-center">
          <div className="text-sm text-muted-foreground">
            Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
          </div>
          
          <div className="mt-2 flex justify-center gap-2">
            {isLocationVerified ? (
              <Badge variant="outline" className="bg-green-100/20 text-green-700 border-green-200 flex gap-1 items-center">
                <Shield className="h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100/20 text-yellow-700 border-yellow-200 flex gap-1 items-center">
                <AlertTriangle className="h-3 w-3" /> Unverified
              </Badge>
            )}
            <Badge variant="outline" className="flex gap-1 items-center">
              <Flag className="h-3 w-3" /> Trusted Trader
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">User ID</div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <code className="text-xs truncate flex-1">{user.id}</code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={copyUserID}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {profileData.location && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
            </div>
          )}

          {profileData.phone_number && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Contact</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.phone_number}</span>
              </div>
            </div>
          )}
          
          {profileData.bio && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">About</div>
              <p className="text-sm">{profileData.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
