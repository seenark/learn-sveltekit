export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client: {
        Row: {
          city: string | null
          clientStatus: string | null
          createdAt: string
          email: string | null
          id: string
          name: string | null
          state: string | null
          street: string | null
          userId: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          clientStatus?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          name?: string | null
          state?: string | null
          street?: string | null
          userId: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          clientStatus?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          name?: string | null
          state?: string | null
          street?: string | null
          userId?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoice: {
        Row: {
          clientId: string | null
          createdAt: string
          discount: number | null
          dueDate: string | null
          id: string
          invoiceNumber: string | null
          invoiceStatus: string | null
          issueDate: string | null
          notes: string | null
          subject: string | null
          terms: string | null
          userId: string
        }
        Insert: {
          clientId?: string | null
          createdAt?: string
          discount?: number | null
          dueDate?: string | null
          id?: string
          invoiceNumber?: string | null
          invoiceStatus?: string | null
          issueDate?: string | null
          notes?: string | null
          subject?: string | null
          terms?: string | null
          userId: string
        }
        Update: {
          clientId?: string | null
          createdAt?: string
          discount?: number | null
          dueDate?: string | null
          id?: string
          invoiceNumber?: string | null
          invoiceStatus?: string | null
          issueDate?: string | null
          notes?: string | null
          subject?: string | null
          terms?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lineItems: {
        Row: {
          amount: number | null
          createdAt: string
          description: string | null
          id: string
          invoiceId: string | null
          quantity: number | null
          userId: string
        }
        Insert: {
          amount?: number | null
          createdAt?: string
          description?: string | null
          id?: string
          invoiceId?: string | null
          quantity?: number | null
          userId: string
        }
        Update: {
          amount?: number | null
          createdAt?: string
          description?: string | null
          id?: string
          invoiceId?: string | null
          quantity?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineItems_invoiceId_fkey"
            columns: ["invoiceId"]
            isOneToOne: false
            referencedRelation: "invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lineItems_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Settings: {
        Row: {
          city: string | null
          createdAt: string
          email: string | null
          id: string
          myName: string | null
          state: string | null
          street: string | null
          userId: string
        }
        Insert: {
          city?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          myName?: string | null
          state?: string | null
          street?: string | null
          userId: string
        }
        Update: {
          city?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          myName?: string | null
          state?: string | null
          street?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Settings_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
