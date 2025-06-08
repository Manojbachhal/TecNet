
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StatusMessageProps {
  streetViewAvailable: boolean;
  showingStreetView: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  streetViewAvailable,
  showingStreetView
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {!streetViewAvailable && (
        <div className="absolute bottom-10 left-0 right-0 mx-auto text-center">
          <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            Street View not available for this location
          </div>
        </div>
      )}

      {isMobile && (
        <div className="absolute bottom-8 left-0 right-0 mx-auto text-center text-sm text-white/70">
          Tap anywhere to close
        </div>
      )}
    </>
  );
};

export default StatusMessage;
