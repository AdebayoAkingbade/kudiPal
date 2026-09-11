import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserSupabaseClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  browserSupabaseClient ??= createClient(supabaseUrl, supabaseAnonKey)
  return browserSupabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabaseBrowserClient()
    const value = client[property as keyof SupabaseClient]

    return typeof value === 'function' ? value.bind(client) : value
  },
})
