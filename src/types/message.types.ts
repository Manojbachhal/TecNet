import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  context_type?: "trading" | "classified";
  context_id?: string;
  sender_name?: string;
  recipient_name?: string;
};

export type Conversation = {
  chatName: ReactNode;
  user_id: string;
  user_name: string;
  last_message: string;
  unread_count: number;
  last_message_time: string;
  context_type?: "trading" | "classified";
  context_id?: string;
};

// Define the payload type to match the direct_messages table structure
export type DirectMessagePayload = RealtimePostgresChangesPayload<{
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  context_type?: "trading" | "classified";
  context_id?: string;
}>;
