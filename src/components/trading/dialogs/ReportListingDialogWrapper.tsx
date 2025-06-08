
import React from 'react';
import ReportListingDialog, { ReportData } from '../ReportListingDialog';
import { ListingItem } from '../types/tradingTypes';

interface ReportListingDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reportData: ReportData) => void;
  item: ListingItem | null;
}

export default function ReportListingDialogWrapper({ 
  isOpen, 
  onOpenChange,
  onSubmit,
  item
}: ReportListingDialogWrapperProps) {
  if (!item) return null;
  
  return (
    <ReportListingDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      item={item}
    />
  );
}
