
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/message.types';

export const fetchUserProfiles = async (userIds: string[]) => {
  if (!userIds.length) return {};
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, email')
    .in('id', userIds);
    
  if (error) {
    console.error('Error fetching profiles:', error);
    return {};
  }
  
  // Create a map of user IDs to names
  return profiles?.reduce((acc, profile) => {
    acc[profile.id] = profile.username || profile.email || 'Unknown User';
    return acc;
  }, {} as Record<string, string>) || {};
};

export const markMessagesAsRead = async (messages: Message[], userId: string) => {
  const unreadMessages = messages.filter(msg => 
    msg.recipient_id === userId && !msg.is_read
  );
  
  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map(msg => msg.id);
    
    await supabase
      .from('direct_messages')
      .update({ is_read: true })
      .in('id', unreadIds);
    
    return true;
  }
  
  return false;
};

export const processConversations = (
  messages: any[],
  userId: string, 
  userMap: Record<string, string>
): Conversation[] => {
  // Process messages into conversations
  const conversationMap: Record<string, Conversation> = {};
  
  messages.forEach(message => {
    const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;
    
    if (!conversationMap[otherUserId]) {
      conversationMap[otherUserId] = {
        user_id: otherUserId,
        user_name: userMap[otherUserId] || 'Unknown User',
        last_message: message.message,
        unread_count: message.is_read === false && message.recipient_id === userId ? 1 : 0,
        last_message_time: message.created_at
      };
    } else if (new Date(message.created_at) > new Date(conversationMap[otherUserId].last_message_time)) {
      // Update last message if this one is newer
      conversationMap[otherUserId].last_message = message.message;
      conversationMap[otherUserId].last_message_time = message.created_at;
      
      // Count unread messages
      if (message.is_read === false && message.recipient_id === userId) {
        conversationMap[otherUserId].unread_count += 1;
      }
    }
  });
  
  // Convert map to array and sort by last message time
  return Object.values(conversationMap).sort((a, b) => 
    new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
  );
};

export const enrichMessagesWithUserNames = (
  messages: any[],
  userMap: Record<string, string>
): Message[] => {
  return messages.map(msg => ({
    ...msg,
    sender_name: userMap[msg.sender_id] || 'Unknown User',
    recipient_name: userMap[msg.recipient_id] || 'Unknown User'
  }));
};
