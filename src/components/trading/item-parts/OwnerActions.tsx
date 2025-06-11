import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Crosshair, Trash2, BaggageClaim } from "lucide-react";

interface OwnerActionsProps {
  onEdit: () => void;
  onSold: () => void;
  onContact: () => void;
  onViewBallistics: () => void;
  onDelete?: () => void;
}

export default function OwnerActions({
  onEdit,
  onSold,
  onViewBallistics,
  onDelete,
}: OwnerActionsProps) {
  return (
    <div className="flex gap-2 w-full">
      <Button variant="outline" className="flex-1" onClick={onEdit}>
        <Edit className="h-4 w-4 mr-2" /> Edit
      </Button>
      {/* <Button variant="outline" className="flex-1" onClick={onSold}>
        <BaggageClaim className="h-4 w-4 mr-2" /> Sold
      </Button> */}
      <Button variant="outline" onClick={onViewBallistics} title="View Ballistics" size="icon">
        <Crosshair className="h-4 w-4" />
      </Button>
      {onDelete && (
        <Button variant="destructive" size="icon" onClick={onDelete} title="Delete listing">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
