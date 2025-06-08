
import { useState, useEffect } from 'react';
import { FirearmItem } from '@/components/inventory/InventoryItem';

export const useInventorySearch = (items: FirearmItem[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<FirearmItem[]>([]);
  
  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter(item => 
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caliber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};
