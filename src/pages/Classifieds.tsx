import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ClassifiedsHeader from "@/components/classifieds/ClassifiedsHeader";
import ClassifiedsList from "@/components/classifieds/ClassifiedsList";
import ClassifiedFormDialog from "@/components/classifieds/ClassifiedFormDialog";
import { Classified } from "@/components/classifieds/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClassifieds } from "@/hooks/useClassifieds";

// Define the database row type to match the table structure
type ClassifiedRow = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  email: string | null;
  phone_number: string | null;
  image_url: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const Classifieds = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Classified | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const { classifieds, isLoading, searchTerm, setSearchTerm, refetchClassifieds } =
    useClassifieds();

  const handleAddClassified = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to post a classified ad.",
        variant: "destructive",
      });
      return;
    }

    setEditItem(null);
    setIsFormOpen(true);
  };

  const handleEditClassified = (classified: Classified) => {
    setEditItem(classified);
    setIsFormOpen(true);
  };

  const handleSaveClassified = async (formData: any) => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((bucket) => bucket.name === "classifieds-images");

      if (!bucketExists) {
        await supabase.storage.createBucket("classifieds-images", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }

      if (editItem) {
        await supabase
          .from("classifieds")
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            email: formData.email,
            phone_number: formData.phoneNumber,
            image_url: formData.imageUrl,
          })
          .eq("id", editItem.id);

        toast({
          title: "Classified Updated",
          description: "Your classified ad has been updated successfully.",
        });
      } else {
        await supabase.from("classifieds").insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          email: formData.email,
          phone_number: formData.phoneNumber,
          image_url: formData.imageUrl,
          user_id: session?.user.id,
        });

        toast({
          title: "Classified Created",
          description: "Your classified ad has been posted successfully.",
        });
      }

      setIsFormOpen(false);
      refetchClassifieds();
    } catch (error) {
      console.error("Error saving classified:", error);
      toast({
        title: "Error",
        description: "Failed to save your classified ad. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await supabase.from("classifieds").delete().eq("id", deleteItemId);
      await supabase.from("direct_messages").delete().eq("context_id", deleteItemId);
      toast({
        title: "Classified Deleted",
        description: "Your classified ad has been removed.",
      });
      refetchClassifieds();
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting classified:", error);
      toast({
        title: "Error",
        description: "Failed to delete your classified ad. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSold = async (classified: Classified) => {
    try {
      await supabase
        .from("classifieds")
        .update({ is_sold: true })
        .eq("id", classified.id);

      toast({
        title: "Item Marked as Sold",
        description: "The item has been marked as sold successfully.",
      });
      refetchClassifieds();
    } catch (error) {
      console.error("Error marking item as sold:", error);
      toast({
        title: "Error",
        description: "Failed to mark item as sold. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isOwner = (classified: Classified) => {
    return classified.userId === session?.user.id;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ClassifiedsHeader
            onAddClassified={handleAddClassified}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <ClassifiedsList
            classifieds={classifieds.filter(item => !item.isSold)}
            isLoading={isLoading}
            searchTerm={searchTerm}
            isOwner={isOwner}
            onEditClassified={handleEditClassified}
            onDeleteClassified={(id) => setDeleteItemId(id)}
            onSold={handleSold}
          />
        </motion.div>
      </main>

      <ClassifiedFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClassified}
        editItem={editItem}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {classifieds.find((c) => c.id === deleteItemId)?.title ?? "this item"}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItemId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Classifieds;
