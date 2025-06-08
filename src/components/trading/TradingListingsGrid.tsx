
import React from 'react';
import TradingItem from './TradingItem';
import { ListingItem } from './types/tradingTypes';
import { ReportData } from './ReportListingDialog';

interface TradingListingsGridProps {
  listings: ListingItem[];
  onContact: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onReport: (reportData: ReportData) => void;
  sessionUsername?: string | null;
}

const TradingListingsGrid = ({ 
  listings, 
  onContact, 
  onToggleFavorite, 
  onEdit, 
  onDelete,
  onReport,
  sessionUsername
}: TradingListingsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {listings.map((item) => (
        <TradingItem 
          key={item.id}
          item={item}
          onContact={onContact}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
          isOwner={sessionUsername && item.sellerName === sessionUsername}
        />
      ))}
    </div>
  );
};

export default TradingListingsGrid;
