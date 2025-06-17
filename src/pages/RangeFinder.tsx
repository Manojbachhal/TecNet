import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MapContainer from '@/components/map/MapContainer';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/map/components/PageHeader';
import InfoPanel from '@/components/map/components/InfoPanel';
import MapMessage from '@/components/map/components/MapMessage';
import Footer from '@/components/map/components/Footer';
import PantoneView from '@/components/map/PantoneView';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";

const RangeFinder = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showPantoneView, setShowPantoneView] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");
  const [profileLocation, setProfileLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchProfileLocation();
    }
  }, [user]);

  const fetchProfileLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('location')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile location:', error);
        requestCurrentLocation();
        return;
      }

      if (data?.location) {
        // Use Google Maps Geocoding to convert address to coordinates
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: data.location }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            setProfileLocation({
              lat: location.lat(),
              lng: location.lng()
            });
            setLocationError(null);
          } else {
            console.error('Geocoding failed:', status);
            requestCurrentLocation();
          }
        });
      } else {
        requestCurrentLocation();
      }
    } catch (error) {
      console.error('Error in fetchProfileLocation:', error);
      requestCurrentLocation();
    }
  };

  const requestCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(pos);
          setLocationError(null);
          
          toast({
            title: "Location Found",
            description: "Using your current location to find nearby ranges.",
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError("Unable to get your location. Please enable location access or set your location in your profile.");
          
          toast({
            title: "Location Error",
            description: "Please enable location access or set your location in your profile.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Please set your location in your profile.");
      
      toast({
        title: "Geolocation Not Supported",
        description: "Please set your location in your profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenPantoneView = (locationName: string) => {
    setSelectedLocationName(locationName);
    setShowPantoneView(true);
  };
  
  const toggleInfo = () => setShowInfo(!showInfo);
  const closeInfo = () => setShowInfo(false);
  
  return (
    <div className="h-full flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 relative z-10 h-full flex flex-col pt-24">
        <PageHeader showInfo={showInfo} toggleInfo={toggleInfo} />
        
        {locationError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription>
              {locationError}
            </AlertDescription>
          </Alert>
        ) : (
          <MapMessage message="Click anywhere on the map to search that location" />
        )}
        
        <InfoPanel isVisible={showInfo} onClose={closeInfo} />
        
        <div className="flex-grow rounded-xl overflow-hidden shadow-xl relative border border-primary/30 cyberpunk-border" style={{ height: "calc(100vh - 250px)" }}>
          <MapContainer 
            initialCenter={profileLocation || currentLocation}
            onOpenPantoneView={handleOpenPantoneView}
          />
        </div>
      </div>
      
      <Footer />
      
      <PantoneView 
        isOpen={showPantoneView} 
        onClose={() => setShowPantoneView(false)}
        locationName={selectedLocationName}
      />
    </div>
  );
};

export default RangeFinder;
