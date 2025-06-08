
import { useState } from 'react';
import { ListingItem } from '@/components/trading/types/tradingTypes';
import { ReportData } from '@/components/trading/ReportListingDialog';
import { useTradingData } from '@/hooks/trading/useTradingData';
import { useTradingRealtime } from '@/hooks/trading/useTradingRealtime';
import { useListingActions } from '@/hooks/trading/useListingActions';

export const useTradingListings = () => {
  // Get core listing data and loading state
  const { listings, setListings, isLoading } = useTradingData();
  
  // Setup real-time subscriptions for listings
  useTradingRealtime({ setListings });
  
  // Get listing action handlers
  const { toggleFavorite, reportListing } = useListingActions(listings, setListings);

  return {
    listings,
    isLoading,
    toggleFavorite,
    reportListing,
    setListings
  };
};
