
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface ClassifiedsHeaderProps {
  onAddClassified: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClassifiedsHeader = ({ onAddClassified, searchTerm, setSearchTerm }: ClassifiedsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Classifieds</h1>
          <p className="text-muted-foreground">Browse, buy and sell items in our community marketplace</p>
        </div>
        
        <Button 
          onClick={onAddClassified} 
          className="mt-4 md:mt-0"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Post Classified
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search classifieds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default ClassifiedsHeader;
