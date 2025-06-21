import { useState, useEffect } from 'react';
import { FirearmItem } from '../InventoryItem';
import { useImageUploadService } from './ImageUploadService';
import { useToast } from '@/hooks/use-toast';
import { generateUUID } from '@/lib/utils';

const defaultItem: FirearmItem = {
  id: '',
  make: '',
  model: '',
  caliber: '',
  serialNumber: '',
  condition: 'Good',
  purchaseDate: new Date().toISOString().split('T')[0],
  value: 0,
  notes: '',
  image: '',
  image_url: ''
};

export const useInventoryForm = (isOpen: boolean, editItem: FirearmItem | null, onSave: (item: FirearmItem) => void) => {
  const [formData, setFormData] = useState<FirearmItem>(defaultItem);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImageToStorage } = useImageUploadService();
  const { toast } = useToast();
  
  // Update form data when edit item changes or when the form is opened
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        console.log('Editing item:', editItem);
        // Ensure purchaseDate is not in the future
        const purchaseDate = editItem.purchaseDate || new Date().toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        const validPurchaseDate = purchaseDate > today ? today : purchaseDate;
        
        setFormData({
          ...editItem,
          purchaseDate: validPurchaseDate
        });
        setImageFile(null);
      } else {
        // For new items, generate a UUID immediately
        console.log('Creating new item with fresh UUID');
        setFormData({
          ...defaultItem,
          id: generateUUID()
        });
        setImageFile(null);
      }
    }
  }, [editItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Handle empty input or valid number (including decimals)
    if (inputValue === '' || !isNaN(parseFloat(inputValue))) {
      setFormData(prev => ({ 
        ...prev, 
        value: inputValue === '' ? 0 : parseFloat(inputValue)
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
        setImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.serialNumber) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to save items.",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure we have a valid ID for new items
    if (!formData.id) {
      console.log('No ID found, generating new UUID');
      formData.id = generateUUID();
    }
    
    console.log('Submitting form with data:', formData);
    
    let finalItem = { ...formData };
    
    if (imageFile) {
      setIsUploading(true);
      const uploadedImageUrl = await uploadImageToStorage(imageFile, formData.id, userId);
      setIsUploading(false);
      
      if (uploadedImageUrl) {
        finalItem.image_url = uploadedImageUrl;
        finalItem.image = uploadedImageUrl;  // For backward compatibility
      }
    }
    
    // Add explicit console log for debugging
    console.log('Saving firearm with final data:', {
      ...finalItem,
      userId
    });
    
    // Call the save function provided by the parent component
    onSave(finalItem);
  };

  return {
    formData,
    isUploading,
    handleChange,
    handleSelectChange,
    handleValueChange,
    handleImageChange,
    handleSubmit
  };
};
