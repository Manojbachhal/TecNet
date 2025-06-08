
import React from 'react';
import { Map } from 'lucide-react';

interface MapMessageProps {
  message: string;
  className?: string;
}

const MapMessage: React.FC<MapMessageProps> = ({ message, className = "" }) => {
  return (
    <div className={`w-full max-w-md mx-auto mb-4 ${className}`}>
      <div className="flex items-center bg-[#6E59A5] text-white px-4 py-2 rounded-lg shadow-lg">
        <Map className="w-5 h-5 mr-3 text-white" />
        <span className="text-sm font-medium flex-grow">
          {message}
        </span>
      </div>
    </div>
  );
};

export default MapMessage;
