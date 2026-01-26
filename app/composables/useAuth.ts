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

/**
 * Successful sign-in response data.
 */
interface SignInSuccess {
  user: User
  session: Session
}

/**
 * Successful sign-up response data.
 * Fields are nullable because email confirmation may be required.
 */
interface SignUpSuccess {
  user: User | null
  session: Session | null
}

/**
 * Generic mutation options for overriding default behavior.
 *
 * Allows components to inject custom success/error handling logic
 * while preserving default toast notifications and cache invalidation.
 */
interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: unknown) => void
}

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const user = useSupabaseUser()

  /**
   * Creates a sign-in mutation hook with built-in loading/success/error handling.
   */
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
          // Wait for user state to sync to fix race condition with useSupabaseUser()
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

  /**
   * Creates a sign-up mutation hook with built-in loading/success/error handling.
   */
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

  /**
   * Signs out the current user and clears all cached query data.
   */
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
