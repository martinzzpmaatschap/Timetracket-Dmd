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
      employees: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          location: string
          start_date: string
          end_date: string | null
          status: string
          budget: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          start_date: string
          end_date?: string | null
          status?: string
          budget?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          start_date?: string
          end_date?: string | null
          status?: string
          budget?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          date: string
          start_time: string
          end_time: string
          break_duration: number
          overtime_hours: number | null
          notes: string | null
          project_id: string
          employee_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time: string
          end_time: string
          break_duration?: number
          overtime_hours?: number | null
          notes?: string | null
          project_id: string
          employee_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string
          end_time?: string
          break_duration?: number
          overtime_hours?: number | null
          notes?: string | null
          project_id?: string
          employee_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      costs: {
        Row: {
          id: string
          type: string
          amount: number
          category: string
          description: string | null
          project_id: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          amount: number
          category?: string
          description?: string | null
          project_id: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          amount?: number
          category?: string
          description?: string | null
          project_id?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}