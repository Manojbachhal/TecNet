
import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface UserLocationMapProps {
  location: {
    lat: number;
    lng: number;
    city?: string;
    region?: string;
    country?: string;
  };
}

// Define consistent libraries to match with other components
const googleMapsLibraries = ['places'] as any[];

const UserLocationMap: React.FC<UserLocationMapProps> = ({ location }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA7hW0nCQZilfCoqf_t-uvuI93ew49H7o0',
    libraries: googleMapsLibraries
  });

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive">Error loading map</p>
          <p className="text-sm text-muted-foreground">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%'
      }}
      center={location}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          }
        ]
      }}
    >
      <Marker
        position={location}
        icon={{
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="8" fill="#9333EA" stroke="white" stroke-width="1.5" />
              <circle cx="24" cy="24" r="16" fill="#9333EA" fill-opacity="0.3" stroke="#9333EA" stroke-width="1" stroke-opacity="0.5">
                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="24" cy="24" r="24" fill="#9333EA" fill-opacity="0.1" stroke="#9333EA" stroke-width="0.5" stroke-opacity="0.3">
                <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          `),
          scaledSize: new google.maps.Size(48, 48),
          anchor: new google.maps.Point(24, 24)
        }}
      />
    </GoogleMap>
  );
};

export default UserLocationMap;
