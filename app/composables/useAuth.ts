import type { Database } from '@/types/supabase'
import type { Session, User } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

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
  const { $toast } = useNuxtApp()
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
      onMutate: () => {
        // Show loading toast and store its ID for later update
        const toastId = $toast.loading('Signing in...')
        return { toastId }
      },
      onSuccess: async (data, _vars, context) => {
        if (options?.onSuccess) {
          // Component-specific logic (e.g., custom redirect, close modal)
          await options.onSuccess(data)
        }
        else {
          // Default behavior: show success toast and navigate to dashboard
          $toast.success('Successfully signed in!', { id: context?.toastId })

          // FIX: Race condition with Supabase auth state sync
          // Problem: Supabase client returns success, but useSupabaseUser()
          // might not have updated yet. If we redirect immediately,
          // the auth middleware will see `user = null` and redirect back to /auth.
          // Solution: Wait for user state to sync before navigating.
          if (!user.value) {
            // User state not ready yet - watch for it to update
            watch(user, () => navigateTo('/dashboard'), { once: true })
          }
          else {
            // User state already available - navigate immediately
            await navigateTo('/dashboard')
          }
        }
      },
      onError: (err, _vars, context) => {
        if (options?.onError) {
          // Component handles error display (e.g., inline form error)
          options.onError(err)
        }
        else {
          // Default: show error toast
          const message = err.message || 'Invalid credentials'
          $toast.error(message, { id: context?.toastId })
        }
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
      onMutate: () => {
        // Show loading toast and store its ID for later update
        const toastId = $toast.loading('Creating account...')
        return { toastId }
      },
      onSuccess: (data, _vars, context) => {
        if (options?.onSuccess) {
          // Component-specific logic (e.g., switch to sign-in tab, clear password)
          options.onSuccess(data)
        }
        else {
          // Default: show success message with email verification reminder
          $toast.success(
            'Account created! Please check your email to verify your account.',
            { id: context?.toastId, duration: 8000 },
          )
        }
      },
      onError: (err, _vars, context) => {
        if (options?.onError) {
          // Component handles error display (e.g., inline form error)
          options.onError(err)
        }
        else {
          // Default: show error toast
          const message = err.message || 'Failed to create account'
          $toast.error(message, { id: context?.toastId })
        }
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
    queryClient.clear() // Clear all cached data on sign-out
  }

  return {
    useSignIn,
    useSignUp,
    signOut,
  }
}
