
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tag, ArrowRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ListingItem } from '@/components/trading/types/tradingTypes';
import { getReliableFallbackImage } from '@/components/trading/utils/imageUtils';

const FeaturedItemSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredItem, setFeaturedItem] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLatestListing = async () => {
      try {
        setLoading(true);
        
        // Fetch the most recent active listing
        const { data, error } = await supabase
          .from('trading_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error fetching featured item:', error);
          // Just fail silently in the UI - default to null
          return;
        }
        
        if (data) {
          const item: ListingItem = {
            id: data.id,
            title: data.title,
            price: Number(data.price),
            location: data.location || '',
            condition: data.condition || 'Good',
            sellerName: data.seller_name || 'Anonymous',
            sellerRating: data.seller_rating || 5,
            postedDate: 'Recently',
            images: data.image_url ? [data.image_url] : [],
            description: data.description || '',
            favorite: false,
            firearmId: data.firearm_id,
            reported: data.reported || false
          };
          
          console.log('Featured item loaded:', item);
          setFeaturedItem(item);
        }
      } catch (error) {
        console.error('Error fetching featured item:', error);
        // Just fail silently in the UI - default to null
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestListing();
  }, []);
  
  // Fallback for when no items exist yet
  const fallbackItem = {
    id: 'featured-1',
    title: 'Tactical Precision Rifle',
    description: 'Premium bolt-action rifle with match-grade barrel, adjustable trigger, and custom chassis system. Perfect for long-range shooting enthusiasts.',
    images: ['/firearms/default-rifle.jpg'],
    price: 1599.99,
    sellerName: 'Premium Firearms',
    location: 'Austin, TX',
    condition: 'Excellent',
    category: 'Rifles',
    favorite: false
  };
  
  // Use the real featured item if available, otherwise use fallback
  const displayItem = featuredItem || fallbackItem;

  // Handle image error or missing image
  const getDisplayImage = () => {
    // Check if we have an actual image from the database
    if (featuredItem && featuredItem.images && featuredItem.images.length > 0 && featuredItem.images[0]) {
      return featuredItem.images[0];
    } 
    
    // If we're using fallback item, use its image
    if (!featuredItem && fallbackItem.images.length > 0) {
      return fallbackItem.images[0];
    }
    
    // Default reliable image based on the title
    return getReliableFallbackImage(displayItem.title);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-12 bg-[#0f1114]"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Tag className="mr-2 h-5 w-5 text-purple-500" />
            Featured Item
          </h2>
          <Button
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => navigate('/trading')}
          >
            Browse marketplace <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="h-64 border border-gray-800 rounded-lg animate-pulse bg-gray-900"></div>
        ) : (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-900/20"
          >
            <div className="md:flex">
              <div className="md:w-2/5 bg-gray-900">
                <img 
                  src={getDisplayImage()} 
                  alt={displayItem.title} 
                  className="w-full h-48 md:h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load, using fallback');
                    (e.target as HTMLImageElement).src = getReliableFallbackImage(displayItem.title);
                  }}
                />
              </div>
              <div className="md:w-3/5 p-6">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-white mb-2">{displayItem.title}</h3>
                  <span className="text-lg font-semibold text-purple-400">${typeof displayItem.price === 'number' ? displayItem.price.toFixed(2) : displayItem.price}</span>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-2">{displayItem.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Seller</span>
                    <span className="text-white">{displayItem.sellerName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Location</span>
                    <span className="text-white">{displayItem.location}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Condition</span>
                    <span className="text-white">{displayItem.condition}</span>
                  </div>
                </div>
                
                {/* Only show tags if they exist on the fallback item */}
                {fallbackItem === displayItem && 'category' in displayItem && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                      {displayItem.category}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-sm py-1"
                    onClick={() => navigate('/trading')}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-gray-800 flex items-center text-sm py-1"
                  >
                    <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeaturedItemSection;
