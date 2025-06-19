import React, { useRef, useEffect } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { MapPin, Maximize, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { GunLocation } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationInfoWindowProps {
  selectedLocation: GunLocation;
  onClose: () => void;
  streetViewAvailable: boolean;
  initializeStreetView: (position: google.maps.LatLngLiteral, streetViewDivRef: React.RefObject<HTMLDivElement>) => void;
  onShowFullscreenMap: () => void;
}

const LocationInfoWindow: React.FC<LocationInfoWindowProps> = ({
  selectedLocation,
  onClose,
  streetViewAvailable,
  initializeStreetView,
  onShowFullscreenMap
}) => {
  const streetViewDivRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (selectedLocation && streetViewAvailable) {
      initializeStreetView(selectedLocation.position, streetViewDivRef);
    }
    
    console.log("LocationInfoWindow - Selected location:", selectedLocation.name, "Type:", selectedLocation.type);
  }, [selectedLocation, streetViewAvailable, initializeStreetView]);

  const handleGetDirections = () => {
    const { lat, lng } = selectedLocation.position;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <InfoWindow
      position={selectedLocation.position}
      onCloseClick={onClose}
      options={{
        pixelOffset: new google.maps.Size(0, -40),
        maxWidth: isMobile ? 375 : 500
      }}
    >
      <div className="p-1 font-sans bg-[#1A1F2C] text-white rounded-md w-full max-w-[375px] border border-white/10">
        <h3 className="text-sm font-medium text-white/90 mb-0.5 truncate">{selectedLocation.name}</h3>
        <p className="text-xs text-white/70 mb-1 truncate">
          {selectedLocation.address || selectedLocation.city}
        </p>
        
        <div className="flex items-center mb-1 justify-between">
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor: 
                  selectedLocation.type === 'range' ? '#ff4d4d' :
                  selectedLocation.type === 'shop' ? '#4d94ff' :
                  selectedLocation.type === 'gunsmith' ? '#ffa64d' :
                  selectedLocation.type === 'training' ? '#4dff88' :
                  selectedLocation.type === 'museum' ? '#cb4dff' :
                  selectedLocation.type === 'clay' ? '#ffcc4d' : '#ffffff'
              }}
            ></div>
            <span className="text-[10px] text-white/80 capitalize">
              {selectedLocation.type}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleGetDirections}
              title="Get Directions"
            >
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-white/80 hover:text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                onShowFullscreenMap();
              }}
              title={streetViewAvailable ? "Open in Street View" : "Open in Fullscreen Map"}
            >
              <Maximize className="h-3 w-3 mr-1" />
              {streetViewAvailable ? "Street View" : "Full Map"}
            </Button>
          </div>
        </div>
        
        {streetViewAvailable ? (
          <div className="w-full h-[120px] rounded-md overflow-hidden shadow-sm border border-white/5">
            <div ref={streetViewDivRef} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-[120px] rounded-md overflow-hidden shadow-sm flex items-center justify-center bg-black/30 border border-white/5">
            <div className="text-center p-3">
              <MapPin className="w-6 h-6 mx-auto mb-1.5 text-white/40" />
              <p className="text-xs text-white/60">Street View not available</p>
            </div>
          </div>
        )}
        
        {!isMobile && streetViewAvailable && (
          <div className="text-[8px] text-white/50 mt-0.5 text-center">
            Drag to look around
          </div>
        )}
      </div>
    </InfoWindow>
  );
};

export default LocationInfoWindow;
