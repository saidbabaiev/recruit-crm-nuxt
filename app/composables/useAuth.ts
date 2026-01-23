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
 * Extracted from Supabase AuthTokenResponsePassword to avoid type conflicts.
 */
interface SignInSuccess {
  user: User
  session: Session
}

/**
 * Successful sign-up response data.
 * Fields are nullable because email confirmation may be required.
 * User receives confirmation email before session is created.
 */
interface SignUpSuccess {
  user: User | null
  session: Session | null
}

/**
 * Generic mutation options for overriding default behavior.
 * Allows components to inject custom success/error handling logic
 * while preserving default toast notifications and cache invalidation.
 *
 * @template TData - The mutation result data type (SignInSuccess | SignUpSuccess)
 */
interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: Error) => void
}

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const user = useSupabaseUser()

  // --- Sign In Mutation ---
  /**
   * Creates a sign-in mutation hook with built-in loading/success/error handling.
   * @param options - Optional callbacks to override default behavior
   * @param options.onSuccess - Custom logic after successful sign-in (e.g., specific redirect)
   * @param options.onError - Custom error handling (e.g., show inline form error)
   * @returns
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
          // Custom logic after successful sign-in (e.g., specific redirect)
          await options.onSuccess(data)
        }
        else {
          // Wait for user state to sync (with timeout) to fix race condition with useSupabaseUser()
          try {
            await until(user).toBeTruthy({ timeout: 3000 })
            await navigateTo('/dashboard')
          }
          catch (error) {
            // Timeout: user state never synced
            console.warn('Auth state sync timeout:', error)
            // Fallback: try redirect anyway (might work)
            await navigateTo('/dashboard')
          }
        }
      },
      onError: options?.onError,
    })
  }

  // --- Sign Up Mutation ---
  /**
   * Creates a sign-up mutation hook with built-in loading/success/error handling.
   * @param options - Optional callbacks to override default behavior
   * @param options.onSuccess - Custom logic after successful sign-up (e.g., switch to sign-in mode)
   * @param options.onError - Custom error handling (e.g., show inline form error)
   * @param options
   * @returns
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

  // --- Sign Out ---
  /**
   * Signs out the current user and clears all cached query data.
   * @returns void
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Clear all cached data on sign-out
    queryClient.clear()
  }

  return {
    useSignIn,
    useSignUp,
    signOut,
  }
}
