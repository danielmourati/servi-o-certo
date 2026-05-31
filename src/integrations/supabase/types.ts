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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          business_hours: string
          company_address: string
          company_city: string
          company_document: string
          company_email: string
          company_name: string
          company_phone: string
          created_at: string
          default_commission_pct: number
          id: string
          logo_url: string
          notify_email: string
          notify_new_request: boolean
          primary_color: string
          support_whatsapp: string
          updated_at: string
          whatsapp_api_token: string
          whatsapp_api_url: string
        }
        Insert: {
          business_hours?: string
          company_address?: string
          company_city?: string
          company_document?: string
          company_email?: string
          company_name?: string
          company_phone?: string
          created_at?: string
          default_commission_pct?: number
          id?: string
          logo_url?: string
          notify_email?: string
          notify_new_request?: boolean
          primary_color?: string
          support_whatsapp?: string
          updated_at?: string
          whatsapp_api_token?: string
          whatsapp_api_url?: string
        }
        Update: {
          business_hours?: string
          company_address?: string
          company_city?: string
          company_document?: string
          company_email?: string
          company_name?: string
          company_phone?: string
          created_at?: string
          default_commission_pct?: number
          id?: string
          logo_url?: string
          notify_email?: string
          notify_new_request?: boolean
          primary_color?: string
          support_whatsapp?: string
          updated_at?: string
          whatsapp_api_token?: string
          whatsapp_api_url?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      provider_categories: {
        Row: {
          category_id: string
          provider_id: string
        }
        Insert: {
          category_id: string
          provider_id: string
        }
        Update: {
          category_id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_categories_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_services: {
        Row: {
          provider_id: string
          service_id: string
        }
        Insert: {
          provider_id: string
          service_id: string
        }
        Update: {
          provider_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          availability: string
          bio: string
          city: string
          created_at: string
          document: string
          email: string
          id: string
          internal_rating: number
          name: string
          neighborhood: string
          phone: string
          photo_url: string
          portfolio: Json
          status: Database["public"]["Enums"]["provider_status"]
          team: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          availability?: string
          bio?: string
          city?: string
          created_at?: string
          document?: string
          email?: string
          id?: string
          internal_rating?: number
          name: string
          neighborhood?: string
          phone?: string
          photo_url?: string
          portfolio?: Json
          status?: Database["public"]["Enums"]["provider_status"]
          team?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          availability?: string
          bio?: string
          city?: string
          created_at?: string
          document?: string
          email?: string
          id?: string
          internal_rating?: number
          name?: string
          neighborhood?: string
          phone?: string
          photo_url?: string
          portfolio?: Json
          status?: Database["public"]["Enums"]["provider_status"]
          team?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          admin_notes: string
          category_id: string | null
          client_address: string
          client_city: string
          client_name: string
          client_neighborhood: string
          client_phone: string
          created_at: string
          description: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          preferred_date: string
          preferred_time: string
          provider_id: string | null
          provider_payment: number
          service_id: string | null
          service_value: number
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          admin_notes?: string
          category_id?: string | null
          client_address?: string
          client_city?: string
          client_name: string
          client_neighborhood?: string
          client_phone: string
          created_at?: string
          description?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          preferred_date?: string
          preferred_time?: string
          provider_id?: string | null
          provider_payment?: number
          service_id?: string | null
          service_value?: number
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          admin_notes?: string
          category_id?: string | null
          client_address?: string
          client_city?: string
          client_name?: string
          client_neighborhood?: string
          client_phone?: string
          created_at?: string
          description?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          preferred_date?: string
          preferred_time?: string
          provider_id?: string | null
          provider_payment?: number
          service_id?: string | null
          service_value?: number
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      payment_status:
        | "Pendente"
        | "Recebido"
        | "Pago ao prestador"
        | "Finalizado"
      provider_status: "Pendente" | "Ativo" | "Inativo"
      request_status:
        | "Novo"
        | "Em contato"
        | "Orçado"
        | "Atribuído"
        | "Em execução"
        | "Concluído"
        | "Cancelado"
      urgency_level: "Normal" | "Urgente" | "Emergencial"
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
    Enums: {
      app_role: ["admin", "user"],
      payment_status: [
        "Pendente",
        "Recebido",
        "Pago ao prestador",
        "Finalizado",
      ],
      provider_status: ["Pendente", "Ativo", "Inativo"],
      request_status: [
        "Novo",
        "Em contato",
        "Orçado",
        "Atribuído",
        "Em execução",
        "Concluído",
        "Cancelado",
      ],
      urgency_level: ["Normal", "Urgente", "Emergencial"],
    },
  },
} as const
