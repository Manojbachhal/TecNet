
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthCheckProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default function AuthCheck({ isAuthenticated, isLoading }: AuthCheckProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create storage bucket for firearms if it doesn't exist
  useEffect(() => {
    const createStorageBucket = async () => {
      if (isAuthenticated) {
        try {
          console.log('Checking for firearm-images storage bucket...');
          // Check if bucket exists
          const { data, error } = await supabase.storage.getBucket('firearm-images');
          
          if (error && error.message.includes('The resource was not found')) {
            console.log('Bucket not found, creating it...');
            // Create the bucket if it doesn't exist
            const { error: createError } = await supabase.storage.createBucket('firearm-images', {
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });
            
            if (createError) {
              console.error('Error creating storage bucket:', createError);
              toast({
                title: "Storage Setup Error",
                description: "Could not create storage for images. Some features may be limited.",
                variant: "destructive"
              });
            } else {
              console.log('Created firearm-images storage bucket');
              toast({
                title: "Storage Ready",
                description: "Image storage has been set up successfully.",
              });
            }
          } else if (error) {
            console.error('Error checking for storage bucket:', error);
          } else {
            console.log('Bucket already exists:', data);
          }
        } catch (err) {
          console.error('Error checking for storage bucket:', err);
        }
      }
    };
    
    if (isAuthenticated && !isLoading) {
      createStorageBucket();
    }
  }, [isAuthenticated, isLoading, toast]);
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-medium mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Please sign in to view and manage your firearms inventory. 
          Your data is securely stored and only accessible to you.
        </p>
        <Button onClick={() => navigate('/auth')}>
          Sign In
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-muted-foreground">Loading your inventory...</p>
      </div>
    );
  }
  
  return null;
}
