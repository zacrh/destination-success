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
          device: string | null
          device_id: string
          id: number
          license_id: number | null
        }
        Insert: {
          device?: string | null
          device_id: string
          id?: number
          license_id?: number | null
        }
        Update: {
          device?: string | null
          device_id?: string
          id?: number
          license_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_license_id_fkey"
            columns: ["license_id"]
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          }
        ]
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
          event_id: number | null
          id: number
          license_key: string
        }
        Insert: {
          event_id?: number | null
          id?: number
          license_key: string
        }
        Update: {
          event_id?: number | null
          id?: number
          license_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
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