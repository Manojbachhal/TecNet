
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ListingItem } from '../types/tradingTypes';
import { getBallisticDefaults, extractCaliber } from '@/components/ballistics/utils/ballisticsMappings';

export const useItemBallistics = (item: ListingItem) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewBallistics = () => {
    // Get ballistic defaults based on item title/description
    const ballisticDefaults = getBallisticDefaults(item.title, item.description);
    
    // Create a simplified firearm object from the listing data
    const firearmData = {
      id: item.id,
      make: item.title.split(' ')[0], // Use first word as make
      model: item.title.split(' ').slice(1).join(' '), // Rest as model
      caliber: extractCaliber(item.title, item.description),
      condition: item.condition,
      // Add ballistic properties
      ...ballisticDefaults
    };
    
    // Navigate to ballistics page with the data
    navigate('/ballistics', {
      state: {
        firearm: firearmData
      }
    });
    
    toast({
      title: "Ballistics Calculator",
      description: `Loaded ballistic data for ${item.title}.`
    });
  };
  
  return { handleViewBallistics };
};
