import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User, Upload, Camera } from "lucide-react";
import Navbar from "@/components/layout/Navbar"; // Import the Navbar

const Settings = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    location: "",
    avatar_url: "",
  });

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
        .select("username, bio, location, avatar_url")
        .eq("id", user?.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
        });
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
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
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
        setProfile({ ...profile, avatar_url: data.publicUrl });
        
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

  return (
    <div>
      <Navbar /> {/* Add Navbar at the top */}
      <div className="container py-10 mt-16"> {/* Add top margin to account for fixed navbar */}
        <h1 className="text-3xl font-bold mb-6">User Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
              
              <div className="w-full">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={uploadLoading}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  disabled={uploadLoading}
                >
                  <Upload className="mr-2 h-4 w-4" /> 
                  {uploadLoading ? "Uploading..." : "Upload new image"}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Supported formats: JPG, PNG, GIF. Max size: 2MB.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Enter your location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself"
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
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
