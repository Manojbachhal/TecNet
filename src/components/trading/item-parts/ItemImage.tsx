
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield } from "lucide-react";
import { getReliableFallbackImage, getFirstValidImage, normalizeImages } from '../utils/imageUtils';

interface ItemImageProps {
  title: string;
  price: number;
  images: string[];
  favorite?: boolean;
  isOwner: boolean;
  onToggleFavorite: () => void;
  onReport: () => void;
}

export default function ItemImage({ 
  title, 
  price, 
  images, 
  favorite, 
  isOwner, 
  onToggleFavorite, 
  onReport 
}: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Reset error state and determine the best image URL when props change
  useEffect(() => {
    setImageError(false);
    const normalizedImages = normalizeImages(images);
    
    // Use the first valid image or fallback to type-specific image
    if (normalizedImages.length > 0) {
      setImageUrl(normalizedImages[0]);
    } else {
      setImageUrl(getReliableFallbackImage(title));
    }
  }, [images, title]);

  const handleImageError = () => {
    console.log("Image failed to load, using fallback:", imageUrl);
    setImageError(true);
    setImageUrl(getReliableFallbackImage(title));
  };
  
  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={imageError ? getReliableFallbackImage(title) : imageUrl} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={handleImageError}
      />
      <div className="absolute top-2 right-2 flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`backdrop-blur-sm bg-background/40 border border-background/10 ${
            favorite ? 'text-destructive' : 'text-muted-foreground'
          }`}
          onClick={onToggleFavorite}
          title="Add to favorites"
        >
          <Heart className={`h-5 w-5 ${favorite ? 'fill-destructive' : ''}`} />
        </Button>
        
        {!isOwner && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="backdrop-blur-sm bg-background/40 border border-background/10 text-muted-foreground"
            onClick={onReport}
            title="Report listing"
          >
            <Shield className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <Badge className="text-lg font-bold bg-primary">${price.toLocaleString()}</Badge>
      </div>
    </div>
  );
}
