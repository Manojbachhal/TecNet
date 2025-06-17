import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { ListingItem } from './types/tradingTypes';
import { FirearmItem } from '@/components/inventory/InventoryItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listing: ListingItem, editingId?: string) => Promise<boolean>;
  editItem?: ListingItem | null;
  userFirearms: any[];
  initialFirearm?: FirearmItem | null;
}

const CreateListingDialog = ({ isOpen, onClose, onSave, editItem, userFirearms, initialFirearm }: CreateListingDialogProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedFirearm, setSelectedFirearm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  console.log('Rendering CreateListingDialog with initialFirearm:', initialFirearm);

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setPrice(editItem.price.toString());
      setDescription(editItem.description || '');
      setCondition(editItem.condition);
      setLocation(editItem.location);
      setImages(editItem.images || []);
      setSelectedFirearm(editItem.firearmId || '');
    } else {
      // Clear form for new listing
      setTitle('');
      setPrice('');
      setDescription('');
      setCondition('Excellent');
      setLocation('');
      setImages([]);
      setSelectedFirearm('');
    }
  }, [editItem, isOpen]);

  useEffect(() => {
    if (initialFirearm && isOpen) {
      console.log('Setting form data from initial firearm:', initialFirearm);
      
      // Set form values based on the firearm
      setTitle(`${initialFirearm.make} ${initialFirearm.model} - ${initialFirearm.caliber}`);
      setPrice(initialFirearm.value ? initialFirearm.value.toString() : '');
      setDescription(
        `${initialFirearm.make} ${initialFirearm.model} in ${initialFirearm.caliber} caliber.\n` +
        `Condition: ${initialFirearm.condition}\n` +
        (initialFirearm.notes ? `${initialFirearm.notes}` : '')
      );
      setCondition(initialFirearm.condition || 'Good');
      setSelectedFirearm(initialFirearm.id);
      
      // Set images if available - use image_url if available, fallback to image for compatibility
      if (initialFirearm.image_url) {
        setImages([initialFirearm.image_url]);
      } else if (initialFirearm.image) {
        setImages([initialFirearm.image]);
      }
      
      // Use user's current location if available, otherwise empty
      if (navigator.geolocation) {
        setLocation('');
      }
    }
  }, [initialFirearm, isOpen]);

  const handleSave = async () => {
    if (!title || !price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create or edit listings.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Ensure we have a firearm_id if we're creating from inventory
      const firearmId = initialFirearm?.id || selectedFirearm;
      
      // Only require firearm selection if we don't have an initialFirearm
      if (!firearmId && !initialFirearm) {
        toast({
          title: "Missing Firearm ID",
          description: "Please select a firearm from your inventory.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate image URL
      const imagesList = images.length > 0 && images[0] ? images : [initialFirearm?.image_url];
      
      // Create a more detailed description if we have firearm details
      let finalDescription = description;
      if (initialFirearm) {
        finalDescription = `${initialFirearm.make} ${initialFirearm.model} in ${initialFirearm.caliber} caliber.\n` +
          `Condition: ${initialFirearm.condition}\n` +
          (initialFirearm.notes ? `${initialFirearm.notes}\n\n` : '') +
          (description ? `Additional Details:\n${description}` : '');
      }
      
      const listing: ListingItem = {
        id: editItem?.id || '',
        title,
        price: parseFloat(price),
        location,
        condition,
        sellerName: session.user.email?.split('@')[0] || 'Anonymous',
        sellerRating: editItem?.sellerRating || 5,
        postedDate: editItem?.postedDate || 'Just now',
        images: imagesList,
        description: finalDescription,
        favorite: editItem?.favorite || false,
        firearmId: firearmId,
        isSold: false,
        owner_id: session.user.id
      };
      
      console.log('Creating listing with data:', listing);
      
      // Pass the editItem.id as editingId when editing
      const success = await onSave(listing, editItem?.id);
      
      if (success) {
        onClose();
        toast({
          title: editItem ? "Listing Updated" : "Listing Created",
          description: editItem ? "Your listing has been updated successfully." : "Your item has been listed for trade."
        });
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save listing. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSelectFirearm = (firearmId: string) => {
    // Find the selected firearm from userFirearms
    const firearm = userFirearms.find(f => f.id === firearmId);
    setSelectedFirearm(firearmId);
    
    if (firearm) {
      // Update form with firearm details
      setTitle(`${firearm.make} ${firearm.model} - ${firearm.caliber}`);
      setCondition(firearm.condition);
      setPrice(firearm.value?.toString() || '');
      setDescription(
        `${firearm.make} ${firearm.model} in ${firearm.caliber} caliber.\n` +
        `Condition: ${firearm.condition}\n` +
        (firearm.notes ? `${firearm.notes}` : '')
      );
      
      // Set image if available
      if (firearm.image_url) {
        setImages([firearm.image_url]);
      }
    }
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    
    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${session.user.id}/listings/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('firearm-images')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('firearm-images')
        .getPublicUrl(filePath);
      
      console.log("Image uploaded successfully, public URL:", publicUrl);  
      setImages([publicUrl]);
      
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully."
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      
      // If there's an error with Supabase upload, don't create a local blob as fallback
      // as this will cause issues when the component unmounts
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Listing' : 'Create New Listing'}</DialogTitle>
          <DialogDescription>
            {editItem 
              ? 'Update your listing details below.'
              : 'Fill out the form below to list your firearm for trade or sale.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {!editItem && userFirearms.length > 0 && !initialFirearm && (
            <div className="space-y-2">
              <Label htmlFor="firearm">Select from your inventory</Label>
              <Select value={selectedFirearm} onValueChange={handleSelectFirearm}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a firearm" />
                </SelectTrigger>
                <SelectContent>
                  {userFirearms.map(firearm => (
                    <SelectItem key={firearm.id} value={firearm.id}>
                      {firearm.make} {firearm.model} - {firearm.caliber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g., Sig Sauer P365 XL - Like New"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input 
              id="price" 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="e.g., 599"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g., Austin, TX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={5}
              placeholder="Provide details about your firearm, including condition, accessories, and any other relevant information."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            
            {isUploading && (
              <div className="mt-2 text-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </div>
            )}
            
            {images.length > 0 && !isUploading && (
              <div className="mt-2">
                <div className="aspect-video rounded-md overflow-hidden bg-muted">
                  <img 
                    src={images[0]} 
                    alt="Listing preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {editItem ? 'Update Listing' : 'Create Listing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListingDialog;
