
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { ListingItem } from './types/tradingTypes';

interface TradingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  listings: ListingItem[];
}

const TradingTabs = ({ activeTab, onTabChange, listings }: TradingTabsProps) => {
  const { session } = useAuth();
  
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList>
        <TabsTrigger value="all">All Listings</TabsTrigger>
        {session && (
          <TabsTrigger value="my-listings">
            My Listings
          </TabsTrigger>
        )}
        <TabsTrigger value="favorites">
          Favorites ({listings.filter(item => item.favorite).length})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TradingTabs;
