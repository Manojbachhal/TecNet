
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mb-4 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-primary/20 cyberpunk-border relative"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-white">About Range Finder</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-8 w-8 rounded-full hover:bg-white/10 text-white"
          aria-label="Close info panel"
        >
          <X size={18} />
        </Button>
      </div>
      
      <p className="text-gray-300 text-sm">
        Our interactive map helps you locate firearms-related facilities including shooting ranges, 
        gun shops, gunsmiths, training facilities, museums, and clay/skeet venues. 
        Use the search box to find locations in specific areas, or click the target icon to use your current location.
        The color-coded markers make it easy to identify different types of locations at a glance.
      </p>
      
      <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#ff4d4d] mr-2"></div>
          <span className="text-xs text-gray-300">Ranges</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#4d94ff] mr-2"></div>
          <span className="text-xs text-gray-300">Shops</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#ffa64d] mr-2"></div>
          <span className="text-xs text-gray-300">Gunsmiths</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#4dff88] mr-2"></div>
          <span className="text-xs text-gray-300">Training</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#cb4dff] mr-2"></div>
          <span className="text-xs text-gray-300">Museums</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#ffcc4d] mr-2"></div>
          <span className="text-xs text-gray-300">Clay/Skeet</span>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
