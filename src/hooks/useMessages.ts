
import { useConversations } from './messages/useConversations';
import { useMessageExchange } from './messages/useMessageExchange';
import { useRealtime } from './messages/useRealtime';
import { Message, Conversation } from '@/types/message.types';

export type { Message, Conversation };

export const useMessages = () => {
  const { 
    conversations, 
    isLoading: conversationsLoading, 
    fetchConversations 
  } = useConversations();
  
  const { 
    messages, 
    currentConversation, 
    isLoading: messagesLoading, 
    fetchMessages, 
    sendMessage, 
    setCurrentConversation 
  } = useMessageExchange(fetchConversations);
  
  // Set up real-time subscription
  useRealtime(currentConversation, fetchConversations, fetchMessages);
  
  return {
    conversations,
    messages,
    currentConversation,
    isLoading: conversationsLoading || messagesLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation
  };
};
