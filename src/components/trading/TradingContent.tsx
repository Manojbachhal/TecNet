import React, { useEffect, useState } from "react";
import TradingListingsGrid from "./TradingListingsGrid";
import NoListingsFound from "./NoListingsFound";
import { ListingItem } from "./types/tradingTypes";
import { ReportData } from "./ReportListingDialog";
import { supabase } from "@/integrations/supabase/client";

interface TradingContentProps {
  isLoading: boolean;
  filteredListings: ListingItem[];
  searchTerm: string;
  priceRange: string;
  activeTab: string;
  sessionUsername: string | null;
  onContact: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onSold: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onReport: (reportData: ReportData) => void;
  onClearFilters: () => void;
}

const TradingContent = ({
  isLoading,
  filteredListings,
  searchTerm,
  priceRange,
  activeTab,
  sessionUsername,
  onContact,
  onToggleFavorite,
  onEdit,
  onSold,
  onDelete,
  onReport,
  onClearFilters,
}: TradingContentProps) => {
  const [soldData, setSoldData] = useState([]);

  // useEffect(() => {
  //   console.log();
  //   const getSoldListing = async () => {
  //     if (activeTab == "sold") {
  //       console.log("first");
  //       const { data } = await supabase.from("trading_listings").select("*").eq("status", "sold");
  //       const filteredData = data.filter((ele) => ele.seller_name == sessionUsername);
  //       setSoldData(filteredData);
  //     }
  //   };
  //   getSoldListing();
  //   console.log(activeTab);
  // }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredListings.length === 0 && activeTab != "sold") {
    return (
      <NoListingsFound
        searchTerm={searchTerm}
        priceRange={priceRange}
        activeTab={activeTab}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <TradingListingsGrid
      // listings={activeTab == "sold" ? soldData : filteredListings}
      listings={filteredListings}
      onContact={onContact}
      activeTab={activeTab}
      onToggleFavorite={onToggleFavorite}
      onEdit={onEdit}
      onSold={onSold}
      onDelete={onDelete}
      onReport={onReport}
      sessionUsername={sessionUsername}
    />
  );
};

export default TradingContent;
