import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import FullscreenMapView from './FullscreenMapView';
import SearchBox from './components/SearchBox';
import MapControls from './components/MapControls';
import MapMarkers from './components/MapMarkers';
import LocationInfoWindow from './components/LocationInfoWindow';
import { mapStyles } from './utils/mapStyles';
import { useUserLocation, useNearbySearch, useStreetView, useGunLocations } from './utils/mapHooks';
import { getPlaceType } from './utils/markerUtils';
import { 
  mapContainerStyle, 
  defaultCenter, 
  GOOGLE_MAPS_API_KEY, 
  googleMapsLibraries,
  GunLocation, 
  PlaceResult,
  MapContainerProps 
} from './types';

export default function MapContainer({ apiKey, onOpenPantoneView, initialCenter }: MapContainerProps) {
  const [selectedLocation, setSelectedLocation] = useState<GunLocation | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10000); // 10km default for better coverage
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showRadiusControl, setShowRadiusControl] = useState<boolean>(false);
  const [showMapTypeControl, setShowMapTypeControl] = useState<boolean>(false);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [initialSearchDone, setInitialSearchDone] = useState<boolean>(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState<boolean>(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const mapRef = useRef<google.maps.Map | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const streetViewServiceRef = useRef<google.maps.StreetViewService | null>(null);
  
  const { userPosition, getUserLocation, setUserPosition } = useUserLocation();
  const { placeResults, isSearching, setPlaceResults, searchNearbyGunPlaces } = useNearbySearch(placesServiceRef, searchRadius);
  const { streetViewAvailable, setStreetViewAvailable, checkStreetViewAvailability, initializeStreetView } = useStreetView();
  const gunLocations = useGunLocations();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries
  });

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      
      if (mapRef.current) {
        mapRef.current.panTo(position);
        mapRef.current.setZoom(11);
      }
      
      searchNearbyGunPlaces(position);
      
      toast({
        title: "Searching new location",
        description: "Looking for firearms-related businesses in the selected area."
      });
    }
  }, [searchNearbyGunPlaces, toast]);

  const handleMapTypeChange = (type: string) => {
    setMapType(type);
    if (mapRef.current) {
      mapRef.current.setMapTypeId(type);
    }
    setShowMapTypeControl(false);
  };

  const handleGetUserLocation = useCallback(() => {
    getUserLocation((pos) => {
      if (mapRef.current) {
        mapRef.current.panTo(pos);
        mapRef.current.setZoom(11);
      }
      searchNearbyGunPlaces(pos);
    });
  }, [getUserLocation, searchNearbyGunPlaces]);

  const handleUseProfileLocation = useCallback(() => {
    if (initialCenter) {
      if (mapRef.current) {
        mapRef.current.panTo(initialCenter);
        mapRef.current.setZoom(11);
      }
      searchNearbyGunPlaces(initialCenter);
      
      toast({
        title: "Using profile location",
        description: "Searching for firearms-related businesses near your profile location."
      });
    }
  }, [initialCenter, searchNearbyGunPlaces, toast]);

  const handleMarkerClick = useCallback((location: GunLocation) => {
    setSelectedLocation(location);
    checkStreetViewAvailability(location.position, streetViewServiceRef.current);
  }, [checkStreetViewAvailability]);

  const handlePlaceResultClick = useCallback((place: PlaceResult) => {
    const locationFromPlace: GunLocation = {
      id: place.id,
      name: place.name,
      type: getPlaceType(place.types),
      position: place.position,
      city: place.address,
      address: place.address
    };
    
    setSelectedLocation(locationFromPlace);
    checkStreetViewAvailability(place.position, streetViewServiceRef.current);
  }, [checkStreetViewAvailability]);

  const handleSearch = useCallback((position: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo(position);
      mapRef.current.setZoom(12);
    }
    
    setPlaceResults([]);
    searchNearbyGunPlaces(position);
  }, [searchNearbyGunPlaces, setPlaceResults]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    placesServiceRef.current = new google.maps.places.PlacesService(map);
    
    streetViewServiceRef.current = new google.maps.StreetViewService();
    
    setMapLoaded(true);
    
    map.setZoom(7);
    
    map.addListener("click", handleMapClick);
  }, [handleMapClick]);

  const onUnmount = useCallback(() => {
    if (mapRef.current) {
      google.maps.event.clearListeners(mapRef.current, "click");
    }
    
    mapRef.current = null;
    placesServiceRef.current = null;
    streetViewServiceRef.current = null;
    setMapLoaded(false);
  }, []);

  useEffect(() => {
    if (mapLoaded && !userPosition && !initialSearchDone) {
      const timer = setTimeout(() => {
        const center = initialCenter || defaultCenter;
        searchNearbyGunPlaces(center);
        setInitialSearchDone(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mapLoaded, searchNearbyGunPlaces, userPosition, initialSearchDone, initialCenter]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-card shadow-subtle h-full">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Error Loading Google Maps</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          There was an error loading Google Maps. Please try again later.
        </p>
        <p className="text-sm text-muted-foreground mb-6">Error: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-card shadow-subtle h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <SearchBox 
        onSearch={handleSearch}
        isLoaded={isLoaded}
      />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userPosition || initialCenter || defaultCenter}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: !isMobile,
          scaleControl: !isMobile,
          rotateControl: false,
          clickableIcons: false
        }}
      >
        <MapMarkers 
          gunLocations={gunLocations}
          placeResults={placeResults}
          userPosition={userPosition}
          onGunLocationClick={handleMarkerClick}
          onPlaceResultClick={handlePlaceResultClick}
        />

        {selectedLocation && (
          <LocationInfoWindow 
            selectedLocation={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            streetViewAvailable={streetViewAvailable}
            initializeStreetView={initializeStreetView}
            onShowFullscreenMap={() => setShowFullscreenMap(true)}
          />
        )}
      </GoogleMap>

      <MapControls
        onMapTypeChange={handleMapTypeChange}
        onGetUserLocation={handleGetUserLocation}
        onUseProfileLocation={handleUseProfileLocation}
        onToggleRadiusControl={() => setShowRadiusControl(!showRadiusControl)}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showRadiusControl={showRadiusControl}
        showLegend={showLegend}
        showMapTypeControl={showMapTypeControl}
        onToggleMapTypeControl={() => setShowMapTypeControl(!showMapTypeControl)}
        mapType={mapType}
        searchRadius={searchRadius}
        onSearchRadiusChange={setSearchRadius}
        hasProfileLocation={!!initialCenter}
      />

      {isSearching && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border border-primary/30 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-3 text-primary" />
          <span className="text-sm font-medium">Searching for firearms locations...</span>
        </div>
      )}

      <FullscreenMapView
        isOpen={showFullscreenMap}
        onClose={() => setShowFullscreenMap(false)}
        selectedLocation={selectedLocation}
        mapStyles={mapStyles}
      />

      <style>{`
        .gm-style-cc {
          display: none !important;
        }
        .gmnoprint.gm-style-cc {
          display: none !important;
        }
        a[href^="https://maps.google.com/maps"] {
          display: none !important;
        }
        .gm-style-iw {
          padding: 0 !important;
        }
        .gm-style-iw-d {
          overflow: hidden !important;
          max-height: none !important;
        }
        .gm-style-iw-c {
          padding: 0 !important;
          max-width: none !important;
          max-height: none !important;
          box-shadow: none !important;
          background: transparent !important;
          border-radius: 8px !important;
          overflow: visible !important;
        }
        .gm-ui-hover-effect {
          background: rgba(0,0,0,0.5) !important;
          border-radius: 50% !important;
          opacity: 0.8 !important;
          right: 0px !important;
          top: 0px !important;
          margin: 5px !important;
        }
        .gm-ui-hover-effect img {
          width: 18px !important;
          height: 18px !important;
        }
        /* Force consistent panorama dimensions */
        .gm-style-pbc, .gm-style-pbd {
          width: 100% !important;
          height: 100% !important;
        }
        /* Ensure Street View maintains aspect ratio */
        .gm-style iframe, .gm-style div[role="img"] {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 16/9 !important;
        }
      `}</style>
    </div>
  );
}
