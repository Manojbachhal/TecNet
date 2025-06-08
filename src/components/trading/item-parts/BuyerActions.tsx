
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Crosshair, Search } from "lucide-react";

interface BuyerActionsProps {
  onContact: () => void;
  onViewBallistics: () => void;
  onAnalyze: () => void;
}

export default function BuyerActions({ 
  onContact, 
  onViewBallistics, 
  onAnalyze 
}: BuyerActionsProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <Button 
          className="flex-1"
          onClick={onContact}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> Contact Seller
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onViewBallistics}
          title="View Ballistics"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={onAnalyze}
      >
        <Search className="h-4 w-4 mr-2" /> Analyze Item
      </Button>
    </div>
  );
}
