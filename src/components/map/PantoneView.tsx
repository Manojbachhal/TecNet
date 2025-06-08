
import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PantoneViewProps {
  isOpen: boolean;
  onClose: () => void;
  locationName?: string;
}

const PantoneView: React.FC<PantoneViewProps> = ({ isOpen, onClose, locationName }) => {
  if (!isOpen) return null;
  
  const colors = [
    { name: "Range Red", hex: "#ff4d4d", pantoneId: "P 48-16 C" },
    { name: "Target Orange", hex: "#ff7e33", pantoneId: "P 34-8 C" },
    { name: "Safety Yellow", hex: "#ffcc4d", pantoneId: "P 15-8 C" },
    { name: "Tactical Green", hex: "#4dff88", pantoneId: "P 142-8 C" },
    { name: "Gunmetal Gray", hex: "#3C4251", pantoneId: "P 179-15 C" },
    { name: "Brass Gold", hex: "#d4af37", pantoneId: "P 10-15 C" },
    { name: "Polymer Black", hex: "#151515", pantoneId: "P 179-16 C" },
    { name: "Cerakote Blue", hex: "#4d94ff", pantoneId: "P 112-8 C" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-background border border-primary/30 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-primary/20 flex justify-between items-center">
          <div className="flex items-center">
            <Palette className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">
              {locationName ? `${locationName} Color Palette` : 'Range Color Palette'}
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <span className="sr-only">Close</span>
            ×
          </Button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            This is a designer color palette inspired by shooting range environments. These colors represent elements typically found at ranges like target colors, safety indicators, and tactical equipment. You can use these for design projects related to firearms or ranges.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {colors.map((color) => (
              <div key={color.hex} className="flex flex-col">
                <div 
                  className="h-24 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    navigator.clipboard.writeText(color.hex);
                  }}
                />
                <div className="mt-2">
                  <p className="font-medium text-sm">{color.name}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{color.hex}</span>
                    <span>{color.pantoneId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-primary/10 text-center">
            <p className="text-xs text-muted-foreground">
              Click on any color to copy its hex code to clipboard
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PantoneView;
