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
  // const { $toast } = useNuxtApp()
  const toast = useNotifications()
  const user = useSupabaseUser()

  // --- Sign In Mutation ---
  /**
   * Creates a sign-in mutation hook with built-in loading/success/error handling.
   *
   * @param options - Optional callbacks to override default behavior
   * @param options.onSuccess - Custom logic after successful sign-in (e.g., specific redirect)
   * @param options.onError - Custom error handling (e.g., show inline form error)
   *
   * Default behavior:
   * - Shows loading toast during request
   * - Redirects to /dashboard on success
   * - Handles race condition with useSupabaseUser() sync
   * - Shows error toast on failure
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
          // Component-specific logic (e.g., custom redirect, close modal)
          await options.onSuccess(data)
        }
        else {
          // Wait for user state to sync (with timeout) to fix race condition
          // Problem: Supabase client returns success, but useSupabaseUser()
          // might not have updated yet. If we redirect immediately,
          // the auth middleware will see `user = null` and redirect back to /auth.
          // Solution: Wait for user state to sync before navigating.
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
      onError: (err) => {
        // Component MUST handle error display via onError callback
        options?.onError?.(err)
      },
    })
  }

  // --- Sign Up Mutation ---
  /**
   * Creates a sign-up mutation hook with built-in toast notifications.
   *
   * @param options - Optional callbacks to override default behavior
   * @param options.onSuccess - Custom logic after successful registration (e.g., switch to sign-in mode)
   * @param options.onError - Custom error handling (e.g., show inline form error)
   *
   * Default behavior:
   * - Shows loading toast during request
   * - Shows success message with email verification reminder (8s duration)
   * - Shows error toast on failure
   *
   * Note: Email confirmation is required by default in Supabase auth settings.
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
      onSuccess: (data) => {
        // Always show success toast (architectural requirement)
        toast.success(
          'Account created! Please check your email to verify your account.',
          { duration: 8000 },
        )

        // Component-specific logic (e.g., switch tab, clear password)
        options?.onSuccess?.(data)
      },
      onError: (err) => {
        // Component MUST handle error display via onError callback
        options?.onError?.(err)
      },
    })
  }

  // --- Sign Out ---
  /**
   * Signs out the current user and clears all cached query data.
   *
   * @throws {Error} If sign-out fails
   *
   * Usage:
   * ```ts
   * const { signOut } = useAuth()
   * await signOut()
   * ```
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
