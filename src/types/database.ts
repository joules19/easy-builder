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
      vendors: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          email: string
          phone: string
          address: string | null
          website: string | null
          logo_url: string | null
          qr_code_url: string | null
          qr_code_generated_at: string | null
          qr_scan_count: number
          operating_hours: Json | null
          social_media: Json | null
          contact_preferences: Json | null
          status: 'pending' | 'active' | 'suspended' | 'archived'
          plan_type: 'free' | 'premium' | 'enterprise'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          email: string
          phone: string
          address?: string | null
          website?: string | null
          logo_url?: string | null
          qr_code_url?: string | null
          qr_code_generated_at?: string | null
          qr_scan_count?: number
          operating_hours?: Json | null
          social_media?: Json | null
          contact_preferences?: Json | null
          status?: 'pending' | 'active' | 'suspended' | 'archived'
          plan_type?: 'free' | 'premium' | 'enterprise'
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          email?: string
          phone?: string
          address?: string | null
          website?: string | null
          logo_url?: string | null
          qr_code_url?: string | null
          qr_code_generated_at?: string | null
          qr_scan_count?: number
          operating_hours?: Json | null
          social_media?: Json | null
          contact_preferences?: Json | null
          status?: 'pending' | 'active' | 'suspended' | 'archived'
          plan_type?: 'free' | 'premium' | 'enterprise'
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      categories: {
        Row: {
          id: string
          vendor_id: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number | null
          sku: string | null
          status: 'draft' | 'active' | 'inactive' | 'archived'
          view_count: number
          search_vector: unknown | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price?: number | null
          sku?: string | null
          status?: 'draft' | 'active' | 'inactive' | 'archived'
          view_count?: number
          search_vector?: unknown | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number | null
          sku?: string | null
          status?: 'draft' | 'active' | 'inactive' | 'archived'
          view_count?: number
          search_vector?: unknown | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          display_order: number
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          display_order?: number
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          display_order?: number
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
      qr_scans: {
        Row: {
          id: string
          vendor_id: string
          scanned_at: string
          user_agent: string | null
          referrer: string | null
          ip_address: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          country: string | null
          city: string | null
        }
        Insert: {
          id?: string
          vendor_id: string
          scanned_at?: string
          user_agent?: string | null
          referrer?: string | null
          ip_address?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          country?: string | null
          city?: string | null
        }
        Update: {
          id?: string
          vendor_id?: string
          scanned_at?: string
          user_agent?: string | null
          referrer?: string | null
          ip_address?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          country?: string | null
          city?: string | null
        }
      }
      contact_interactions: {
        Row: {
          id: string
          vendor_id: string
          interaction_type: 'phone' | 'email' | 'location' | 'social' | 'whatsapp'
          interaction_value: string | null
          user_ip: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          interaction_type: 'phone' | 'email' | 'location' | 'social' | 'whatsapp'
          interaction_value?: string | null
          user_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          interaction_type?: 'phone' | 'email' | 'location' | 'social' | 'whatsapp'
          interaction_value?: string | null
          user_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          vendor_id: string
          page_path: string | null
          page_title: string | null
          visitor_id: string | null
          session_id: string | null
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          load_time: number | null
          viewed_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          page_path?: string | null
          page_title?: string | null
          visitor_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          load_time?: number | null
          viewed_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          page_path?: string | null
          page_title?: string | null
          visitor_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          load_time?: number | null
          viewed_at?: string
        }
      }
    }
    Views: {
      vendor_stats: {
        Row: {
          id: string | null
          name: string | null
          slug: string | null
          status: 'pending' | 'active' | 'suspended' | 'archived' | null
          created_at: string | null
          product_count: number | null
          category_count: number | null
          qr_scans: number | null
          contacts_last_30_days: number | null
        }
      }
    }
    Functions: {
      generate_unique_slug: {
        Args: {
          vendor_name: string
        }
        Returns: string
      }
      get_vendor_analytics: {
        Args: {
          vendor_uuid: string
          days?: number
        }
        Returns: Json
      }
    }
  }
}

// Type helpers
export type Vendor = Database['public']['Tables']['vendors']['Row']
export type VendorInsert = Database['public']['Tables']['vendors']['Insert']
export type VendorUpdate = Database['public']['Tables']['vendors']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']

export type QRScan = Database['public']['Tables']['qr_scans']['Row']
export type QRScanInsert = Database['public']['Tables']['qr_scans']['Insert']

export type ContactInteraction = Database['public']['Tables']['contact_interactions']['Row']
export type ContactInteractionInsert = Database['public']['Tables']['contact_interactions']['Insert']

export type PageView = Database['public']['Tables']['page_views']['Row']
export type PageViewInsert = Database['public']['Tables']['page_views']['Insert']

export type VendorStats = Database['public']['Views']['vendor_stats']['Row']

// Extended types with relationships
export type ProductWithImages = Product & {
  product_images: ProductImage[]
}

export type CategoryWithProducts = Category & {
  products: ProductWithImages[]
}

export type VendorWithCategories = Vendor & {
  categories: CategoryWithProducts[]
}

export type VendorPublicInfo = Pick<
  Vendor,
  'id' | 'slug' | 'name' | 'description' | 'email' | 'phone' | 'address' | 
  'website' | 'logo_url' | 'operating_hours' | 'social_media' | 'contact_preferences'
>