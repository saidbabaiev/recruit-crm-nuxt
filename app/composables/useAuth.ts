import type { Database } from '@/types/supabase'
import { useQueryClient } from '@tanstack/vue-query'

interface SignUpMetadata {
  full_name: string
  company_name: string
}

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Clear cached sensitive data upon logout
    // Delete all cached queries and mutations (e.g., user profile, settings)
    queryClient.clear()
  }

  return {
    signIn,
    signUp,
    signOut,
  }
}
