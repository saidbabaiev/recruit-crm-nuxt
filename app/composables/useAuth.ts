import type { Database } from '@/types/supabase'

interface SignUpMetadata { 
    full_name: string
    company_name: string
}

export const useAuth = () => {
    const supabase = useSupabaseClient<Database>()

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
        })
        if (error) throw error
        return data
    }

    const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
       const { data, error } = await supabase.auth.signUp({
            email, 
            password,
            options: { data: metadata }
        })
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }
  
    return {
        signIn,
        signUp,
        signOut
    }
}