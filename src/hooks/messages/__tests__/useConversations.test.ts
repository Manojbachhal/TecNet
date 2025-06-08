
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useConversations } from '../useConversations';
import { supabase } from '@/integrations/supabase/client';
import * as messageUtils from '@/utils/message.utils';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
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
  processConversations: vi.fn(),
}));

describe('useConversations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty conversations by default', () => {
    const { result } = renderHook(() => useConversations());
    expect(result.current.conversations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch conversations when fetchConversations is called', async () => {
    // Mock supabase response
    const mockData = [
      { sender_id: 'test-user-id', recipient_id: 'other-user-id', message: 'Hello', created_at: '2023-01-01' },
      { sender_id: 'other-user-id', recipient_id: 'test-user-id', message: 'Hi', created_at: '2023-01-02' },
    ];
    
    supabase.from().select().or().order = vi.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });

    // Mock fetchUserProfiles response
    vi.mocked(messageUtils.fetchUserProfiles).mockResolvedValue({
      'other-user-id': 'John Doe',
    });

    // Mock processConversations response
    const mockConversations = [
      {
        user_id: 'other-user-id',
        user_name: 'John Doe',
        last_message: 'Hi',
        unread_count: 1,
        last_message_time: '2023-01-02',
      }
    ];
    vi.mocked(messageUtils.processConversations).mockReturnValue(mockConversations);

    const { result } = renderHook(() => useConversations());
    
    // Act
    await act(async () => {
      await result.current.fetchConversations();
    });

    // Assert
    expect(supabase.from).toHaveBeenCalledWith('direct_messages');
    expect(supabase.select).toHaveBeenCalledWith('*');
    expect(supabase.or).toHaveBeenCalledWith(`sender_id.eq.test-user-id,recipient_id.eq.test-user-id`);
    expect(supabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
    
    expect(messageUtils.fetchUserProfiles).toHaveBeenCalledWith(['other-user-id']);
    expect(messageUtils.processConversations).toHaveBeenCalledWith(mockData, 'test-user-id', { 'other-user-id': 'John Doe' });
    
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors when fetching conversations', async () => {
    // Mock supabase error response
    supabase.from().select().or().order = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch'),
    });

    const { result } = renderHook(() => useConversations());
    
    // Act
    await act(async () => {
      await result.current.fetchConversations();
    });

    // Assert
    expect(result.current.conversations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    // We'd check for toast being called with an error message here
  });
});
