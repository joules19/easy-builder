import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()

// Client-side Supabase client for use in components
export const supabase = createClient()