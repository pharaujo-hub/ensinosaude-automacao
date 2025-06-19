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
      acompanhamentos: {
        Row: {
          data_acompanhamento: string | null
          fez_acompanhamento: string | null
          id: string
          nome_paciente: string | null
          numero_paciente: string | null
        }
        Insert: {
          data_acompanhamento?: string | null
          fez_acompanhamento?: string | null
          id?: string
          nome_paciente?: string | null
          numero_paciente?: string | null
        }
        Update: {
          data_acompanhamento?: string | null
          fez_acompanhamento?: string | null
          id?: string
          nome_paciente?: string | null
          numero_paciente?: string | null
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
          data_cancelamento: string | null
          data_fim: string
          data_inicio: string
          data_lembre1: string | null
          data_lembre2: string | null
          evento_id: string
          id: number
          nome: string
          remotejid: string
          status_agendamento: string
          url_agenda: string
        }
        Insert: {
          data_cancelamento?: string | null
          data_fim: string
          data_inicio: string
          data_lembre1?: string | null
          data_lembre2?: string | null
          evento_id: string
          id?: never
          nome: string
          remotejid: string
          status_agendamento: string
          url_agenda: string
        }
        Update: {
          data_cancelamento?: string | null
          data_fim?: string
          data_inicio?: string
          data_lembre1?: string | null
          data_lembre2?: string | null
          evento_id?: string
          id?: never
          nome?: string
          remotejid?: string
          status_agendamento?: string
          url_agenda?: string
        }
        Relationships: []
      }
      agendamentos_academia: {
        Row: {
          data_fim: string | null
          data_inicio: string | null
          event_id: string | null
          followup: string | null
          id: number
          nome_cliente: string | null
          numero_cliente: string | null
        }
        Insert: {
          data_fim?: string | null
          data_inicio?: string | null
          event_id?: string | null
          followup?: string | null
          id?: number
          nome_cliente?: string | null
          numero_cliente?: string | null
        }
        Update: {
          data_fim?: string | null
          data_inicio?: string | null
          event_id?: string | null
          followup?: string | null
          id?: number
          nome_cliente?: string | null
          numero_cliente?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          descricao_reuniao: string | null
          id: string
          name: string | null
          remotejid: string | null
          response_id: string | null
          reunião_fim: string | null
          reunião_inicio: string | null
          timestamp: string | null
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          descricao_reuniao?: string | null
          id?: string
          name?: string | null
          remotejid?: string | null
          response_id?: string | null
          reunião_fim?: string | null
          reunião_inicio?: string | null
          timestamp?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          descricao_reuniao?: string | null
          id?: string
          name?: string | null
          remotejid?: string | null
          response_id?: string | null
          reunião_fim?: string | null
          reunião_inicio?: string | null
          timestamp?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          descricao: string | null
          id: string
          nome: string | null
          tool: Json | null
          type: string | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          nome?: string | null
          tool?: Json | null
          type?: string | null
        }
        Update: {
          descricao?: string | null
          id?: string
          nome?: string | null
          tool?: Json | null
          type?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
