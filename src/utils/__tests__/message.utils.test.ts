
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { 
  fetchUserProfiles, 
  markMessagesAsRead, 
  processConversations, 
  enrichMessagesWithUserNames 
} from '../message.utils';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message.types';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  },
}));

describe('Message Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUserProfiles', () => {
    it('should fetch user profiles for the given user IDs', async () => {
      // Mock supabase response
      const mockProfiles = [
        { id: 'user-1', username: 'User 1', email: 'user1@example.com' },
        { id: 'user-2', username: 'User 2', email: 'user2@example.com' },
      ];
      
      supabase.from().select().in = vi.fn().mockResolvedValue({
        data: mockProfiles,
        error: null,
      });

      // Act
      const result = await fetchUserProfiles(['user-1', 'user-2']);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.select).toHaveBeenCalledWith('id, username, email');
      expect(supabase.in).toHaveBeenCalledWith('id', ['user-1', 'user-2']);
      
      expect(result).toEqual({
        'user-1': 'User 1',
        'user-2': 'User 2',
      });
    });

    it('should handle empty userIds array', async () => {
      // Act
      const result = await fetchUserProfiles([]);

      // Assert
      expect(supabase.from).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should handle error response', async () => {
      // Mock supabase error response
      supabase.from().select().in = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch profiles'),
      });

      // Act
      const result = await fetchUserProfiles(['user-1']);

      // Assert
      expect(result).toEqual({});
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark unread messages as read', async () => {
      // Mock messages
      const messages: Message[] = [
        { id: '1', sender_id: 'user-1', recipient_id: 'current-user', message: 'Hello', is_read: false, created_at: '2023-01-01', updated_at: '2023-01-01' },
        { id: '2', sender_id: 'user-1', recipient_id: 'current-user', message: 'Hi', is_read: false, created_at: '2023-01-02', updated_at: '2023-01-02' },
        { id: '3', sender_id: 'current-user', recipient_id: 'user-1', message: 'Hey', is_read: true, created_at: '2023-01-03', updated_at: '2023-01-03' },
      ];
      
      // Mock supabase response
      supabase.from().update().in = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const result = await markMessagesAsRead(messages, 'current-user');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('direct_messages');
      expect(supabase.update).toHaveBeenCalledWith({ is_read: true });
      expect(supabase.in).toHaveBeenCalledWith('id', ['1', '2']);
      expect(result).toBe(true);
    });

    it('should not make a database call if there are no unread messages', async () => {
      // Mock messages with all read
      const messages: Message[] = [
        { id: '1', sender_id: 'user-1', recipient_id: 'current-user', message: 'Hello', is_read: true, created_at: '2023-01-01', updated_at: '2023-01-01' },
        { id: '2', sender_id: 'current-user', recipient_id: 'user-1', message: 'Hi', is_read: true, created_at: '2023-01-02', updated_at: '2023-01-02' },
      ];

      // Act
      const result = await markMessagesAsRead(messages, 'current-user');

      // Assert
      expect(supabase.from).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('processConversations', () => {
    it('should process messages into conversations', () => {
      // Mock messages
      const messages = [
        { sender_id: 'current-user', recipient_id: 'user-1', message: 'Hello', is_read: true, created_at: '2023-01-01' },
        { sender_id: 'user-1', recipient_id: 'current-user', message: 'Hi', is_read: false, created_at: '2023-01-02' },
        { sender_id: 'current-user', recipient_id: 'user-2', message: 'Hey', is_read: true, created_at: '2023-01-03' },
      ];
      
      // Mock user map
      const userMap = {
        'user-1': 'User 1',
        'user-2': 'User 2',
      };

      // Act
      const result = processConversations(messages, 'current-user', userMap);

      // Assert
      expect(result).toEqual([
        {
          user_id: 'user-2',
          user_name: 'User 2',
          last_message: 'Hey',
          unread_count: 0,
          last_message_time: '2023-01-03',
        },
        {
          user_id: 'user-1',
          user_name: 'User 1',
          last_message: 'Hi',
          unread_count: 1,
          last_message_time: '2023-01-02',
        },
      ]);
    });

    it('should handle unknown users', () => {
      // Mock messages with unknown user
      const messages = [
        { sender_id: 'current-user', recipient_id: 'unknown-user', message: 'Hello', is_read: true, created_at: '2023-01-01' },
      ];
      
      // Mock user map without the unknown user
      const userMap = {};

      // Act
      const result = processConversations(messages, 'current-user', userMap);

      // Assert
      expect(result).toEqual([
        {
          user_id: 'unknown-user',
          user_name: 'Unknown User',
          last_message: 'Hello',
          unread_count: 0,
          last_message_time: '2023-01-01',
        },
      ]);
    });
  });

  describe('enrichMessagesWithUserNames', () => {
    it('should add sender and recipient names to messages', () => {
      // Mock messages
      const messages = [
        { id: '1', sender_id: 'user-1', recipient_id: 'user-2', message: 'Hello', is_read: true, created_at: '2023-01-01', updated_at: '2023-01-01' },
      ];
      
      // Mock user map
      const userMap = {
        'user-1': 'User 1',
        'user-2': 'User 2',
      };

      // Act
      const result = enrichMessagesWithUserNames(messages, userMap);

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          sender_id: 'user-1',
          recipient_id: 'user-2',
          message: 'Hello',
          is_read: true,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          sender_name: 'User 1',
          recipient_name: 'User 2',
        },
      ]);
    });

    it('should handle unknown users', () => {
      // Mock messages with unknown users
      const messages = [
        { id: '1', sender_id: 'unknown-sender', recipient_id: 'unknown-recipient', message: 'Hello', is_read: true, created_at: '2023-01-01', updated_at: '2023-01-01' },
      ];
      
      // Mock user map without the unknown users
      const userMap = {};

      // Act
      const result = enrichMessagesWithUserNames(messages, userMap);

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          sender_id: 'unknown-sender',
          recipient_id: 'unknown-recipient',
          message: 'Hello',
          is_read: true,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          sender_name: 'Unknown User',
          recipient_name: 'Unknown User',
        },
      ]);
    });
  });
});
