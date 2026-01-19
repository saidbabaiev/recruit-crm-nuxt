import {
  VueQueryPlugin,
  QueryClient,
  QueryCache,
  MutationCache,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { normalizeError, isAuthRedirectError } from '@/utils/errors'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const handleGlobalError = (error: unknown) => {
    const normalized = normalizeError(error)

    // Dev logging - only in dev mode
    if (import.meta.dev) {
      console.error('[Global Query Error]:', {
        type: normalized.type,
        normalized,
        original: error,
      })
    }

    // 1. Auth Redirect → redirect + toast
    if (isAuthRedirectError(normalized)) {
      const currentPath = router.currentRoute.value.path
      if (currentPath !== '/auth') {
        $toast.error('Your session has expired', {
          description: 'Please sign in to continue',
        })
        router.push({
          path: '/auth',
          query: { redirectTo: currentPath },
        })
      }
      return
    }

    // 2. Network (Offline, timeout) → toast
    if (normalized.type === 'network') {
      $toast.error('No internet connection', {
        description: 'Please check your network settings and try again.',
      })
      return
    }

    // 3. Database 5xx (PostgreSQL down, connection issues) → toast
    if (normalized.type === 'database') {
      $toast.error('Database error occurred', {
        description: normalized.hint || 'Please try again later',
      })
      return
    }

    // 4. HTTP 5xx → toast (server errors)
    if (normalized.type === 'http' && normalized.status >= 500) {
      $toast.error('Server error', {
        description: 'Please try again later',
      })
      return
    }

    // 5. HTTP 4xx → silent fail (handled locally)
    if (normalized.type === 'http' && normalized.status >= 400) {
      return
    }

    // Other errors (validation, not_found, auth) are handled locally
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: handleGlobalError,
    }),
    mutationCache: new MutationCache({
      onError: handleGlobalError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const normalized = normalizeError(error)

          // No retry auth redirect (expired session)
          if (isAuthRedirectError(normalized)) return false

          // No retry 400-level (validation, not_found, bad credentials)
          if (normalized.type === 'validation' || normalized.type === 'not_found') {
            return false
          }

          // No retry auth errors (bad credentials)
          if (normalized.type === 'auth') return false

          // Retry network up to 2 times
          if (normalized.type === 'network' && failureCount < 2) {
            return true
          }

          // Retry 5xx up to 1 time
          return failureCount < 1
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
      },
    },
  })

  const options: VueQueryPluginOptions = { queryClient }
  nuxtApp.vueApp.use(VueQueryPlugin, options)

  return {
    provide: {
      queryClient,
    },
  }
})
