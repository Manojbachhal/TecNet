
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRealtime } from '../useRealtime';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn(),
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

describe('useRealtime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set up a realtime subscription when user is logged in', () => {
    // Arrange
    const mockFetchConversations = vi.fn();
    const mockFetchMessages = vi.fn();
    
    // Act
    renderHook(() => useRealtime('other-user-id', mockFetchConversations, mockFetchMessages));
    
    // Assert
    expect(supabase.channel).toHaveBeenCalledWith('direct-messages-changes');
    expect(supabase.on).toHaveBeenCalledWith(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'direct_messages', 
        filter: `recipient_id=eq.test-user-id` 
      },
      expect.any(Function)
    );
    expect(supabase.subscribe).toHaveBeenCalled();
  });

  it('should not set up a realtime subscription when user is not logged in', () => {
    // Mock user as null
    vi.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
      }),
    }), { virtual: true });
    
    // Arrange
    const mockFetchConversations = vi.fn();
    const mockFetchMessages = vi.fn();
    
    // Act
    renderHook(() => useRealtime(null, mockFetchConversations, mockFetchMessages));
    
    // Assert
    expect(supabase.channel).not.toHaveBeenCalled();
  });

  it('should unsubscribe when component unmounts', () => {
    // Arrange
    const mockFetchConversations = vi.fn();
    const mockFetchMessages = vi.fn();
    const mockUnsubscribe = vi.fn();
    
    supabase.subscribe = vi.fn().mockReturnValue({
      unsubscribe: mockUnsubscribe
    });
    
    // Act
    const { unmount } = renderHook(() => useRealtime('other-user-id', mockFetchConversations, mockFetchMessages));
    unmount();
    
    // Assert
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
