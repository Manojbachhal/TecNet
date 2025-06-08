
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMessageExchange } from '../useMessageExchange';
import { supabase } from '@/integrations/supabase/client';
import * as messageUtils from '@/utils/message.utils';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/utils/message.utils', () => ({
  fetchUserProfiles: vi.fn(),
  markMessagesAsRead: vi.fn(),
  enrichMessagesWithUserNames: vi.fn(),
}));

describe('useMessageExchange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty messages by default', () => {
    const mockConversationsUpdate = vi.fn();
    const { result } = renderHook(() => useMessageExchange(mockConversationsUpdate));
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.currentConversation).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch messages when fetchMessages is called', async () => {
    // Mock supabase response
    const mockMessages = [
      { id: '1', sender_id: 'test-user-id', recipient_id: 'other-user-id', message: 'Hello', created_at: '2023-01-01' },
      { id: '2', sender_id: 'other-user-id', recipient_id: 'test-user-id', message: 'Hi', created_at: '2023-01-02' },
    ];
    
    supabase.from().select().or().order = vi.fn().mockResolvedValue({
      data: mockMessages,
      error: null,
    });

    // Mock fetchUserProfiles response
    vi.mocked(messageUtils.fetchUserProfiles).mockResolvedValue({
      'test-user-id': 'Current User',
      'other-user-id': 'John Doe',
    });

    // Mock markMessagesAsRead to return true
    vi.mocked(messageUtils.markMessagesAsRead).mockResolvedValue(true);

    // Mock enrichMessagesWithUserNames
    const enrichedMessages = [
      { id: '1', sender_id: 'test-user-id', recipient_id: 'other-user-id', message: 'Hello', created_at: '2023-01-01', sender_name: 'Current User', recipient_name: 'John Doe' },
      { id: '2', sender_id: 'other-user-id', recipient_id: 'test-user-id', message: 'Hi', created_at: '2023-01-02', sender_name: 'John Doe', recipient_name: 'Current User' },
    ];
    vi.mocked(messageUtils.enrichMessagesWithUserNames).mockReturnValue(enrichedMessages);

    const mockConversationsUpdate = vi.fn();
    const { result } = renderHook(() => useMessageExchange(mockConversationsUpdate));
    
    // Act
    await act(async () => {
      await result.current.fetchMessages('other-user-id');
    });

    // Assert
    expect(supabase.from).toHaveBeenCalledWith('direct_messages');
    expect(supabase.select).toHaveBeenCalledWith('*');
    expect(supabase.or).toHaveBeenCalledWith(`and(sender_id.eq.test-user-id,recipient_id.eq.other-user-id),and(sender_id.eq.other-user-id,recipient_id.eq.test-user-id)`);
    expect(supabase.order).toHaveBeenCalledWith('created_at', { ascending: true });
    
    expect(messageUtils.markMessagesAsRead).toHaveBeenCalledWith(mockMessages, 'test-user-id');
    expect(mockConversationsUpdate).toHaveBeenCalled();
    expect(messageUtils.fetchUserProfiles).toHaveBeenCalledWith(['test-user-id', 'other-user-id']);
    expect(messageUtils.enrichMessagesWithUserNames).toHaveBeenCalledWith(mockMessages, { 'test-user-id': 'Current User', 'other-user-id': 'John Doe' });
    
    expect(result.current.messages).toEqual(enrichedMessages);
    expect(result.current.currentConversation).toBe('other-user-id');
    expect(result.current.isLoading).toBe(false);
  });

  it('should send a message when sendMessage is called', async () => {
    // Mock supabase response for insert
    const mockSentMessage = {
      id: '3',
      sender_id: 'test-user-id',
      recipient_id: 'other-user-id',
      message: 'New message',
      is_read: false,
      created_at: '2023-01-03'
    };
    
    supabase.from().insert().select().single = vi.fn().mockResolvedValue({
      data: mockSentMessage,
      error: null,
    });

    const mockConversationsUpdate = vi.fn();
    const mockFetchMessages = vi.fn();
    
    const { result } = renderHook(() => useMessageExchange(mockConversationsUpdate));
    
    // Mock the fetchMessages method within the hook
    result.current.fetchMessages = mockFetchMessages;
    
    // Act
    await act(async () => {
      const success = await result.current.sendMessage('other-user-id', 'New message');
      
      // Assert
      expect(success).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('direct_messages');
      expect(supabase.insert).toHaveBeenCalledWith({
        sender_id: 'test-user-id',
        recipient_id: 'other-user-id',
        message: 'New message',
        is_read: false
      });
      expect(mockFetchMessages).toHaveBeenCalledWith('other-user-id');
      expect(mockConversationsUpdate).toHaveBeenCalled();
    });
  });
});
