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
  
  // Add context-aware wrappers
  const fetchMessagesWithContext = (otherUserId: string, contextType?: 'trading' | 'classified', contextId?: string) => {
    return fetchMessages(otherUserId, contextType, contextId);
  };
  const sendMessageWithContext = (recipientId: string, message: string, contextType?: 'trading' | 'classified', contextId?: string) => {
    return sendMessage(recipientId, message, contextType, contextId);
  };
  
  return {
    conversations,
    messages,
    currentConversation,
    isLoading: conversationsLoading || messagesLoading,
    fetchConversations,
    fetchMessages: fetchMessagesWithContext,
    sendMessage: sendMessageWithContext,
    setCurrentConversation
  };
};
