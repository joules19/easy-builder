import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import type { ContactInteractionInsert } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendor_id, interaction_type, interaction_value, user_agent, referrer } = body

    if (!vendor_id || !interaction_type) {
      return NextResponse.json(
        { error: 'vendor_id and interaction_type are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabaseClient()

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const contactData: ContactInteractionInsert = {
      vendor_id,
      interaction_type,
      interaction_value,
      user_ip: ip,
      user_agent,
      referrer
    }

    const { data, error } = await supabase
      .from('contact_interactions')
      .insert(contactData as any)
      .select()
      .single()

    if (error) {
      console.error('Error inserting contact interaction:', error)
      return NextResponse.json(
        { error: 'Failed to track contact interaction' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact interaction API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}