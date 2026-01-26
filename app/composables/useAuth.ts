import type { Database } from '@/types/supabase'
import type { Session, User } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { until } from '@vueuse/core'

// --- Types ---
interface SignInVariables {
  email: string
  password: string
}

interface SignUpVariables {
  email: string
  password: string
  metadata: {
    full_name: string
    company_name: string
  }
}

interface SignInSuccess {
  user: User
  session: Session
}

interface SignUpSuccess {
  user: User | null
  session: Session | null
}

// Mutation options for overriding default behavior with custom success/error handling logic
interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: unknown) => void
}

// --- UseAuth composable ---
export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const user = useSupabaseUser()

  // Sign In
  const useSignIn = (options?: MutationOptions<SignInSuccess>) => {
    return useMutation({
      mutationFn: async ({ email, password }: SignInVariables) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      },
      onSuccess: async (data) => {
        if (options?.onSuccess) {
          await options.onSuccess(data)
        }
        else {
          try {
            await until(user).toBeTruthy({ timeout: 3000 })
            await navigateTo('/dashboard')
          }
          catch (error) {
            console.warn('Auth state sync timeout:', error)
            await navigateTo('/dashboard')
          }
        }
      },
      onError: options?.onError,
    })
  }

  // Sign Up
  const useSignUp = (options?: MutationOptions<SignUpSuccess>) => {
    return useMutation({
      mutationFn: async ({ email, password, metadata }: SignUpVariables) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: metadata },
        })
        if (error) throw error
        return data
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    queryClient.clear()
  }

  return {
    useSignIn,
    useSignUp,
    signOut,
  }
}
