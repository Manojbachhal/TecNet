
import React from 'react';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

interface DeleteConfirmDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
}

export default function DeleteConfirmDialogWrapper({ 
  isOpen, 
  onOpenChange, 
  onConfirm 
}: DeleteConfirmDialogWrapperProps) {
  return (
    <DeleteConfirmDialog 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
}
