
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ItemContentProps {
  condition: string;
  postedDate: string;
  description: string;
  sellerName: string;
  sellerRating: number;
}

export default function ItemContent({ 
  condition, 
  postedDate, 
  description, 
  sellerName, 
  sellerRating 
}: ItemContentProps) {
  return (
    <CardContent className="pb-2 flex-grow space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-card/50">{condition}</Badge>
        <Badge variant="secondary" className="text-xs">Posted: {postedDate}</Badge>
      </div>
      
      <p className="text-sm line-clamp-2 text-muted-foreground">{description}</p>
      
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{sellerName}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < sellerRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  );
}
