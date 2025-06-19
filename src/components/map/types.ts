import { Libraries } from "@react-google-maps/api";

export interface GunLocation {
  id: string;
  name: string;
  type: string;
  position: google.maps.LatLngLiteral;
  city: string;
  address?: string;
}

export interface PlaceResult {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string;
  types: string[];
}

export interface MapContainerProps {
  apiKey?: string;
  onOpenPantoneView?: (locationName: string) => void;
  initialCenter?: google.maps.LatLngLiteral | null;
}

export const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export const defaultCenter = {
  lat: 27.6648,
  lng: -81.5158
};

export const GOOGLE_MAPS_API_KEY = 'AIzaSyA7hW0nCQZilfCoqf_t-uvuI93ew49H7o0';

// Use a consistent libraries definition for all map components
export const googleMapsLibraries: Libraries = ['places'];
