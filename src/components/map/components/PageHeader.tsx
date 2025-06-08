
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageHeaderProps {
  showInfo: boolean;
  toggleInfo: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ showInfo, toggleInfo }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row justify-between items-center mb-4"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">
          TacNet Locator
        </h1>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-white border-primary/30 bg-primary/10 hover:bg-primary/20 neon-glow ml-2 p-4 rounded-[8px]"
          onClick={toggleInfo}
        >
          <Info className="mr-2 h-4 w-4" />
          {showInfo ? 'Hide Info' : 'About'}
        </Button>
      </div>
      
      {!isMobile && (
        <p className="text-gray-300 max-w-xl text-sm md:text-base bg-black/30 p-2 rounded-lg backdrop-blur-sm">
          Locate shooting ranges, gun shops, and firearms-related businesses across the country with our interactive map
        </p>
      )}
    </motion.div>
  );
};

export default PageHeader;
