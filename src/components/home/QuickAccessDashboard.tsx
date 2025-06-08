
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Crosshair, 
  ShoppingBag, 
  Package, 
  Target, 
  Map, 
  BarChart3, 
  Settings, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';

const QuickAccessDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const quickLinks = [
    {
      title: "Ballistics Calculator",
      description: "Advanced trajectory and wind drift calculations for precision shooting",
      icon: <Crosshair className="h-6 w-6 text-purple-400" />,
      path: "/ballistics",
      color: "bg-gradient-to-br from-purple-900/20 to-purple-800/30"
    },
    {
      title: "TacNet Locator",
      description: "Find shooting ranges and firearms-related businesses near you",
      icon: <Map className="h-6 w-6 text-blue-400" />,
      path: "/range-finder",
      color: "bg-gradient-to-br from-blue-900/20 to-blue-800/30"
    },
    {
      title: "TacNet Trading",
      description: "Securely buy, sell, and trade firearms and equipment",
      icon: <ShoppingBag className="h-6 w-6 text-green-400" />,
      path: "/trading",
      color: "bg-gradient-to-br from-green-900/20 to-green-800/30"
    },
    {
      title: "Gear Inventory",
      description: "Manage and track your firearms and tactical gear collection",
      icon: <Package className="h-6 w-6 text-orange-400" />,
      path: "/inventory",
      color: "bg-gradient-to-br from-orange-900/20 to-orange-800/30"
    }
  ];
  
  const upcomingFeatures = [
    {
      title: "Training Planner",
      description: "Schedule and track your tactical training sessions",
      icon: <Calendar className="h-6 w-6 text-teal-400" />,
      comingSoon: true
    },
    {
      title: "Performance Insights",
      description: "Analyze and improve your shooting skills over time",
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
      comingSoon: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          TacNet Quick Access
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card 
                className={`h-full border border-gray-800 ${link.color} hover:border-purple-900 transition-all duration-300 shadow-md hover:shadow-purple-900/20 cursor-pointer bg-black`}
                onClick={() => navigate(link.path)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    {link.icon}
                    <ArrowUpRight className="h-4 w-4 text-gray-500" />
                  </div>
                  <CardTitle className="text-white text-xl mt-4">{link.title}</CardTitle>
                  <CardDescription className="text-gray-400">{link.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-purple-400 hover:text-purple-300 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(link.path);
                    }}
                  >
                    Access now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <h3 className="text-xl font-semibold mb-6 text-gray-300 mt-12">Coming to TacNet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
            >
              <Card className="border border-gray-800 bg-black/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <div className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                      Coming Soon
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg mt-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAccessDashboard;
