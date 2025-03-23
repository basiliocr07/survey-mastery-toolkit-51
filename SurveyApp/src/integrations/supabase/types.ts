
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
      surveys: {
        Row: {
          id: string
          title: string
          description: string | null
          questions: Json
          created_at: string
          delivery_config: Json | null
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          questions: Json
          created_at?: string
          delivery_config?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          questions?: Json
          created_at?: string
          delivery_config?: Json | null
        }
      }
      survey_responses: {
        Row: {
          id: string
          survey_id: string
          respondent_name: string
          respondent_email: string
          respondent_phone: string | null
          respondent_company: string | null
          submitted_at: string
          answers: Json
          is_existing_client: boolean | null
          existing_client_id: string | null
          completion_time: number | null
        }
        Insert: {
          id: string
          survey_id: string
          respondent_name: string
          respondent_email: string
          respondent_phone?: string | null
          respondent_company?: string | null
          submitted_at?: string
          answers: Json
          is_existing_client?: boolean | null
          existing_client_id?: string | null
          completion_time?: number | null
        }
        Update: {
          id?: string
          survey_id?: string
          respondent_name?: string
          respondent_email?: string
          respondent_phone?: string | null
          respondent_company?: string | null
          submitted_at?: string
          answers?: Json
          is_existing_client?: boolean | null
          existing_client_id?: string | null
          completion_time?: number | null
        }
      }
    }
  }
}
