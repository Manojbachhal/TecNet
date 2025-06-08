
import { useState, useCallback, MutableRefObject } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlaceResult } from '../../types';
import { getPlaceType } from '../markerUtils';

export const useNearbySearch = (
  placesServiceRef: MutableRefObject<google.maps.places.PlacesService | null>,
  searchRadius: number
) => {
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { toast } = useToast();
  
  const searchNearbyGunPlaces = useCallback((center: google.maps.LatLngLiteral) => {
    if (!placesServiceRef.current) return;
    
    setIsSearching(true);
    
    const keywords = [
      'gun range', 
      'shooting range', 
      'firearms dealer', 
      'gun shop', 
      'ammunition store',
      'gunsmith',
      'firearms training',
      'gun store',
      'shooting sports',
      'tactical supply',
      'gun club'
    ];
    
    const searchPromises = keywords.map(keyword => {
      return new Promise<PlaceResult[]>((resolve) => {
        const request = {
          location: new google.maps.LatLng(center.lat, center.lng),
          radius: searchRadius,
          keyword: keyword,
          type: 'establishment'
        };
        
        placesServiceRef.current?.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const placeResults = results.map(place => ({
              id: place.place_id || `temp-${Math.random().toString(36).substr(2, 9)}`,
              name: place.name || 'Unnamed Location',
              position: {
                lat: place.geometry?.location?.lat() || center.lat,
                lng: place.geometry?.location?.lng() || center.lng
              },
              address: place.vicinity || '',
              types: place.types || []
            }));
            resolve(placeResults);
          } else {
            resolve([]);
          }
        });
      });
    });
    
    Promise.all(searchPromises)
      .then(resultsArrays => {
        const allResults = resultsArrays.flat();
        
        const uniqueResults = allResults.filter((place, index, self) => 
          index === self.findIndex(p => p.id === place.id)
        );
        
        const relevantResults = uniqueResults.filter(place => {
          const nameLower = place.name.toLowerCase();
          return (
            nameLower.includes('gun') ||
            nameLower.includes('shoot') ||
            nameLower.includes('ammo') ||
            nameLower.includes('arms') ||
            nameLower.includes('tactical') ||
            nameLower.includes('firearm') ||
            nameLower.includes('range') ||
            nameLower.includes('hunter') ||
            nameLower.includes('sportsman') ||
            nameLower.includes('outdoor') ||
            nameLower.includes('pawn')
          );
        });
        
        setPlaceResults(relevantResults);
        setIsSearching(false);
        
        if (relevantResults.length > 0) {
          toast({
            title: `${relevantResults.length} Firearms Locations Found`,
            description: "Showing firearms-related locations near the searched area.",
            variant: "default"
          });
        } else {
          toast({
            title: "No Firearms Locations Found",
            description: "Try adjusting your search or radius.",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        console.error("Search error:", error);
        setIsSearching(false);
      });
  }, [toast, searchRadius, placesServiceRef]);
  
  return { placeResults, isSearching, setPlaceResults, searchNearbyGunPlaces };
};
