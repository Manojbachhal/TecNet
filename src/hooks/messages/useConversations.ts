
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/message.types';
import { fetchUserProfiles, processConversations } from '@/utils/message.utils';

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
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Get unique user IDs from conversations (excluding the current user)
        const uniqueUserIds = [...new Set(
          data.map(msg => 
            msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
          )
        )];
        
        // Fetch user profiles for these IDs
        const userMap = await fetchUserProfiles(uniqueUserIds);
        
        // Process messages into conversations
        const conversationArray = processConversations(data, user.id, userMap);
        
        setConversations(conversationArray);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    conversations,
    isLoading,
    fetchConversations
  };
};
