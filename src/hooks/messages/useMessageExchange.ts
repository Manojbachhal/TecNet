import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";
import {
  fetchUserProfiles,
  markMessagesAsRead,
  enrichMessagesWithUserNames,
} from "@/utils/message.utils";

export const useMessageExchange = (onConversationsUpdate: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages for a specific conversation and context
  const fetchMessages = async (
    otherUserId: string,
    contextType?: "trading" | "classified",
    contextId?: string
  ) => {
    if (!user || !otherUserId || !contextType || !contextId) return;
    try {
      setIsLoading(true);
      setCurrentConversation(otherUserId);
      // Get all messages between the current user and the other user for the given context
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .eq("context_type", contextType)
        .eq("context_id", contextId)
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      if (error) {
        throw error;
      }
      if (data) {
        // Mark received messages as read
        const wasUpdated = await markMessagesAsRead(data as any[], user.id);
        if (wasUpdated) {
          // Refresh conversations to update unread counts
          onConversationsUpdate();
        }
        // Get user profiles for sender and recipient
        const userIds = [
          ...new Set([...data.map((msg) => msg.sender_id), ...data.map((msg) => msg.recipient_id)]),
        ];
        const userMap = await fetchUserProfiles(userIds);
        // Add user names to messages
        const messagesWithNames = enrichMessagesWithUserNames(data, userMap);
        setMessages(messagesWithNames);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to another user in a specific context
  const sendMessage = async (
    recipientId: string,
    message: string,
    contextType?: "trading" | "classified",
    contextId?: string
  ): Promise<boolean> => {
    if (!user || !recipientId || !message.trim() || !contextType || !contextId) return false;
    try {
      const { data, error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim(),
          is_read: false,
          context_type: contextType,
          context_id: contextId,
        })
        .select("*")
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        // Refresh messages and conversations
        fetchMessages(recipientId, contextType, contextId);
        onConversationsUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    messages,
    currentConversation,
    isLoading,
    fetchMessages,
    sendMessage,
    setCurrentConversation,
  };
};
