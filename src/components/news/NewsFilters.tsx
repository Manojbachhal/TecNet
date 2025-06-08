
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface NewsFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
  categories: Array<{ label: string; value: string | null }>;
}

export default function NewsFilters({
  query,
  onQueryChange,
  onSearch,
  onCategorySelect,
  selectedCategory,
  categories
}: NewsFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full sm:flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <Input
              type="text"
              placeholder="Search for firearms news..."
              className="pl-8 pr-10"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground/70 hover:text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => onCategorySelect(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value || 'all'} value={category.value || 'all'}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={onSearch} className="flex-shrink-0">
            Search
          </Button>
        </div>
      </div>
      
      {selectedCategory && (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Active filter:</span>
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 px-2 py-1"
          >
            {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
            <button onClick={() => onCategorySelect(null)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
