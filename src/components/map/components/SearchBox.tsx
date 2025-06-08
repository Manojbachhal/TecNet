
import React, { useRef, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBoxProps {
  onSearch: (position: google.maps.LatLngLiteral) => void;
  isLoaded: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoaded }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchExpanded, setSearchExpanded] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const isMobile = useIsMobile();

  // Initialize the SearchBox with the input reference
  const initializeSearchBox = () => {
    if (!isLoaded || !searchInputRef.current) return;
    
    const searchBox = new google.maps.places.SearchBox(searchInputRef.current);
    searchBoxRef.current = searchBox;
    
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      
      if (places && places.length > 0) {
        const place = places[0];
        
        if (place.geometry && place.geometry.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          onSearch(position);
        }
      }
    });
    
    return () => {
      if (searchBox) {
        google.maps.event.clearInstanceListeners(searchBox);
      }
      searchBoxRef.current = null;
    };
  };

  // Effect to initialize the SearchBox once the map is loaded
  useEffect(() => {
    if (isLoaded && searchInputRef.current) {
      const cleanup = initializeSearchBox();
      return cleanup;
    }
  }, [isLoaded]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    if (searchBoxRef.current) {
      const searchBox = document.getElementById('pac-input') as HTMLInputElement;
      if (searchBox) {
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        searchBox.dispatchEvent(enterEvent);
      }
    }
    
    if (isMobile) {
      setSearchExpanded(false);
    }
  };

  return (
    <>
      {isMobile && !searchExpanded && (
        <div className="absolute top-4 left-4 z-20">
          <button
            className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
            onClick={() => setSearchExpanded(true)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      )}

      {(!isMobile || searchExpanded) && (
        <div className={`absolute z-20 transition-all duration-300 ${
          isMobile 
            ? "top-4 left-4 right-4" 
            : "top-4 left-0 right-0 mx-auto px-4 max-w-2xl"
        }`}>
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-background/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-primary/30 neon-glow"
          >
            {isMobile && (
              <button 
                type="button"
                className="p-3 text-primary"
                onClick={() => setSearchExpanded(false)}
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <input
              id="pac-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search for shooting ranges, gun shops..."
              className="w-full px-4 py-3 outline-none bg-transparent text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-3 text-primary hover:text-primary/80 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SearchBox;
