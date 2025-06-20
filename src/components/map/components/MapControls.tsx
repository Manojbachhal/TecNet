import React, { useState } from 'react';
import { Layers, Target, Sliders, Info, X, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MapControlsProps {
  onMapTypeChange: (type: string) => void;
  onGetUserLocation: () => void;
  onUseProfileLocation: () => void;
  onToggleRadiusControl: () => void;
  onToggleLegend: () => void;
  showRadiusControl: boolean;
  showLegend: boolean;
  showMapTypeControl: boolean;
  onToggleMapTypeControl: () => void;
  mapType: string;
  searchRadius: number;
  onSearchRadiusChange: (radius: number) => void;
  hasProfileLocation: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  onMapTypeChange,
  onGetUserLocation,
  onUseProfileLocation,
  onToggleRadiusControl,
  onToggleLegend,
  showRadiusControl,
  showLegend,
  showMapTypeControl,
  onToggleMapTypeControl,
  mapType,
  searchRadius,
  onSearchRadiusChange,
  hasProfileLocation
}) => {
  return (
    <>
      {/* Map Type Control */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 neon-glow"
          onClick={onToggleMapTypeControl}
          aria-label="Map layers"
          title="Map layers"
        >
          <Layers className="h-5 w-5" />
        </button>
        
        {showMapTypeControl && (
          <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-primary/30 cyberpunk-border w-36">
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${mapType === 'roadmap' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-primary/10'}`}
              onClick={() => onMapTypeChange('roadmap')}
            >
              Standard
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${mapType === 'satellite' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-primary/10'}`}
              onClick={() => onMapTypeChange('satellite')}
            >
              Satellite
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${mapType === 'hybrid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-primary/10'}`}
              onClick={() => onMapTypeChange('hybrid')}
            >
              Hybrid
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${mapType === 'terrain' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-primary/10'}`}
              onClick={() => onMapTypeChange('terrain')}
            >
              Terrain
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start space-y-3">
        <button
          className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background neon-glow"
          onClick={onGetUserLocation}
          aria-label="Find my location"
          title="Find my location"
        >
          <Target className="h-5 w-5" />
        </button>

        {hasProfileLocation && (
          <button
            className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background neon-glow"
            onClick={onUseProfileLocation}
            aria-label="Use profile location"
            title="Use profile location"
          >
            <MapPin className="h-5 w-5" />
          </button>
        )}

        {/* Radius Control - Now using Popover */}
        <Popover open={showRadiusControl} onOpenChange={onToggleRadiusControl}>
          <PopoverTrigger asChild>
            <button
              className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background neon-glow"
              aria-label="Search radius settings"
              title="Search radius settings"
            >
              <Sliders className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Search Radius</h3>
                <button 
                  onClick={() => onToggleRadiusControl()}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close radius settings"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <select 
                className="w-full text-sm bg-background border border-primary/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchRadius}
                onChange={(e) => onSearchRadiusChange(Number(e.target.value))}
              >
                <option value="1000">1 km</option>
                <option value="5000">5 km</option>
                <option value="10000">10 km</option>
                <option value="25000">25 km</option>
                <option value="50000">50 km</option>
              </select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Legend Panel - Now using Popover */}
        <Popover open={showLegend} onOpenChange={onToggleLegend}>
          <PopoverTrigger asChild>
            <button
              className="p-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background neon-glow"
              aria-label="Show legend"
              title="Show legend"
            >
              <Info className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Location Types</h3>
                <button 
                  onClick={() => onToggleLegend()}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close legend"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ff4d4d] mr-2"></div>
                  <span>Shooting Ranges</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4d94ff] mr-2"></div>
                  <span>Gun Shops</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ffa64d] mr-2"></div>
                  <span>Gunsmiths</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#4dff88] mr-2"></div>
                  <span>Training Facilities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#cb4dff] mr-2"></div>
                  <span>Firearms Museums</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ffcc4d] mr-2"></div>
                  <span>Clay/Skeet Venues</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MapControls;
