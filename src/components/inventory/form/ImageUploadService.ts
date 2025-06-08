
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUploadService = () => {
  const { toast } = useToast();
  
  const uploadImageToStorage = async (file: File, firearmId: string, userId: string): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to upload images.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/firearms/${firearmId}.${fileExt}`;
      
      console.log('Uploading image to storage:', filePath);
      
      const { data, error } = await supabase.storage
        .from('firearm-images')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Image Upload Failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('firearm-images')
        .getPublicUrl(filePath);
      
      console.log('Image uploaded, public URL:', publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error('Error in image upload:', error);
      toast({
        title: "Image Upload Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { uploadImageToStorage };
};
