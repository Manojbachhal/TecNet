
import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ItemHeaderProps {
  title: string;
  location: string;
}

export default function ItemHeader({ title, location }: ItemHeaderProps) {
  return (
    <CardHeader className="pb-2 pt-3">
      <div className="space-y-1">
        <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{location || 'Not specified'}</span>
        </div>
      </div>
    </CardHeader>
  );
}
