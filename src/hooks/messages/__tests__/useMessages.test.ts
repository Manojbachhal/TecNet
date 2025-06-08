
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMessages } from '../../useMessages';
import { useConversations } from '../useConversations';
import { useMessageExchange } from '../useMessageExchange';
import { useRealtime } from '../useRealtime';

// Mock the individual hooks
vi.mock('../useConversations', () => ({
  useConversations: vi.fn(),
}));

vi.mock('../useMessageExchange', () => ({
  useMessageExchange: vi.fn(),
}));

vi.mock('../useRealtime', () => ({
  useRealtime: vi.fn(),
}));

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should combine all hooks correctly', () => {
    // Mock return values for each hook
    const mockConversations = [
      { user_id: 'user-1', user_name: 'User 1', last_message: 'Hello', unread_count: 0, last_message_time: '2023-01-01' }
    ];
    const mockFetchConversations = vi.fn();
    
    vi.mocked(useConversations).mockReturnValue({
      conversations: mockConversations,
      isLoading: false,
      fetchConversations: mockFetchConversations
    });

    const mockMessages = [
      { id: '1', sender_id: 'test-user', recipient_id: 'user-1', message: 'Hello', is_read: true, created_at: '2023-01-01', updated_at: '2023-01-01' }
    ];
    const mockFetchMessages = vi.fn();
    const mockSendMessage = vi.fn();
    const mockSetCurrentConversation = vi.fn();
    
    vi.mocked(useMessageExchange).mockReturnValue({
      messages: mockMessages,
      currentConversation: 'user-1',
      isLoading: false,
      fetchMessages: mockFetchMessages,
      sendMessage: mockSendMessage,
      setCurrentConversation: mockSetCurrentConversation
    });

    // Act
    const { result } = renderHook(() => useMessages());

    // Assert
    expect(useConversations).toHaveBeenCalled();
    expect(useMessageExchange).toHaveBeenCalledWith(mockFetchConversations);
    expect(useRealtime).toHaveBeenCalledWith('user-1', mockFetchConversations, mockFetchMessages);
    
    expect(result.current.conversations).toBe(mockConversations);
    expect(result.current.messages).toBe(mockMessages);
    expect(result.current.currentConversation).toBe('user-1');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchConversations).toBe(mockFetchConversations);
    expect(result.current.fetchMessages).toBe(mockFetchMessages);
    expect(result.current.sendMessage).toBe(mockSendMessage);
    expect(result.current.setCurrentConversation).toBe(mockSetCurrentConversation);
  });

  it('should handle loading state correctly', () => {
    // Set one of the hooks to loading state
    vi.mocked(useConversations).mockReturnValue({
      conversations: [],
      isLoading: true,
      fetchConversations: vi.fn()
    });

    vi.mocked(useMessageExchange).mockReturnValue({
      messages: [],
      currentConversation: null,
      isLoading: false,
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      setCurrentConversation: vi.fn()
    });

    // Act
    const { result } = renderHook(() => useMessages());

    // Assert
    expect(result.current.isLoading).toBe(true);
    
    // Set the other hook to loading state
    vi.mocked(useConversations).mockReturnValue({
      conversations: [],
      isLoading: false,
      fetchConversations: vi.fn()
    });

    vi.mocked(useMessageExchange).mockReturnValue({
      messages: [],
      currentConversation: null,
      isLoading: true,
      fetchMessages: vi.fn(),
      sendMessage: vi.fn(),
      setCurrentConversation: vi.fn()
    });
    
    // Re-render
    const { result: updatedResult } = renderHook(() => useMessages());
    
    // Assert again
    expect(updatedResult.current.isLoading).toBe(true);
  });
});
