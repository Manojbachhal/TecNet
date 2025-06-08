
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface TradingHeaderProps {
  onCreateListing: () => void;
}

const TradingHeader = ({ onCreateListing }: TradingHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between mb-6"
    >
      <div>
        <h1 className="text-3xl font-bold">TacNet Trading Post</h1>
        <p className="text-muted-foreground mt-1">
          Browse listings and connect with sellers
        </p>
      </div>
      
      <Button 
        onClick={onCreateListing} 
        className="
          h-10 
          px-4 
          rounded-lg 
          bg-gradient-to-br 
          from-purple-500 
          to-purple-900 
          text-white 
          shadow-lg 
          hover:shadow-xl 
          transition-all 
          duration-300 
          transform 
          hover:-translate-y-0.5 
          active:scale-[0.98] 
          active:shadow-md
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500 
          focus:ring-opacity-50
        "
      >
        <Plus className="mr-2 h-4 w-4" /> Create Listing
      </Button>
    </motion.div>
  );
};

export default TradingHeader;

