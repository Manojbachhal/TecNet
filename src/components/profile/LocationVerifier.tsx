
import React, { useState, useEffect } from "react";
import { MapPin, Check, AlertTriangle, Compass, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserLocationMap from "./UserLocationMap";
import { supabase } from "@/integrations/supabase/client";

interface LocationVerifierProps {
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  location: string;
}

const LocationVerifier: React.FC<LocationVerifierProps> = ({ 
  isVerified, 
  setIsVerified, 
  location 
}) => {
  const [address, setAddress] = useState(location || "");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userIPLocation, setUserIPLocation] = useState<any>(null);
  const [isLoadingIPLocation, setIsLoadingIPLocation] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (!isVerified) {
      getUserIPLocation();
    } else if (location) {
      setShowMap(true);
    }
  }, [isVerified, location]);

  const getUserIPLocation = async () => {
    setIsLoadingIPLocation(true);
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        setUserIPLocation({
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country_name
        });
        
        // Pre-fill the address field with the detected location
        const detectedAddress = `${data.city}, ${data.region}, ${data.country_name}`;
        if (!address) {
          setAddress(detectedAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching IP location:", error);
      toast({
        title: "Location Detection Failed",
        description: "We couldn't automatically detect your location. Please enter it manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingIPLocation(false);
    }
  };

  const confirmLocation = async () => {
    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your location to continue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // If user is logged in, save their location
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            location: address,
            location_verified: true 
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      setIsVerified(true);
      setShowMap(true);
      setIsConfirmDialogOpen(false);
      
      toast({
        title: "Location Confirmed",
        description: "Your location has been successfully saved",
      });
    } catch (error) {
      console.error("Error saving location:", error);
      toast({
        title: "Error saving location",
        description: "There was an error saving your location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Location</CardTitle>
          <CardDescription>
            Sharing your general location helps with local trading and connections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerified ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Location Confirmed</AlertTitle>
              <AlertDescription>
                Your location has been set to: {address}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <MapPin className="h-4 w-4 text-blue-600" />
              <AlertTitle>Confirm Your Location</AlertTitle>
              <AlertDescription>
                We've detected your approximate location. Please confirm or update it below.
              </AlertDescription>
            </Alert>
          )}

          {userIPLocation && (
            <div className="my-4">
              <h3 className="text-sm font-medium mb-2">Detected Location:</h3>
              <div className="rounded-md overflow-hidden border h-64 bg-muted">
                <UserLocationMap location={userIPLocation} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {userIPLocation.city}, {userIPLocation.region}, {userIPLocation.country}
              </p>
            </div>
          )}

          {isLoadingIPLocation && (
            <div className="flex items-center justify-center h-64 bg-muted rounded-md">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm">Detecting your location...</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Your Location</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, State, Country"
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Only your city and state are shown publicly. Your street address is never shared.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!isVerified ? (
            <Button 
              className="w-full" 
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={loading || !address.trim()}
            >
              {loading ? "Saving..." : "Confirm Location"}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setIsVerified(false)}
            >
              Update Location
            </Button>
          )}

          {showMap && (
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
              <UserLocationMap location={userIPLocation || { 
                lat: 40.7128, 
                lng: -74.0060,
                city: address.split(',')[0],
                region: address.split(',')[1],
                country: address.split(',')[2]
              }} />
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Location</DialogTitle>
            <DialogDescription>
              Your location will be set to: {address}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              This information will be used to help connect you with local traders and buyers. 
              Only your city and state are shown publicly. Your exact address is never shared.
            </p>
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Privacy Notice</AlertTitle>
              <AlertDescription>
                Make sure you're comfortable sharing your city and state before confirming.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmLocation} disabled={loading}>
              {loading ? "Saving..." : "Confirm Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isVerified && (
        <Card>
          <CardHeader>
            <CardTitle>Safety Guidelines</CardTitle>
            <CardDescription>
              Recommendations for safe in-person transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Meet in safe, public locations</h4>
              <p className="text-sm text-muted-foreground">
                Police station parking lots, shopping centers, or other public areas with security cameras are ideal.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Bring a friend</h4>
              <p className="text-sm text-muted-foreground">
                Don't attend meetings alone, especially for high-value transactions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Verify identity</h4>
              <p className="text-sm text-muted-foreground">
                Ask to see a valid ID that matches the seller's profile information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationVerifier;
