import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import TradingHeader from "@/components/trading/TradingHeader";
import TradingTabs from "@/components/trading/TradingTabs";
import TradingFilters from "@/components/trading/TradingFilters";
import TradingContent from "@/components/trading/TradingContent";
import TradingGuidelines from "@/components/trading/TradingGuidelines";
import MessageDialog from "@/components/messaging/MessageDialog";
import { useTradingPage } from "@/hooks/trading/useTradingPage";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreateListingDialog from "@/components/trading/CreateListingDialog";
import { useInventoryIntegration } from "@/hooks/trading/useInventoryIntegration";
import { useAuth } from "@/contexts/AuthContext";

const Trading = () => {
  const { session } = useAuth();
  const { userFirearms, initialFirearm } = useInventoryIntegration(session);
  
  const {
    isLoading,
    listings,
    filteredListings,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    activeTab,
    setActiveTab,
    sessionUsername,
    contactItem,
    setContactItem,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    handleCreateListing,
    handleSaveListing,
    handleContactSeller,
    handleToggleFavorite,
    handleEditListing,
    handleDeleteListing,
    handleReportListing,
    handleSold,
    refetchListings,
  } = useTradingPage();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.action === "createListing") {
      setIsCreateDialogOpen(true);
    }
  }, [location.state, setIsCreateDialogOpen]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <TradingHeader onCreateListing={handleCreateListing} />
        <TradingTabs activeTab={activeTab} onTabChange={setActiveTab} listings={listings} />
        <TradingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <TradingContent
          filteredListings={filteredListings}
          isLoading={isLoading}
          searchTerm={searchTerm}
          priceRange={priceRange}
          activeTab={activeTab}
          sessionUsername={sessionUsername}
          onContact={handleContactSeller}
          onToggleFavorite={handleToggleFavorite}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
          onReport={handleReportListing}
          onSold={handleSold}
          onClearFilters={() => {
            setSearchTerm("");
            setPriceRange("all");
          }}
        />
        <TradingGuidelines />
      </div>

      <MessageDialog
        isOpen={!!contactItem}
        onClose={() => setContactItem(null)}
        recipientId={contactItem?.owner_id}
        contextType="trading"
        contextId={contactItem?.id}
      />

      <CreateListingDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveListing}
        userFirearms={userFirearms}
        initialFirearm={initialFirearm}
      />
    </>
  );
};

export default Trading;
