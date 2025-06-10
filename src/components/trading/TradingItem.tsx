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

export default function TradingItem({
  item,
  onContact,
  onToggleFavorite,
  onEdit,
  onSold,
  onDelete,
  activeTab,
  onReport,
  isOwner = false,
}: TradingItemProps) {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { handleViewBallistics } = useItemBallistics(item);

  // Ensure we always have a normalized array for images
  const sanitizedImages = normalizeImages(item.images);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="hover-scale"
      >
        <Card className="overflow-hidden h-full flex flex-col shadow-lg border-2 hover:border-primary/30 transition-all">
          <ItemImage
            title={item.title}
            price={item.price}
            images={sanitizedImages}
            favorite={item.favorite}
            isOwner={isOwner}
            onToggleFavorite={() => onToggleFavorite(item.id)}
            onReport={() => setIsReportDialogOpen(true)}
          />

          <ItemHeader title={item.title} location={item.location} />

          <ItemContent
            condition={item.condition}
            postedDate={item.postedDate}
            description={item.description}
            sellerName={item.sellerName}
            sellerRating={item.sellerRating}
          />

          <CardFooter className="pt-2">
            {(isOwner && onEdit) || activeTab == "sold" ? (
              <OwnerActions
                onEdit={() => onEdit(item.id)}
                onSold={() => onSold(item.id)}
                onContact={() => onContact(item.id)}
                onViewBallistics={handleViewBallistics}
                onDelete={onDelete ? () => setIsDeleteDialogOpen(true) : undefined}
              />
            ) : (
              <BuyerActions
                onContact={() => onContact(item.id)}
                onViewBallistics={handleViewBallistics}
                onAnalyze={() => setShowAnalysisDialog(true)}
              />
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <AnalysisDialogWrapper
        isOpen={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
        item={item}
      />

      <DeleteConfirmDialogWrapper
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          if (onDelete) {
            return onDelete(item.id);
          }
          return Promise.resolve(false);
        }}
      />

      {onReport && (
        <ReportListingDialogWrapper
          isOpen={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          onSubmit={onReport}
          item={item}
        />
      )}
    </>
  );
}
