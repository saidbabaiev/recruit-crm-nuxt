import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export const useSupabaseClient = () => {
  const config = useRuntimeConfig()
  
  return createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )
}
