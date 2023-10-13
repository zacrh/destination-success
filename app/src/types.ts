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
        }
        Insert: {
          device?: string | null
          device_id: string
          id?: number
        }
        Update: {
          device?: string | null
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