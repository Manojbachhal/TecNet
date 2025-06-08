
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";

interface ProfileData {
  username: string;
  bio: string;
  location: string;
  phone_number: string;
  avatar_url: string;
}

interface ProfileSettingsProps {
  user: User;
  profileData: ProfileData;
  loading: boolean;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  updateProfile: () => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  profileData,
  loading,
  setProfileData,
  updateProfile
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and how others can contact you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              value={profileData.username}
              onChange={(e) => setProfileData({...profileData, username: e.target.value})}
              placeholder="Your display name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              placeholder="Your city/state"
            />
            <p className="text-sm text-muted-foreground">
              General area only, for safety reasons. Be careful not to share your exact address.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              value={profileData.phone_number}
              onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
              placeholder="Your contact number"
            />
            <p className="text-sm text-muted-foreground">
              Only visible to verified traders when a transaction is in progress.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              placeholder="Tell others about yourself"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account security and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Your email address is verified and cannot be changed.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
