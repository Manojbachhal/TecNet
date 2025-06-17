import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MapContainer from '@/components/map/MapContainer';
import Footer from '@/components/map/components/Footer';
import PageHeader from '@/components/map/components/PageHeader';
import PantoneView from '@/components/map/PantoneView';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function RangeFinder() {
  const { user } = useAuth();
  const [showPantoneView, setShowPantoneView] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [profileLocation, setProfileLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasProfileLocation, setHasProfileLocation] = useState(false);

  // Fetch profile location
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
            setHasProfileLocation(true);
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

  // Request current location
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

  // Initial location setup
  useEffect(() => {
    fetchProfileLocation();
  }, [user]);

  const handleOpenPantoneView = (locationName: string) => {
    setSelectedLocationName(locationName);
    setShowPantoneView(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        showInfo={false}
        toggleInfo={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {locationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription>
              {locationError}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-border">
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
}
