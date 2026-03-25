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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      application_answers: {
        Row: {
          answer_text: string | null
          application_id: string | null
          id: string
          question_id: string | null
        }
        Insert: {
          answer_text?: string | null
          application_id?: string | null
          id?: string
          question_id?: string | null
        }
        Update: {
          answer_text?: string | null
          application_id?: string | null
          id?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_answers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "prescreen_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_message: string | null
          created_at: string | null
          id: string
          job_id: string | null
          resume_id: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_message?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          resume_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_message?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          resume_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cover_url: string | null
          created_at: string | null
          full_bio: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          short_bio: string | null
          size: string | null
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          full_bio?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          short_bio?: string | null
          size?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          full_bio?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          short_bio?: string | null
          size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_feed_posts: {
        Row: {
          author_id: string | null
          company_id: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_feed_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_feed_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["company_role"]
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["company_role"]
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["company_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_tags: {
        Row: {
          job_id: string
          tag_id: string
        }
        Insert: {
          job_id: string
          tag_id: string
        }
        Update: {
          job_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_tags_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          job_type: string | null
          level: string | null
          location: string | null
          qualifications: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          level?: string | null
          location?: string | null
          qualifications?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          level?: string | null
          location?: string | null
          qualifications?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescreen_questions: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          options: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          options?: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          options?: Json | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prescreen_questions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_tags: {
        Row: {
          profile_id: string
          tag_id: string
        }
        Insert: {
          profile_id: string
          tag_id: string
        }
        Update: {
          profile_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_tags_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          is_primary: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          is_primary?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_primary?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"]
          created_at?: string | null
          id?: string
          name?: string
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
      application_status:
        | "new"
        | "reviewing"
        | "interview"
        | "offered"
        | "hired"
        | "rejected"
      company_role: "admin" | "recruiter"
      job_status: "draft" | "active" | "paused" | "closed"
      question_type: "open_ended" | "multiple_choice"
      tag_category: "skill" | "industry" | "level" | "location" | "type"
      user_type: "seeker" | "company"
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
      application_status: [
        "new",
        "reviewing",
        "interview",
        "offered",
        "hired",
        "rejected",
      ],
      company_role: ["admin", "recruiter"],
      job_status: ["draft", "active", "paused", "closed"],
      question_type: ["open_ended", "multiple_choice"],
      tag_category: ["skill", "industry", "level", "location", "type"],
      user_type: ["seeker", "company"],
    },
  },
} as const
