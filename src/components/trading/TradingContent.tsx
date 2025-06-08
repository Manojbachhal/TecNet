
import React from 'react';
import TradingListingsGrid from './TradingListingsGrid';
import NoListingsFound from './NoListingsFound';
import { ListingItem } from './types/tradingTypes';
import { ReportData } from './ReportListingDialog';

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
  onDelete,
  onReport,
  onClearFilters,
}: TradingContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredListings.length === 0) {
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
      listings={filteredListings}
      onContact={onContact}
      onToggleFavorite={onToggleFavorite}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
      sessionUsername={sessionUsername}
    />
  );
};

export default TradingContent;
