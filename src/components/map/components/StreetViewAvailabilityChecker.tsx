
import { useEffect } from 'react';

interface StreetViewAvailabilityCheckerProps {
  position: google.maps.LatLngLiteral;
  onAvailabilityCheck: (isAvailable: boolean) => void;
}

const StreetViewAvailabilityChecker: React.FC<StreetViewAvailabilityCheckerProps> = ({
  position,
  onAvailabilityCheck
}) => {
  useEffect(() => {
    const streetViewService = new google.maps.StreetViewService();
    
    streetViewService.getPanorama(
      {
        location: position,
        radius: 50
      },
      (data, status) => {
        const isAvailable = status === google.maps.StreetViewStatus.OK;
        onAvailabilityCheck(isAvailable);
      }
    );
  }, [position, onAvailabilityCheck]);

  return null;
};

export default StreetViewAvailabilityChecker;
