
import React, { useRef, useEffect } from 'react';

interface StreetViewComponentProps {
  position: google.maps.LatLngLiteral;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  containerRef: React.RefObject<HTMLDivElement>;
  onStreetViewInitialized?: (panorama: google.maps.StreetViewPanorama) => void;
}

const StreetViewComponent: React.FC<StreetViewComponentProps> = ({
  position,
  mapRef,
  containerRef,
  onStreetViewInitialized
}) => {
  const streetViewPanoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (containerRef.current && mapRef.current) {
      const panorama = new google.maps.StreetViewPanorama(containerRef.current, {
        position: position,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: true,
        showRoadLabels: true,
        zoomControl: true,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: true,
        enableCloseButton: false,
        panControl: true,
        visible: true,
        linksControl: true
      });
      
      mapRef.current.setStreetView(panorama);
      streetViewPanoramaRef.current = panorama;
      
      if (onStreetViewInitialized) {
        onStreetViewInitialized(panorama);
      }
    }
    
    return () => {
      if (streetViewPanoramaRef.current) {
        streetViewPanoramaRef.current.setVisible(false);
      }
    };
  }, [position, mapRef, containerRef, onStreetViewInitialized]);

  return null;
};

export default StreetViewComponent;
