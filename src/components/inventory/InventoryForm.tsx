
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FirearmItem } from './InventoryItem';
import { useAuth } from '@/contexts/AuthContext';
import { useInventoryForm } from './form/useInventoryForm';
import BasicDetails from './form/BasicDetails';
import AdditionalDetails from './form/AdditionalDetails';
import ImageUpload from './form/ImageUpload';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FirearmItem) => void;
  editItem?: FirearmItem | null;
}

export default function InventoryForm({ isOpen, onClose, onSave, editItem }: InventoryFormProps) {
  const { user } = useAuth();
  const {
    formData,
    isUploading,
    handleChange,
    handleSelectChange,
    handleValueChange,
    handleImageChange,
    handleSubmit
  } = useInventoryForm(isOpen, editItem, onSave);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={(e) => handleSubmit(e, user?.id || '')}>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Firearm' : 'Add New Firearm'}</DialogTitle>
            <DialogDescription>
              {editItem ? 'Update the details of your firearm.' : 'Add a new firearm to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <BasicDetails
              make={formData.make}
              model={formData.model}
              caliber={formData.caliber}
              serialNumber={formData.serialNumber}
              onChange={handleChange}
            />
            
            <AdditionalDetails
              condition={formData.condition}
              purchaseDate={formData.purchaseDate}
              value={formData.value}
              notes={formData.notes || ''}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              onValueChange={handleValueChange}
            />
            
            <ImageUpload
              imageUrl={formData.image}
              onImageChange={handleImageChange}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : (editItem ? 'Update' : 'Add')} Firearm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
