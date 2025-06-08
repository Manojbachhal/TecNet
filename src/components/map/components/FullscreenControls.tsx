
import React from 'react';
import { X, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenControlsProps {
  onClose: () => void;
  onToggleView: () => void;
  streetViewAvailable: boolean;
  showingStreetView: boolean;
}

const FullscreenControls: React.FC<FullscreenControlsProps> = ({
  onClose,
  onToggleView,
  streetViewAvailable,
  showingStreetView
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      {streetViewAvailable && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border-primary/20"
          onClick={onToggleView}
          aria-label={showingStreetView ? "Switch to map view" : "Switch to street view"}
        >
          <MapIcon className="h-5 w-5" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border-primary/20"
        onClick={onClose}
        aria-label="Close fullscreen map"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FullscreenControls;
