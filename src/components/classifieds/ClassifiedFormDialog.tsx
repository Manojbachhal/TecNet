import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Classified } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X } from "lucide-react";

interface ClassifiedFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editItem: Classified | null;
}

const ClassifiedFormDialog = ({ isOpen, onClose, onSave, editItem }: ClassifiedFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setDescription(editItem.description || "");
      setPrice(editItem.price || undefined);
      setEmail(editItem.email || "");
      setPhoneNumber(editItem.phone_number || "");
      setExistingImageUrl(editItem.image_url);
      setImagePreview(editItem.image_url || null);
    } else {
      resetForm();
    }
  }, [editItem, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(undefined);
    setEmail("");
    setPhoneNumber("");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop an image file (PNG, JPG or GIF).",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for your classified ad.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      let imageUrl = existingImageUrl;

      // Upload new image if selected
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from("classifieds-images")
          .upload(fileName, imageFile);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("classifieds-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      await onSave({
        title,
        description,
        price: price || 0,
        email,
        phoneNumber,
        imageUrl,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving classified:", error);
      toast({
        title: "Error",
        description: "There was a problem uploading your image or saving your classified ad.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Classified Ad" : "Post a Classified Ad"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling or looking for?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about your item or request"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price || ""}
              onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Enter price (optional)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="How can interested parties reach you?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview ? (
              <div className="relative rounded-md overflow-hidden h-48 bg-muted">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors ${
                      isDragging ? "border-primary bg-primary/10" : ""
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      onClick={(e) => (e.currentTarget.value = "")} // Reset input on click
                    />
                  </label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select Image
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editItem ? "Update" : "Post"} Classified
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassifiedFormDialog;
