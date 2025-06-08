
import React from 'react';

interface LocationHeaderProps {
  name: string;
  address?: string;
  city: string;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({ name, address, city }) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-background/80 backdrop-blur-sm py-2 px-4 rounded-lg border border-primary/20 shadow-lg">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground">
          {address || city}
        </p>
      </div>
    </div>
  );
};

export default LocationHeader;
