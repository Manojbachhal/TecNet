
import React, { useEffect } from 'react';
import { Marker } from '@react-google-maps/api';
import { GunLocation, PlaceResult } from '../types';
import { getMarkerIcon, getPlaceType } from '../utils/markerUtils';

interface MapMarkersProps {
  gunLocations: GunLocation[];
  placeResults: PlaceResult[];
  userPosition: google.maps.LatLngLiteral | null;
  onGunLocationClick: (location: GunLocation) => void;
  onPlaceResultClick: (place: PlaceResult) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  gunLocations,
  placeResults,
  userPosition,
  onGunLocationClick,
  onPlaceResultClick
}) => {
  // Log all place results and their detected types on render
  useEffect(() => {
    if (placeResults.length > 0) {
      console.log(`Rendering ${placeResults.length} place results with types:`);
      placeResults.forEach(place => {
        const detectedType = getPlaceType(place.types);
        console.log(`${place.name}: ${detectedType} (from types: ${JSON.stringify(place.types)})`);
      });
    }
  }, [placeResults]);

  return (
    <>
      {userPosition && (
        <Marker
          position={userPosition}
          icon={{
            url: `data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <defs>
                  <radialGradient id="gradPulse" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <animate attributeName="r" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
                    <stop offset="0%" stop-color="#9c27b0" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#9c27b0" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="24" cy="24" r="24" fill="url(#gradPulse)">
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="24" cy="24" r="12" fill="#9c27b0" opacity="0.3">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="24" cy="24" r="6" fill="#9c27b0" stroke="white" stroke-width="2"/>
              </svg>
            `)}`
          }}
          title="Your Location"
        />
      )}

      {gunLocations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
          icon={getMarkerIcon(location.type)}
          onClick={() => onGunLocationClick(location)}
          animation={google.maps.Animation.DROP}
        />
      ))}

      {placeResults.map((place) => {
        // Explicitly determine the type for this place and log it
        const placeType = getPlaceType(place.types);
        
        return (
          <Marker
            key={place.id}
            position={place.position}
            icon={getMarkerIcon(placeType)}
            onClick={() => onPlaceResultClick({
              ...place,
              // Ensure the placeType is passed to the onClick handler
              types: place.types
            })}
            animation={google.maps.Animation.DROP}
          />
        );
      })}
    </>
  );
};

export default MapMarkers;
