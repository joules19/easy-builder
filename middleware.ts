import { createMiddlewareSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient(req, res)

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()


  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('next', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    // Always allow auth callback page
    if (req.nextUrl.pathname.includes('/callback')) {
      return res
    }

    // If user is authenticated, redirect away from auth pages
    if (session) {
      // Don't allow access to login, signup, or other auth pages when already logged in
      if (req.nextUrl.pathname === '/auth/login' || 
          req.nextUrl.pathname === '/auth/signup') {
        
        // Check if user has completed vendor setup
        try {
          const { data: vendor, error } = await supabase
            .from('vendors')
            .select('id, status')
            .eq('user_id', session.user.id)
            .single()

          if (error || !vendor) {
            return NextResponse.redirect(new URL('/auth/setup-profile', req.url))
          } else {
            return NextResponse.redirect(new URL('/dashboard', req.url))
          }
        } catch (err) {
          return NextResponse.redirect(new URL('/auth/setup-profile', req.url))
        }
      }
    }
  }

  // Check if user needs to complete vendor setup
  if (req.nextUrl.pathname === '/auth/setup-profile') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    
    // Check if vendor profile already exists
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (vendor) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}