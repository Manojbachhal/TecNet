import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";
import { fetchUserProfiles, processConversations } from "@/utils/message.utils";

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get all messages where the current user is either the sender or recipient
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Group by context_type, context_id, and other user
        const uniqueConversations = new Map<string, any>();
        data.forEach((msg) => {
          const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          const key = `${msg.context_type || ""}:${msg.context_id || ""}:${otherUserId}`;
          if (!uniqueConversations.has(key)) {
            uniqueConversations.set(key, []);
          }
          uniqueConversations.get(key).push(msg);
        });
        // For each group, get the latest message and build Conversation object
        const conversationArray: Conversation[] = [];
        for (const [key, msgs] of uniqueConversations.entries()) {
          const sortedMsgs = msgs.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const latest = sortedMsgs[0];
          const otherUserId = latest.sender_id === user.id ? latest.recipient_id : latest.sender_id;
          conversationArray.push({
            user_id: otherUserId,
            user_name: "Unknown User", // Will be enriched later if needed
            last_message: latest.message,
            unread_count: sortedMsgs.filter(
              (m) => m.is_read === false && m.recipient_id === user.id
            ).length,
            last_message_time: latest.created_at,
            context_type: latest.context_type,
            context_id: latest.context_id,
          });
        }
        handleConversation(conversationArray);

        // setConversations(conversationArray);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversation = async (convoArr) => {
    console.log(convoArr, "cov");
    const tradingIds = convoArr
      .filter((c) => c.context_type === "trading" && c.context_id)
      .map((c) => c.context_id);

    const classifiedIds = convoArr
      .filter((c) => c.context_type === "classified" && c.context_id)
      .map((c) => c.context_id);

    const { data: tradingNames, error: traingError } = await supabase
      .from("trading_listings")
      .select("id, title")
      .in("id", tradingIds);

    const { data: classifiedNames, error } = await supabase
      .from("classifieds")
      .select("id, title")
      .in("id", classifiedIds);

    const itemNames = new Map();

    classifiedNames.forEach((ele, index) => {
      itemNames.set(ele.id, ele.title);
    });

    tradingNames.forEach((ele, index) => {
      itemNames.set(ele.id, ele.title);
    });

    const res = convoArr.map((ele) => {
      if (itemNames.get(ele.context_id)) {
        ele.chatName = itemNames.get(ele.context_id);
      }
      return ele;
    });
    // console.log(res);
    setConversations(res);
  };

  return {
    conversations,
    isLoading,
    fetchConversations,
  };
};
