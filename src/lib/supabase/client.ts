import { env } from '@/env'
import { createBrowserClient } from '@supabase/ssr'

import { DatabaseOverride } from '@/types/database-override'

export function createClient() {
  return createBrowserClient<DatabaseOverride>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
  )
}
