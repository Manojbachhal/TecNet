import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExistingTrade = (item) => {
  const [isExistingTrade, setIsExistingTrade] = useState(false);
  const { toast } = useToast(); // if needed

  useEffect(() => {
    const checkTrade = async () => {
      if (!item) return;

      try {
        const { data, error } = await supabase
          .from("trading_listings")
          .select("*")
          .eq("title", item.make + " " + item.model);

        console.log(data, "inhook");

        if (data && data.length > 0) {
          setIsExistingTrade(true);
        } else {
          setIsExistingTrade(false);
        }

        if (error) {
          console.error("Supabase error:", error.message);
          toast({
            title: "Error checking trade",
            description: error.message,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checkTrade();
  }, [item]);

  return { isExistingTrade };
};
