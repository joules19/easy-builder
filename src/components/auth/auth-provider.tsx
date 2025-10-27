'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Vendor } from '@/types/database'

interface AuthContextType {
  user: User | null
  vendor: Vendor | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshVendor: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchVendor = async (userId: string) => {
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    setVendor(data)
  }

  const refreshVendor = async () => {
    if (user) {
      await fetchVendor(user.id)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setVendor(null)
    setSession(null)
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchVendor(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchVendor(session.user.id)
        } else {
          setVendor(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        session,
        loading,
        signOut,
        refreshVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}