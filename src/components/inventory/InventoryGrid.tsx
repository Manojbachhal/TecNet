
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FirearmItem } from './InventoryItem';
import InventoryItem from './InventoryItem';

interface InventoryGridProps {
  items: FirearmItem[];
  searchTerm: string;
  onEditItem: (item: FirearmItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
  onListForTrading?: (item: FirearmItem) => void;
}

export default function InventoryGrid({ 
  items, 
  searchTerm, 
  onEditItem, 
  onDeleteItem, 
  onAddItem,
  onListForTrading
}: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          {searchTerm ? "No firearms match your search" : "No firearms in your inventory"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm 
            ? `No items match "${searchTerm}". Try a different search term.` 
            : "Add your first firearm to your inventory."}
        </p>
        <Button onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" /> Add Firearm
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <InventoryItem 
          key={item.id} 
          item={item} 
          onEdit={onEditItem} 
          onDelete={onDeleteItem}
          onListForTrading={onListForTrading}
        />
      ))}
    </div>
  );
}
