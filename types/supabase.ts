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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      application_status_history: {
        Row: {
          application_id: string
          changed_at: string
          changed_by: string
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
        }
        Insert: {
          application_id: string
          changed_at?: string
          changed_by: string
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
        }
        Update: {
          application_id?: string
          changed_at?: string
          changed_by?: string
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_notes: {
        Row: {
          author_id: string
          candidate_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          candidate_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          candidate_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_notes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          availability_date: string | null
          city: string | null
          company_id: string
          country: string | null
          created_at: string | null
          created_by: string
          current_company: string | null
          current_position: string | null
          education: string | null
          email: string | null
          expected_salary_max: number | null
          expected_salary_min: number | null
          experience_years: number | null
          first_name: string | null
          github_url: string | null
          id: string
          languages: string[] | null
          last_name: string | null
          linkedin_url: string | null
          notice_period: string | null
          phone: string | null
          relocation_willingness: boolean | null
          remote_work_preference:
            | Database["public"]["Enums"]["remote_work_preference"]
            | null
          resume_url: string | null
          salary_currency: string | null
          salary_period: Database["public"]["Enums"]["salary_period"] | null
          skills: string[] | null
          updated_at: string | null
          visa_status: Database["public"]["Enums"]["visa_status"] | null
        }
        Insert: {
          availability_date?: string | null
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string | null
          created_by: string
          current_company?: string | null
          current_position?: string | null
          education?: string | null
          email?: string | null
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_years?: number | null
          first_name?: string | null
          github_url?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          phone?: string | null
          relocation_willingness?: boolean | null
          remote_work_preference?:
            | Database["public"]["Enums"]["remote_work_preference"]
            | null
          resume_url?: string | null
          salary_currency?: string | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          skills?: string[] | null
          updated_at?: string | null
          visa_status?: Database["public"]["Enums"]["visa_status"] | null
        }
        Update: {
          availability_date?: string | null
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string | null
          created_by?: string
          current_company?: string | null
          current_position?: string | null
          education?: string | null
          email?: string | null
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          experience_years?: number | null
          first_name?: string | null
          github_url?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          notice_period?: string | null
          phone?: string | null
          relocation_willingness?: boolean | null
          remote_work_preference?:
            | Database["public"]["Enums"]["remote_work_preference"]
            | null
          resume_url?: string | null
          salary_currency?: string | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          skills?: string[] | null
          updated_at?: string | null
          visa_status?: Database["public"]["Enums"]["visa_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company_id: string
          contact_person: string | null
          created_at: string | null
          created_by: string
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          contact_person?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          contact_person?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      early_access_applications: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          ip: string | null
          name: string
          pain_points: string | null
          referrer: string | null
          team_size: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          ip?: string | null
          name: string
          pain_points?: string | null
          referrer?: string | null
          team_size?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          ip?: string | null
          name?: string
          pain_points?: string | null
          referrer?: string | null
          team_size?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          company_id: string
          created_at: string | null
          created_by: string
          duration_minutes: number | null
          id: string
          interview_type: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id: string | null
          job_id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["interview_status"] | null
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          company_id: string
          created_at?: string | null
          created_by: string
          duration_minutes?: number | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id?: string | null
          job_id: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          company_id?: string
          created_at?: string | null
          created_by?: string
          duration_minutes?: number | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"] | null
          interviewer_id?: string | null
          job_id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string | null
          candidate_id: string
          company_id: string
          created_at: string | null
          created_by: string
          id: string
          job_id: string
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          candidate_id: string
          company_id: string
          created_at?: string | null
          created_by: string
          id?: string
          job_id: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          candidate_id?: string
          company_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          job_id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          client_id: string | null
          company_id: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"] | null
          location: string | null
          min_experience_period: string | null
          min_experience_value: number | null
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: Database["public"]["Enums"]["salary_period"] | null
          skills: string[] | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          work_format: Database["public"]["Enums"]["work_format"]
        }
        Insert: {
          client_id?: string | null
          company_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          min_experience_period?: string | null
          min_experience_value?: number | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          work_format?: Database["public"]["Enums"]["work_format"]
        }
        Update: {
          client_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          min_experience_period?: string | null
          min_experience_value?: number | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: Database["public"]["Enums"]["salary_period"] | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          work_format?: Database["public"]["Enums"]["work_format"]
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
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
      profiles: {
        Row: {
          company_id: string
          created_at: string | null
          current_company_id: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan_enum"]
            | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          current_company_id: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan_enum"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          current_company_id?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan_enum"]
            | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status_enum"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_current_company_id_fkey"
            columns: ["current_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          company_id: string
          created_at: string | null
          entity_type: string
          id: string
          name: string
          search_criteria: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          entity_type: string
          id?: string
          name: string
          search_criteria: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          entity_type?: string
          id?: string
          name?: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          company_id: string
          company_name: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          token: string
          used_at: string | null
        }
        Insert: {
          company_id: string
          company_name: string
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          token?: string
          used_at?: string | null
        }
        Update: {
          company_id?: string
          company_name?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_team_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
      get_current_user_role: { Args: never; Returns: string }
      get_user_companies: {
        Args: never
        Returns: {
          company_id: string
          company_name: string
          is_current: boolean
          joined_at: string
          user_role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_user_company_id: { Args: never; Returns: string }
      get_user_role_in_company: {
        Args: { company_id_param: string; user_id_param: string }
        Returns: string
      }
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      switch_company: { Args: { target_company_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "team_member" | "restricted_team_member"
      application_status:
        | "new"
        | "under_review"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
        | "withdrawn"
      interview_status: "scheduled" | "completed" | "cancelled" | "no_show"
      interview_type: "phone" | "video" | "onsite" | "technical"
      job_status: "open" | "closed" | "on_hold" | "filled"
      job_type:
        | "full-time"
        | "part-time"
        | "contract"
        | "temporary"
        | "internship"
      remote_work_preference: "remote" | "hybrid" | "onsite"
      salary_period: "yearly" | "monthly"
      subscription_plan_enum: "individual" | "team" | "team_extended"
      subscription_status_enum: "trial" | "active" | "expired" | "cancelled"
      visa_status:
        | "citizen"
        | "permanent_resident"
        | "work_visa"
        | "student_visa"
        | "requires_sponsorship"
      work_format: "remote" | "hybrid" | "onsite"
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
      app_role: ["owner", "admin", "team_member", "restricted_team_member"],
      application_status: [
        "new",
        "under_review",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      interview_status: ["scheduled", "completed", "cancelled", "no_show"],
      interview_type: ["phone", "video", "onsite", "technical"],
      job_status: ["open", "closed", "on_hold", "filled"],
      job_type: [
        "full-time",
        "part-time",
        "contract",
        "temporary",
        "internship",
      ],
      remote_work_preference: ["remote", "hybrid", "onsite"],
      salary_period: ["yearly", "monthly"],
      subscription_plan_enum: ["individual", "team", "team_extended"],
      subscription_status_enum: ["trial", "active", "expired", "cancelled"],
      visa_status: [
        "citizen",
        "permanent_resident",
        "work_visa",
        "student_visa",
        "requires_sponsorship",
      ],
      work_format: ["remote", "hybrid", "onsite"],
    },
  },
} as const
