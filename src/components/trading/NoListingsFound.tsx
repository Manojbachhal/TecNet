
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoListingsFoundProps {
  searchTerm: string;
  priceRange: string;
  activeTab: string;
  onClearFilters: () => void;
}

const NoListingsFound = ({ searchTerm, priceRange, activeTab, onClearFilters }: NoListingsFoundProps) => {
  return (
    <div className="bg-muted p-8 rounded-lg text-center">
      <h3 className="text-xl font-semibold mb-2">No listings found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm || priceRange !== 'all' || activeTab === 'favorites' || activeTab === 'my-listings'
          ? "No listings match your current search or filter criteria."
          : "There are no listings available at this time."}
      </p>
      {(searchTerm || priceRange !== 'all') && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default NoListingsFound;
