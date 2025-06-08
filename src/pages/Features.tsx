
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { 
  List, 
  ShoppingCart, 
  Target, 
  Crosshair, 
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Features() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="h-screen flex flex-col bg-[#0f1114] text-white overflow-hidden">
      <Navbar />
      
      <div className={`flex-grow pt-16 ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {!isMobile && (
          <ScrollArea className="h-full">
            <div className="container mx-auto px-4 py-8">
              <FeaturesContent navigate={navigate} />
            </div>
          </ScrollArea>
        )}
        
        {isMobile && (
          <div className="container mx-auto px-4 py-8">
            <FeaturesContent navigate={navigate} />
          </div>
        )}
      </div>
    </div>
  );
}

const FeaturesContent = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <>
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Range Finder Card */}
          <Card className="bg-[#171923] border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="h-full p-6 cursor-pointer hover:bg-[#1a1d29] transition-colors"
                onClick={() => navigate('/range-finder')}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-purple-900/30 p-3 rounded-full mb-4">
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Range Finder</h3>
                  <p className="text-gray-400 text-sm">
                    Discover firearm ranges, stores, and related businesses worldwide with our interactive map.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Ballistics Calculator Card */}
          <Card className="bg-[#171923] border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="h-full p-6 cursor-pointer hover:bg-[#1a1d29] transition-colors"
                onClick={() => navigate('/ballistics')}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-purple-900/30 p-3 rounded-full mb-4">
                    <Crosshair className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ballistics</h3>
                  <p className="text-gray-400 text-sm">
                    Calculate accurate bullet trajectory and ballistic data with AI-enhanced precision.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Management Card */}
          <Card className="bg-[#171923] border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="h-full p-6 cursor-pointer hover:bg-[#1a1d29] transition-colors"
                onClick={() => navigate('/inventory')}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-purple-900/30 p-3 rounded-full mb-4">
                    <List className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Inventory</h3>
                  <p className="text-gray-400 text-sm">
                    Track firearms and ammunition with secure storage and AI tactical analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trading Platform Card */}
          <Card className="bg-[#171923] border-gray-800 hover:border-purple-500/50 transition-all hover:shadow-purple-500/10 hover:shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="h-full p-6 cursor-pointer hover:bg-[#1a1d29] transition-colors"
                onClick={() => navigate('/trading')}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-purple-900/30 p-3 rounded-full mb-4">
                    <ShoppingCart className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trading</h3>
                  <p className="text-gray-400 text-sm">
                    Buy, sell, and trade firearms securely with integrated verification and AI valuation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="bg-[#171923] border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">About TacNet</h2>
          <div className="space-y-6">
            <p className="text-gray-300">
              TacNet is a comprehensive platform designed for firearm enthusiasts, providing tools for inventory management, 
              ballistics calculations, range location, and secure trading. Our platform combines practical utility with 
              cutting-edge AI technology to enhance your firearm experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1d202c] p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">Security First</h3>
                <p className="text-sm text-gray-400">
                  All data is encrypted and stored securely, with privacy controls that put you in charge of your information.
                </p>
              </div>
              <div className="bg-[#1d202c] p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">Continuous Updates</h3>
                <p className="text-sm text-gray-400">
                  Our platform is constantly evolving with new features, improved AI models, and expanded database of firearms.
                </p>
              </div>
              <div className="bg-[#1d202c] p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">Community Focused</h3>
                <p className="text-sm text-gray-400">
                  Built by and for firearm enthusiasts, with community feedback driving our development priorities.
                </p>
              </div>
              <div className="bg-[#1d202c] p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">Cross-Platform</h3>
                <p className="text-sm text-gray-400">
                  Access your data securely from any device with our responsive web application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
