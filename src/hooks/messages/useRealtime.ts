
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DirectMessagePayload } from '@/types/message.types';

export const useRealtime = (
  currentConversation: string | null, 
  fetchConversations: () => void,
  fetchMessages: (userId: string) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('direct-messages-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'direct_messages', 
          filter: `recipient_id=eq.${user.id}` 
        }, 
        (payload: DirectMessagePayload) => {
          // Refresh conversations
          fetchConversations();
          
          // Check if payload.new exists and has the required properties
          if (currentConversation && 
              payload.new && 
              typeof payload.new === 'object' &&
              'sender_id' in payload.new &&
              'recipient_id' in payload.new &&
              (payload.new.sender_id === currentConversation || 
               payload.new.recipient_id === currentConversation)) {
            fetchMessages(currentConversation);
          }
          
          // Show notification for new messages
          if (payload.eventType === 'INSERT' && 
              payload.new && 
              typeof payload.new === 'object' &&
              'recipient_id' in payload.new &&
              payload.new.recipient_id === user.id) {
            toast({
              title: "New Message",
              description: "You have received a new message.",
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, currentConversation, fetchConversations, fetchMessages, toast]);
};
