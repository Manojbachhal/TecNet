export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      citations: {
        Row: {
          citation_text: string
          created_at: string
          discussion_id: string | null
          format: string
          id: string
          updated_at: string
        }
        Insert: {
          citation_text: string
          created_at?: string
          discussion_id?: string | null
          format: string
          id?: string
          updated_at?: string
        }
        Update: {
          citation_text?: string
          created_at?: string
          discussion_id?: string | null
          format?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "citations_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      classifieds: {
        Row: {
          contact_info: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          price: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      collection_discussions: {
        Row: {
          added_at: string
          collection_id: string
          discussion_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          discussion_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          discussion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_discussions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_discussions_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_tags: {
        Row: {
          discussion_id: string
          tag_id: string
        }
        Insert: {
          discussion_id: string
          tag_id: string
        }
        Update: {
          discussion_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_tags_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          created_at: string | null
          created_by: string | null
          first_speaker: Database["public"]["Enums"]["message_sender"]
          id: string
          max_turns: number
          personality: string
          status: Database["public"]["Enums"]["discussion_status"] | null
          title: string | null
          topic: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          first_speaker: Database["public"]["Enums"]["message_sender"]
          id?: string
          max_turns?: number
          personality: string
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title?: string | null
          topic: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          first_speaker?: Database["public"]["Enums"]["message_sender"]
          id?: string
          max_turns?: number
          personality?: string
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content_type: string
          created_at: string
          id: string
          name: string
          path: string
          size: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content_type: string
          created_at?: string
          id?: string
          name: string
          path: string
          size: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          name?: string
          path?: string
          size?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      firearms: {
        Row: {
          caliber: string | null
          condition: string | null
          created_at: string | null
          id: string
          image_url: string | null
          make: string
          model: string
          notes: string | null
          purchase_date: string | null
          serial_number: string
          updated_at: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          caliber?: string | null
          condition?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          make: string
          model: string
          notes?: string | null
          purchase_date?: string | null
          serial_number: string
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          caliber?: string | null
          condition?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          make?: string
          model?: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          acres_burned: number | null
          admin_unit: string | null
          county: string
          created_at: string
          external_url: string | null
          id: string
          incident_name: string
          latitude: number | null
          location: string | null
          longitude: number | null
          percent_contained: number | null
          start_date: string
          status: Database["public"]["Enums"]["incident_status"]
          unique_id: string | null
          updated_at: string
        }
        Insert: {
          acres_burned?: number | null
          admin_unit?: string | null
          county: string
          created_at?: string
          external_url?: string | null
          id?: string
          incident_name: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          percent_contained?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["incident_status"]
          unique_id?: string | null
          updated_at?: string
        }
        Update: {
          acres_burned?: number | null
          admin_unit?: string | null
          county?: string
          created_at?: string
          external_url?: string | null
          id?: string
          incident_name?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          percent_contained?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["incident_status"]
          unique_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          sender: Database["public"]["Enums"]["message_sender"]
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          sender: Database["public"]["Enums"]["message_sender"]
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          sender?: Database["public"]["Enums"]["message_sender"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          location_verified: boolean | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          location?: string | null
          location_verified?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          location_verified?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          report_type: string
          reporter_id: string
          status: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          report_type: string
          reporter_id: string
          status?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          report_type?: string
          reporter_id?: string
          status?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: Database["public"]["Enums"]["resource_category"]
          contact_info: string
          county: string
          created_at: string
          created_by: string | null
          description: string | null
          eligibility: string | null
          id: string
          resource_name: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["resource_category"]
          contact_info: string
          county: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          eligibility?: string | null
          id?: string
          resource_name: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["resource_category"]
          contact_info?: string
          county?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          eligibility?: string | null
          id?: string
          resource_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      trading_listings: {
        Row: {
          condition: string | null
          created_at: string
          description: string | null
          firearm_id: string | null
          id: string
          image_url: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string | null
          owner_id: string
          price: number | null
          reported: boolean | null
          seller_name: string | null
          seller_rating: number | null
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          description?: string | null
          firearm_id?: string | null
          id?: string
          image_url?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          owner_id: string
          price?: number | null
          reported?: boolean | null
          seller_name?: string | null
          seller_rating?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          description?: string | null
          firearm_id?: string | null
          id?: string
          image_url?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string | null
          owner_id?: string
          price?: number | null
          reported?: boolean | null
          seller_name?: string | null
          seller_rating?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_listings_firearm_id_fkey"
            columns: ["firearm_id"]
            isOneToOne: false
            referencedRelation: "firearms"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          created_at: string
          created_by: string | null
          current_signups: number | null
          description: string | null
          event_date: string
          event_name: string
          id: string
          location: string
          max_capacity: number | null
          organizer_contact: string
          required_skills: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_signups?: number | null
          description?: string | null
          event_date: string
          event_name: string
          id?: string
          location: string
          max_capacity?: number | null
          organizer_contact: string
          required_skills?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_signups?: number | null
          description?: string | null
          event_date?: string
          event_name?: string
          id?: string
          location?: string
          max_capacity?: number | null
          organizer_contact?: string
          required_skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_signups: {
        Row: {
          opportunity_id: string
          signup_date: string
          volunteer_id: string
        }
        Insert: {
          opportunity_id: string
          signup_date?: string
          volunteer_id: string
        }
        Update: {
          opportunity_id?: string
          signup_date?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_signups_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_signups_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_listing: {
        Args: {
          listing_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      discussion_status: "draft" | "published" | "archived"
      incident_status: "active" | "contained"
      listing_status: "active" | "sold" | "traded" | "inactive" | "cancelled"
      listing_type: "sale" | "trade" | "both"
      message_sender: "anthropic" | "openai"
      resource_category:
        | "housing"
        | "construction"
        | "legal_aid"
        | "medical"
        | "financial"
        | "mental_health"
        | "other"
      subscription_tier: "free" | "pro"
      user_role: "survivor" | "volunteer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
