
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import MessageDialog from '@/components/trading/MessageDialog';
import CreateListingDialog from '@/components/trading/CreateListingDialog';
import TradingFilters from '@/components/trading/TradingFilters';
import TradingGuidelines from '@/components/trading/TradingGuidelines';
import TradingHeader from '@/components/trading/TradingHeader';
import TradingTabs from '@/components/trading/TradingTabs';
import TradingContent from '@/components/trading/TradingContent';
import { useTradingPage } from '@/hooks/trading/useTradingPage';
import { useLocation } from 'react-router-dom';

const Trading = () => {
  const location = useLocation();
  
  const {
    listings,
    filteredListings,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    activeTab,
    setActiveTab,
    contactItem,
    setContactItem,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    editItem,
    userFirearms,
    initialFirearm,
    setInitialFirearm,
    sessionUsername,
    handleContactSeller,
    handleToggleFavorite,
    handleEditListing,
    handleCreateListing,
    handleSaveListing,
    handleDeleteListing,
    handleReportListing,
  } = useTradingPage();
  
  // Effect to automatically open create dialog when coming from inventory with an item
  useEffect(() => {
    if (location.state?.listItem && location.state?.action === 'createListing') {
      // This will be handled by useInventoryIntegration hook
      setIsCreateDialogOpen(true);
    }
  }, [location.state, setIsCreateDialogOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 pt-24"> {/* Added pt-24 to ensure content is below navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TradingHeader onCreateListing={handleCreateListing} />
          
          <TradingTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            listings={listings}
          />
          
          <TradingFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          
          <TradingContent 
            isLoading={isLoading}
            filteredListings={filteredListings}
            searchTerm={searchTerm}
            priceRange={priceRange}
            activeTab={activeTab}
            sessionUsername={sessionUsername}
            onContact={handleContactSeller}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleEditListing}
            onDelete={handleDeleteListing}
            onReport={handleReportListing}
            onClearFilters={() => {
              setSearchTerm('');
              setPriceRange('all');
            }}
          />
          
          <TradingGuidelines />
        </motion.div>
      </main>
      
      <MessageDialog 
        isOpen={!!contactItem}
        onClose={() => setContactItem(null)}
        item={contactItem}
      />
      
      <CreateListingDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setInitialFirearm(null);
        }}
        onSave={handleSaveListing}
        editItem={editItem}
        userFirearms={userFirearms}
        initialFirearm={initialFirearm}
      />
    </div>
  );
};

export default Trading;
