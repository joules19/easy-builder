'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthGuard({ 
  children, 
  redirectTo = '/dashboard', 
  requireAuth = false 
}: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (requireAuth && !session) {
        // User should be authenticated but isn't
        router.push('/auth/login')
        return
      }

      if (!requireAuth && session) {
        // User shouldn't be on auth pages when authenticated
        router.push(redirectTo)
        return
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!requireAuth && session) {
          // Authenticated user trying to access auth pages
          router.push(redirectTo)
        } else if (requireAuth && !session) {
          // Unauthenticated user trying to access protected pages
          router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, redirectTo, requireAuth])

  return <>{children}</>
}