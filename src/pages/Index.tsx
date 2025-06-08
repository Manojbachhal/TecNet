import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { 
  Crosshair, 
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";
import StatsSection from '@/components/home/StatsSection';
import QuickAccessDashboard from '@/components/home/QuickAccessDashboard';

export default function Index() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1114] text-white">
      <Navbar />
      
      {isMobile ? (
        <div className="container mx-auto px-4 py-12 flex-grow overflow-y-auto">
          <HeroSection navigate={navigate} />
          <QuickAccessDashboard />
          <StatsSection />
        </div>
      ) : (
        <div className="flex-grow overflow-hidden pt-16">
          <ScrollArea className="h-full">
            <div className="container mx-auto px-4 py-8">
              <HeroSection navigate={navigate} />
              <QuickAccessDashboard />
              <StatsSection />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

const HeroSection = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16 mt-16"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
        TacNet™
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Your comprehensive tactical network combining advanced technology with practical tools for firearms enthusiasts
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button 
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
          onClick={() => navigate('/range-finder')}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Find Ranges
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="border-gray-700 text-white hover:bg-gray-800 px-8 py-6 text-lg"
          onClick={() => navigate('/ballistics')}
        >
          <Crosshair className="mr-2 h-5 w-5" />
          Ballistics Calculator
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="lg"
        className="text-purple-400 hover:text-purple-300 mt-4"
        onClick={() => navigate('/features')}
      >
        Explore Key Features <ChevronDown className="ml-1 h-5 w-5" />
      </Button>
    </motion.div>
  );
};
