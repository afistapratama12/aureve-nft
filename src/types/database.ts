export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          asset_type: string
          created_at: string | null
          creator_id: string | null
          creator_wallet: string
          description: string | null
          file_size: number | null
          full_cid: string
          id: string
          metadata_cid: string | null
          mime_type: string | null
          original_filename: string | null
          preview_cid: string
          price: number
          royalty_percentage: number | null
          status: string | null
          title: string
          token_id: number | null
          updated_at: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          creator_id?: string | null
          creator_wallet: string
          description?: string | null
          file_size?: number | null
          full_cid: string
          id?: string
          metadata_cid?: string | null
          mime_type?: string | null
          original_filename?: string | null
          preview_cid: string
          price: number
          royalty_percentage?: number | null
          status?: string | null
          title: string
          token_id?: number | null
          updated_at?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          creator_id?: string | null
          creator_wallet?: string
          description?: string | null
          file_size?: number | null
          full_cid?: string
          id?: string
          metadata_cid?: string | null
          mime_type?: string | null
          original_filename?: string | null
          preview_cid?: string
          price?: number
          royalty_percentage?: number | null
          status?: string | null
          title?: string
          token_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          amount: number | null
          asset_id: string | null
          chain_id: number
          id: string
          mint_block_number: number | null
          mint_transaction_hash: string
          minted_at: string | null
          owner_id: string | null
          owner_wallet: string
          token_id: number
        }
        Insert: {
          amount?: number | null
          asset_id?: string | null
          chain_id: number
          id?: string
          mint_block_number?: number | null
          mint_transaction_hash: string
          minted_at?: string | null
          owner_id?: string | null
          owner_wallet: string
          token_id: number
        }
        Update: {
          amount?: number | null
          asset_id?: string | null
          chain_id?: number
          id?: string
          mint_block_number?: number | null
          mint_transaction_hash?: string
          minted_at?: string | null
          owner_id?: string | null
          owner_wallet?: string
          token_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nfts_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      royalties: {
        Row: {
          amount_wei: number
          asset_id: string | null
          created_at: string | null
          creator_wallet: string
          id: string
          paid_at: string | null
          payout_transaction_hash: string | null
          percentage: number
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount_wei: number
          asset_id?: string | null
          created_at?: string | null
          creator_wallet: string
          id?: string
          paid_at?: string | null
          payout_transaction_hash?: string | null
          percentage: number
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount_wei?: number
          asset_id?: string | null
          created_at?: string | null
          creator_wallet?: string
          id?: string
          paid_at?: string | null
          payout_transaction_hash?: string | null
          percentage?: number
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "royalties_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "royalties_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          asset_id: string | null
          block_number: number | null
          chain_id: number
          created_at: string | null
          creator_payment_wei: number | null
          from_wallet: string | null
          id: string
          platform_fee_wei: number | null
          price_wei: number | null
          to_wallet: string
          token_id: number
          transaction_hash: string
          transaction_type: string
        }
        Insert: {
          amount: number
          asset_id?: string | null
          block_number?: number | null
          chain_id: number
          created_at?: string | null
          creator_payment_wei?: number | null
          from_wallet?: string | null
          id?: string
          platform_fee_wei?: number | null
          price_wei?: number | null
          to_wallet: string
          token_id: number
          transaction_hash: string
          transaction_type: string
        }
        Update: {
          amount?: number
          asset_id?: string | null
          block_number?: number | null
          chain_id?: number
          created_at?: string | null
          creator_payment_wei?: number | null
          from_wallet?: string | null
          id?: string
          platform_fee_wei?: number | null
          price_wei?: number | null
          to_wallet?: string
          token_id?: number
          transaction_hash?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          asset_id: string | null
          created_at: string | null
          creator_wallet: string
          id: string
          is_redeemed: boolean | null
          nonce: number
          price_wei: number
          redeemed_at: string | null
          royalty_bps: number
          signature: string
          token_id: number
          uri: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          creator_wallet: string
          id?: string
          is_redeemed?: boolean | null
          nonce: number
          price_wei: number
          redeemed_at?: string | null
          royalty_bps: number
          signature: string
          token_id: number
          uri: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          creator_wallet?: string
          id?: string
          is_redeemed?: boolean | null
          nonce?: number
          price_wei?: number
          redeemed_at?: string | null
          royalty_bps?: number
          signature?: string
          token_id?: number
          uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
