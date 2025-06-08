
import React, { useState } from 'react';
import MapContainer from '@/components/map/MapContainer';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/map/components/PageHeader';
import InfoPanel from '@/components/map/components/InfoPanel';
import MapMessage from '@/components/map/components/MapMessage';
import Footer from '@/components/map/components/Footer';
import PantoneView from '@/components/map/PantoneView';

const RangeFinder = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showPantoneView, setShowPantoneView] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");
  
  const handleOpenPantoneView = (locationName: string) => {
    setSelectedLocationName(locationName);
    setShowPantoneView(true);
  };
  
  const toggleInfo = () => setShowInfo(!showInfo);
  const closeInfo = () => setShowInfo(false);
  
  return (
    <div className="h-full flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 relative z-10 h-full flex flex-col pt-24">
        <PageHeader showInfo={showInfo} toggleInfo={toggleInfo} />
        
        <MapMessage message="Click anywhere on the map to search that location" />
        
        <InfoPanel isVisible={showInfo} onClose={closeInfo} />
        
        <div className="flex-grow rounded-xl overflow-hidden shadow-xl relative border border-primary/30 cyberpunk-border" style={{ height: "calc(100vh - 250px)" }}>
          <MapContainer />
        </div>
      </div>
      
      <Footer />
      
      <PantoneView 
        isOpen={showPantoneView} 
        onClose={() => setShowPantoneView(false)}
        locationName={selectedLocationName}
      />
    </div>
  );
};

export default RangeFinder;
