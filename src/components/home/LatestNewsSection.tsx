
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight, RefreshCw } from 'lucide-react';
import { useNews } from '@/components/news/hooks/useNews';
import { NewsItem } from '../news/types/newsTypes';
import { getReliableFallbackImage } from '../trading/utils/imageUtils';
import { useToast } from '@/hooks/use-toast';

const LatestNewsSection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { newsItems, loading, error, fetchNews } = useNews("firearms news");
  
  // Take only the first news item for display
  const latestNews = newsItems.slice(0, 1);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchNews();
      toast({
        title: "News refreshed",
        description: "Latest news content has been updated",
      });
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: "Could not update news content",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Setup periodic refresh (every 5 minutes)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [fetchNews]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gradient-to-b from-black to-[#0f1114]"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-purple-500" />
            Latest News
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300"
              onClick={() => navigate('/news')}
            >
              See all news <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {(loading || isRefreshing) ? (
          <div className="h-48 border border-gray-800 rounded-lg animate-pulse bg-gray-900"></div>
        ) : error ? (
          <div className="rounded-lg border border-destructive p-4 text-destructive">
            <p className="font-medium">Unable to load news</p>
            <p className="text-sm mt-1">Please try refreshing or check again later</p>
          </div>
        ) : latestNews.length === 0 ? (
          <div className="rounded-lg border border-gray-800 p-4 text-center">
            <p className="text-gray-400">No news articles available</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try again
            </Button>
          </div>
        ) : (
          <div>
            {latestNews.map((item: NewsItem, index: number) => (
              <NewsCard 
                key={`news-${index}-${item.title?.substring(0, 20) || index}`}
                item={item}
                delay={index * 0.1} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface NewsCardProps {
  item: NewsItem;
  delay: number;
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, delay, index }) => {
  const handleClick = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Function to get a unique image for each news item to avoid repetition
  const getUniqueImage = () => {
    // If item has a valid thumbnail, use it
    if (item.thumbnail && !item.thumbnail.includes('placeholder')) {
      return item.thumbnail;
    }
    
    // Use the item title to generate a consistent but different image for each item
    return getReliableFallbackImage(item.title || `news-item-${index}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col md:flex-row bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-purple-900 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-900/20"
      onClick={handleClick}
    >
      <div className="h-48 md:h-auto md:w-1/3 overflow-hidden">
        <img 
          src={getUniqueImage()} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Prevent infinite error loop
            if (!target.src.includes('/placeholder.svg')) {
              target.src = '/placeholder.svg';
              console.log('News image failed to load, using placeholder');
            }
          }}
        />
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">{item.snippet || 'No description available.'}</p>
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{item.source?.name || 'News Source'}</span>
          <span className="text-purple-400">Read more</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LatestNewsSection;
