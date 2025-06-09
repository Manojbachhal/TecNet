import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_BUCKETS = [
  {
    name: "firearm-images",
    public: true,
    fileSizeLimit: 5242880, // 5MB
  },
  {
    name: "classifieds-images",
    public: true,
    fileSizeLimit: 5242880, // 5MB
  },
  {
    name: "avatars",
    public: true,
    fileSizeLimit: 2097152, // 2MB
  },
];

const StorageSetup = () => {
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    const setupStorage = async () => {
      if (!session) return; // Only run when user is authenticated

      try {
        // Get existing buckets
        const { data: existingBuckets } = await supabase.storage.listBuckets();
        console.log("Existing buckets:", existingBuckets);
        // Create missing buckets
        for (const bucket of STORAGE_BUCKETS) {
          const bucketExists = existingBuckets?.some((b) => b.name === bucket.name);

          if (!bucketExists) {
            console.log(`Creating bucket: ${bucket.name}`);
            const { error } = await supabase.storage.createBucket(bucket.name, {
              public: bucket.public,
              fileSizeLimit: bucket.fileSizeLimit,
            });

            if (error) {
              console.error(`Error creating bucket ${bucket.name}:`, error);
              // toast({
              //   title: "Storage Setup Error",
              //   description: `Could not create ${bucket.name} storage. Some features may be limited.`,
              //   variant: "destructive"
              // });
            } else {
              console.log(`Created bucket: ${bucket.name}`);
              toast({
                title: "Storage Ready",
                description: `${bucket.name} storage has been set up successfully.`,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error setting up storage:", error);
        toast({
          title: "Storage Setup Error",
          description: "Could not set up storage buckets. Some features may be limited.",
          variant: "destructive",
        });
      }
    };

    setupStorage();
  }, [session, toast]); // Run when session changes

  return null; // This component doesn't render anything
};

export default StorageSetup;
