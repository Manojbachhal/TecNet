
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClassifiedsHeader from '@/components/classifieds/ClassifiedsHeader';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import ClassifiedFormDialog from '@/components/classifieds/ClassifiedFormDialog';
import { Classified } from '@/components/classifieds/types';
import { useClassifieds } from '@/hooks/useClassifieds';

// Define the database row type to match the table structure
type ClassifiedRow = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  contact_info: string | null;
  image_url: string | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const Classifieds = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Classified | null>(null);
  
  const {
    classifieds,
    isLoading,
    searchTerm,
    setSearchTerm,
    refetchClassifieds,
  } = useClassifieds();
  
  const handleAddClassified = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to post a classified ad.",
        variant: "destructive"
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
      // Check if classifieds-images bucket exists and create it if it doesn't
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'classifieds-images');
      
      if (!bucketExists) {
        console.log('Creating classifieds-images bucket');
        await supabase
          .storage
          .createBucket('classifieds-images', {
            public: true, 
            fileSizeLimit: 5242880 // 5MB
          });
      }

      if (editItem) {
        // Update existing classified
        await supabase
          .from('classifieds')
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            contact_info: formData.contactInfo,
            image_url: formData.imageUrl
          })
          .eq('id', editItem.id);
          
        toast({
          title: "Classified Updated",
          description: "Your classified ad has been updated successfully."
        });
      } else {
        // Create new classified
        await supabase
          .from('classifieds')
          .insert({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            contact_info: formData.contactInfo,
            image_url: formData.imageUrl,
            user_id: session?.user.id
          });
          
        toast({
          title: "Classified Created",
          description: "Your classified ad has been posted successfully."
        });
      }
      
      setIsFormOpen(false);
      refetchClassifieds();
    } catch (error) {
      console.error('Error saving classified:', error);
      toast({
        title: "Error",
        description: "Failed to save your classified ad. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClassified = async (id: string) => {
    try {
      await supabase.from('classifieds').delete().eq('id', id);
      toast({
        title: "Classified Deleted",
        description: "Your classified ad has been removed."
      });
      refetchClassifieds();
    } catch (error) {
      console.error('Error deleting classified:', error);
      toast({
        title: "Error",
        description: "Failed to delete your classified ad. Please try again.",
        variant: "destructive"
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
            classifieds={classifieds}
            isLoading={isLoading}
            searchTerm={searchTerm}
            isOwner={isOwner}
            onEditClassified={handleEditClassified}
            onDeleteClassified={handleDeleteClassified}
          />
        </motion.div>
      </main>
      
      <ClassifiedFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClassified}
        editItem={editItem}
      />
    </div>
  );
};

export default Classifieds;
