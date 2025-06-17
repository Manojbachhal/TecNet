import React, { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TradingItemProps } from "./types/tradingTypes";
import ItemImage from "./item-parts/ItemImage";
import ItemHeader from "./item-parts/ItemHeader";
import ItemContent from "./item-parts/ItemContent";
import OwnerActions from "./item-parts/OwnerActions";
import BuyerActions from "./item-parts/BuyerActions";
import AnalysisDialogWrapper from "./dialogs/AnalysisDialogWrapper";
import DeleteConfirmDialogWrapper from "./dialogs/DeleteConfirmDialogWrapper";
import ReportListingDialogWrapper from "./dialogs/ReportListingDialogWrapper";
import { useItemBallistics } from "./hooks/useItemBallistics";
import { normalizeImages } from "./utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";

export default function TradingItem({
  item,
  onContact,
  onToggleFavorite,
  onEdit,
  onSold,
  onDelete,
  onReport,
  activeTab,
}: TradingItemProps) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { session } = useAuth();
  const { handleViewBallistics } = useItemBallistics(item);
  const isOwner = session?.user?.id === item.owner_id;

  // Don't render if item is sold and not in "my-listings" tab
  if (item.isSold && activeTab !== "my-listings") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <ItemImage
          images={normalizeImages(item.images)}
          title={item.title}
          price={item.price}
          isOwner={isOwner}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onReport={() => setIsReportDialogOpen(true)}
          isSold={item.isSold}
        />

        <ItemHeader
          title={item.title}
          location={item.location}
        />

        <ItemContent
          description={item.description}
          condition={item.condition}
          postedDate={item.postedDate}
          sellerName={item.sellerName}
          sellerRating={item.sellerRating}
        />

        <CardFooter className="flex flex-col gap-4 pt-4 mt-auto">
          {isOwner ? (
            <OwnerActions
              onEdit={() => onEdit?.(item.id)}
              onSold={() => onSold?.(item.id)}
              onContact={() => onContact(item.id)}
              onViewBallistics={handleViewBallistics}
              onDelete={onDelete ? () => setIsDeleteConfirmOpen(true) : undefined}
            />
          ) : (
            <BuyerActions
              onContact={() => onContact(item.id)}
              onViewBallistics={handleViewBallistics}
              onAnalyze={() => setIsAnalysisOpen(true)}
            />
          )}
        </CardFooter>
      </Card>

      <AnalysisDialogWrapper
        isOpen={isAnalysisOpen}
        onOpenChange={setIsAnalysisOpen}
        item={item}
      />

      <DeleteConfirmDialogWrapper
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={async () => {
          const success = await onDelete?.(item.id);
          if (success) {
            setIsDeleteConfirmOpen(false);
          }
          return success;
        }}
      />

      <ReportListingDialogWrapper
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        onSubmit={onReport}
        item={item}
      />
    </motion.div>
  );
}
