
import React, { useRef, useCallback, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import StreetViewAvailabilityChecker from './components/StreetViewAvailabilityChecker';
import StreetViewComponent from './components/StreetViewComponent';
import FullscreenControls from './components/FullscreenControls';
import LocationHeader from './components/LocationHeader';
import StatusMessage from './components/StatusMessage';

interface FullscreenMapViewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: {
    id: string;
    name: string;
    type: string;
    position: google.maps.LatLngLiteral;
    city: string;
    address?: string;
  } | null;
  mapStyles: any[];
}

const FullscreenMapView: React.FC<FullscreenMapViewProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  mapStyles
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [streetViewAvailable, setStreetViewAvailable] = useState<boolean>(false);
  const [showingStreetView, setShowingStreetView] = useState<boolean>(false);
  
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    if (selectedLocation) {
      map.setCenter(selectedLocation.position);
      map.setZoom(18); // Zoom in more for fullscreen view
    }
  }, [selectedLocation]);

  // Close on ESC key press
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Toggle back to map view
  const handleToggleView = useCallback(() => {
    setShowingStreetView(prev => !prev);
  }, []);

  // Handle street view availability check
  const handleStreetViewAvailabilityCheck = useCallback((isAvailable: boolean) => {
    setStreetViewAvailable(isAvailable);
    
    // If Street View is available, initialize it automatically
    if (isAvailable) {
      setShowingStreetView(true);
    }
  }, []);

  if (!isOpen || !selectedLocation) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={onClose}
    >
      <div className="relative flex-grow" onClick={(e) => e.stopPropagation()}>
        <FullscreenControls 
          onClose={onClose}
          onToggleView={handleToggleView}
          streetViewAvailable={streetViewAvailable}
          showingStreetView={showingStreetView}
        />

        <LocationHeader 
          name={selectedLocation.name}
          address={selectedLocation.address}
          city={selectedLocation.city}
        />

        <div ref={mapContainerRef} className="w-full h-full">
          {!showingStreetView && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: false,
                styles: mapStyles,
                zoomControl: true,
                scaleControl: true,
                rotateControl: true,
                clickableIcons: false
              }}
              onLoad={handleMapLoad}
            >
              {selectedLocation && (
                <Marker
                  position={selectedLocation.position}
                  icon={{
                    url: `data:image/svg+xml,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
                        </filter>
                        <path d="M16 4c6.6 0 12 5.4 12 12 0 8-12 20-12 20S4 24 4 16c0-6.6 5.4-12 12-12z" 
                              fill="#ffeeee" stroke="#ff4d4d" stroke-width="2" filter="url(#shadow)"/>
                        <circle cx="16" cy="16" r="5" fill="#ff4d4d"/>
                      </svg>
                    `)}`
                  }}
                />
              )}
            </GoogleMap>
          )}
        </div>

        {showingStreetView && selectedLocation && streetViewAvailable && (
          <StreetViewComponent
            position={selectedLocation.position}
            mapRef={mapRef}
            containerRef={mapContainerRef}
          />
        )}

        <StreetViewAvailabilityChecker
          position={selectedLocation.position} 
          onAvailabilityCheck={handleStreetViewAvailabilityCheck}
        />

        <StatusMessage 
          streetViewAvailable={streetViewAvailable}
          showingStreetView={showingStreetView}
        />
      </div>
    </motion.div>
  );
};

export default FullscreenMapView;
