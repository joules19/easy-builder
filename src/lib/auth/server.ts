import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { Vendor } from '@/types/database'

// Cache the authentication check for the duration of the request
export const requireAuth = cache(async () => {
  const supabase = createServerSupabaseClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return session
})

// Get current vendor for authenticated user
export const getVendor = cache(async (): Promise<Vendor> => {
  const session = await requireAuth()
  const supabase = createServerSupabaseClient()
  
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error || !vendor) {
    // If no vendor exists, redirect to profile setup
    redirect('/auth/setup-profile')
  }

  return vendor
})

// Get vendor by ID (for dashboard access)
export const getVendorById = cache(async (vendorId: string): Promise<Vendor> => {
  const session = await requireAuth()
  const supabase = createServerSupabaseClient()
  
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .eq('user_id', session.user.id) // Ensure user owns this vendor
    .single()

  if (error || !vendor) {
    redirect('/dashboard')
  }

  return vendor
})

// Check if user has completed vendor setup
export const checkVendorSetup = cache(async () => {
  const session = await requireAuth()
  const supabase = createServerSupabaseClient()
  
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, status, name')
    .eq('user_id', session.user.id)
    .single()

  return {
    hasVendor: !!vendor,
    isActive: (vendor as any)?.status === 'active',
    vendor
  }
})

// Optional auth - for pages that work with or without auth
export const getOptionalAuth = cache(async () => {
  const supabase = createServerSupabaseClient()
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  } catch {
    return null
  }
})