import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'
import { Vendor, VendorWithCategories, VendorPublicInfo } from '@/types/database'
import { cache } from 'react'

// Server-side functions (for SSR/SSG)
export const getVendorBySlug = cache(async (slug: string): Promise<VendorPublicInfo | null> => {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('vendors')
    .select('id, slug, name, description, email, phone, address, website, logo_url, operating_hours, social_media, contact_preferences')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return null
  }

  return data
})

export const getVendorWithCategories = cache(async (slug: string): Promise<VendorWithCategories | null> => {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      *,
      categories:categories(
        id,
        name,
        description,
        display_order,
        is_active,
        products:products(
          id,
          name,
          description,
          price,
          sku,
          status,
          view_count,
          created_at,
          product_images(url, alt_text, display_order)
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('categories.is_active', true)
    .eq('categories.products.status', 'active')
    .order('display_order', { foreignTable: 'categories' })
    .order('created_at', { foreignTable: 'categories.products', ascending: false })
    .single()

  if (error || !data) {
    return null
  }

  return data as VendorWithCategories
})

export const getActiveVendors = cache(async (limit = 100): Promise<VendorPublicInfo[]> => {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('vendors')
    .select('id, slug, name, description, email, phone, address, website, logo_url, operating_hours, social_media, contact_preferences')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return data || []
})

// Client-side functions
export async function getVendorProducts(vendorId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(url, alt_text, display_order),
      categories(name)
    `)
    .eq('vendor_id', vendorId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function updateVendorProfile(vendorId: string, updates: Partial<Vendor>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', vendorId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function checkSlugAvailability(slug: string, excludeVendorId?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('vendors')
    .select('id')
    .eq('slug', slug)

  if (excludeVendorId) {
    query = query.neq('id', excludeVendorId)
  }

  const { data, error } = await query.single()

  if (error && error.code !== 'PGRST116') { // Not found is expected
    throw new Error(error.message)
  }

  return !data // Available if no data found
}

// Analytics functions
export async function incrementQRScanCount(vendorId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('vendors')
    .update({ qr_scan_count: supabase.raw('qr_scan_count + 1') })
    .eq('id', vendorId)

  if (error) {
    console.error('Error incrementing QR scan count:', error)
  }
}

export async function trackQRScan(vendorId: string, scanData: {
  user_agent?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}) {
  const supabase = createClient()
  
  // Get client IP (this would typically be done server-side)
  const response = await fetch('/api/get-client-ip')
  const { ip } = await response.json()

  const { error } = await supabase
    .from('qr_scans')
    .insert({
      vendor_id: vendorId,
      ip_address: ip,
      ...scanData
    })

  if (error) {
    console.error('Error tracking QR scan:', error)
  }
}

export async function getVendorAnalytics(vendorId: string, days = 30) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_vendor_analytics', {
      vendor_uuid: vendorId,
      days
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}