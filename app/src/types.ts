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
      devices: {
        Row: {
          device: string
          device_id: string
          id: number
        }
        Insert: {
          device: string
          device_id: string
          id?: number
        }
        Update: {
          device?: string
          device_id?: string
          id?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          date: string
          id: number
          location: string | null
          name: string
        }
        Insert: {
          date: string
          id?: number
          location?: string | null
          name: string
        }
        Update: {
          date?: string
          id?: number
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          activated_at: string | null
          device: string | null
          event_id: number | null
          id: number
          ip_address: string | null
          license_key: string
        }
        Insert: {
          activated_at?: string | null
          device?: string | null
          event_id?: number | null
          id?: number
          ip_address?: string | null
          license_key: string
        }
        Update: {
          activated_at?: string | null
          device?: string | null
          event_id?: number | null
          id?: number
          ip_address?: string | null
          license_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_device_fkey"
            columns: ["device"]
            referencedRelation: "devices"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "licenses_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          event: number | null
          id: number
          question: number | null
          question_text: string | null
          rating: number | null
          rating_text: string | null
          voted_at: string
          voter: string | null
          voting_session: string | null
        }
        Insert: {
          event?: number | null
          id?: number
          question?: number | null
          question_text?: string | null
          rating?: number | null
          rating_text?: string | null
          voted_at?: string
          voter?: string | null
          voting_session?: string | null
        }
        Update: {
          event?: number | null
          id?: number
          question?: number | null
          question_text?: string | null
          rating?: number | null
          rating_text?: string | null
          voted_at?: string
          voter?: string | null
          voting_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_event_fkey"
            columns: ["event"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_fkey"
            columns: ["voter"]
            referencedRelation: "licenses"
            referencedColumns: ["license_key"]
          }
        ]
      }
      voting_session: {
        Row: {
          created_at: string
          event: number | null
          id: number
          session_id: string | null
          voter: string | null
        }
        Insert: {
          created_at?: string
          event?: number | null
          id?: number
          session_id?: string | null
          voter?: string | null
        }
        Update: {
          created_at?: string
          event?: number | null
          id?: number
          session_id?: string | null
          voter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_session_event_fkey"
            columns: ["event"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voting_session_voter_fkey"
            columns: ["voter"]
            referencedRelation: "licenses"
            referencedColumns: ["license_key"]
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