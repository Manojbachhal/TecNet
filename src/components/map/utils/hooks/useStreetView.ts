
import { useState, useCallback } from 'react';

export const useStreetView = () => {
  const [streetViewAvailable, setStreetViewAvailable] = useState<boolean>(false);
  
  const checkStreetViewAvailability = useCallback(
    (position: google.maps.LatLngLiteral, streetViewService: google.maps.StreetViewService | null) => {
      if (!streetViewService) return;
      
      streetViewService.getPanorama(
        {
          location: position,
          radius: 50
        },
        (data, status) => {
          setStreetViewAvailable(status === google.maps.StreetViewStatus.OK);
        }
      );
    }, 
  []);
  
  const initializeStreetView = useCallback(
    (position: google.maps.LatLngLiteral, streetViewDivRef: React.RefObject<HTMLDivElement>) => {
      if (!streetViewDivRef.current) return null;
      
      const panorama = new google.maps.StreetViewPanorama(streetViewDivRef.current, {
        position: position,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        zoomControl: true,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        enableCloseButton: false,
        panControl: true,
        visible: true,
        linksControl: false,
        disableDefaultUI: true
      });
      
      // Force consistent aspect ratio
      if (streetViewDivRef.current) {
        streetViewDivRef.current.style.width = "100%";
        streetViewDivRef.current.style.height = "120px";
        streetViewDivRef.current.style.aspectRatio = "16/9";
      }
      
      return panorama;
    },
  []);
  
  return { streetViewAvailable, setStreetViewAvailable, checkStreetViewAvailability, initializeStreetView };
};
