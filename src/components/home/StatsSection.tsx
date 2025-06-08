
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, ListChecks, Badge } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-10 h-10 text-purple-400" />,
      value: "8.1 MILLION+",
      label: "Member Community",
      delay: 0.1
    },
    {
      icon: <ShoppingBag className="w-10 h-10 text-purple-400" />,
      value: "34 MILLION+",
      label: "Units Sold",
      delay: 0.2
    },
    {
      icon: <ListChecks className="w-10 h-10 text-purple-400" />,
      value: "3 MILLION+",
      label: "Listings",
      delay: 0.3
    },
    {
      icon: <Badge className="w-10 h-10 text-purple-400" />,
      value: "31,000+",
      label: "FFL Dealer Network",
      delay: 0.4
    }
  ];

  return (
    <div className="w-full bg-black py-8 border-y border-primary/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: stat.delay,
                ease: "easeOut"
              }}
              className="flex flex-col items-center"
            >
              {stat.icon}
              <motion.h3 
                className="mt-3 text-2xl md:text-3xl font-bold text-purple-400"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: stat.delay + 0.2
                }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-white mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
