
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Target, Info, ShoppingCart } from "lucide-react";
import { getBallisticDefaults } from '@/components/ballistics/utils/ballisticsMappings';
import { useToast } from '@/hooks/use-toast';

export interface FirearmItem {
  id: string;
  make: string;
  model: string;
  caliber: string;
  serialNumber: string;
  condition: string;
  purchaseDate?: string;
  value: number;
  notes?: string;
  image?: string;
  image_url?: string;  // Add the image_url property
}

interface InventoryItemProps {
  item: FirearmItem;
  onEdit: (item: FirearmItem) => void;
  onDelete: (id: string) => void;
  onListForTrading?: (item: FirearmItem) => void;
}

export default function InventoryItem({ item, onEdit, onDelete, onListForTrading }: InventoryItemProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Generate fallback image path based on the type of firearm
  const getFallbackImage = () => {
    const model = item.model.toLowerCase();
    if (model.includes('pistol') || model.includes('handgun') || model.includes('revolver')) {
      return '/firearms/default-handgun.jpg';
    } else if (model.includes('shotgun')) {
      return '/firearms/default-shotgun.jpg';
    } else {
      return '/firearms/default-rifle.jpg';
    }
  };
  
  // Determine image source - prefer image_url if available, then image, then fallback
  const imageUrl = imageError || (!item.image_url && !item.image)
    ? getFallbackImage()
    : item.image_url || item.image;
  
  const handleViewBallistics = () => {
    // Get the full title for better caliber/type detection
    const fullTitle = `${item.make} ${item.model}`;
    
    // Get ballistic defaults based on firearm data
    const ballisticDefaults = getBallisticDefaults(fullTitle, item.notes || '');
    
    // Add the caliber information explicitly from our record
    ballisticDefaults.caliber = item.caliber;
    
    // Navigate to ballistics page with the data
    navigate('/ballistics', {
      state: {
        firearm: {
          ...item,
          ...ballisticDefaults
        }
      }
    });
    
    toast({
      title: "Ballistics Calculator",
      description: `Loaded ballistic data for ${item.make} ${item.model}.`
    });
  };

  const handleListForTrading = () => {
    if (onListForTrading) {
      onListForTrading(item);
    } else {
      // Direct navigation as fallback if callback not provided
      navigate('/trading', {
        state: {
          listItem: item,
          action: 'createListing'
        }
      });
      
      toast({
        title: "Trading",
        description: `${item.make} ${item.model} ready to list for trading.`
      });
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${item.make} ${item.model}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
          {item.condition}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{item.make} {item.model}</CardTitle>
        <p className="text-sm text-muted-foreground">Caliber: {item.caliber}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">S/N:</span> {item.serialNumber}</p>
          {item.purchaseDate && (
            <p><span className="font-medium">Purchased:</span> {new Date(item.purchaseDate).toLocaleDateString()}</p>
          )}
          <p><span className="font-medium">Value:</span> ${item.value.toLocaleString()}</p>
          
          {item.notes && (
            <p className="line-clamp-2 mt-2 text-muted-foreground">{item.notes}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 grid grid-cols-2 gap-2">
        <Button 
          variant="outline" size="sm"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        
        <Button 
          variant="outline" size="sm"
          onClick={handleViewBallistics}
        >
          <Target className="h-4 w-4 mr-1" /> Ballistics
        </Button>
        
        <Button 
          variant="outline" size="sm"
          onClick={handleListForTrading}
        >
          <ShoppingCart className="h-4 w-4 mr-1" /> Trade
        </Button>
        
        <Button 
          variant="outline" size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
