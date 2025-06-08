
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  imageUrl: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Image must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }

    onImageChange(e);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image</Label>
      <Input 
        id="image" 
        name="image" 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      {imageUrl && (
        <div className="mt-2 relative h-40 w-full rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Firearm preview" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
