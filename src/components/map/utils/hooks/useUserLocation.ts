
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useUserLocation = () => {
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const { toast } = useToast();
  
  const getUserLocation = useCallback((callback?: (position: google.maps.LatLngLiteral) => void) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserPosition(pos);
          
          toast({
            title: "Location Found",
            description: "Using your current location to find nearby ranges.",
          });
          
          if (callback) callback(pos);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: `Unable to get your location: ${error.message}`,
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  return { userPosition, getUserLocation, setUserPosition };
};
