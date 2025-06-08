
import React from 'react';
import AnalysisDialog from '../AnalysisDialog';
import { ListingItem } from '../types/tradingTypes';

interface AnalysisDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ListingItem | null;
}

export default function AnalysisDialogWrapper({ isOpen, onOpenChange, item }: AnalysisDialogWrapperProps) {
  if (!item) return null;
  
  return (
    <AnalysisDialog 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      item={item}
    />
  );
}
