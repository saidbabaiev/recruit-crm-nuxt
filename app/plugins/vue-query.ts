import {
  VueQueryPlugin,
  QueryClient,
  QueryCache,
  MutationCache,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { normalizeError, shouldRedirectToAuth } from '@/utils/errors'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const handleGlobalError = (error: unknown) => {
    const err = normalizeError(error)

    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.error('[Query Error]:', err)
    }

    // 1. Auth → redirect
    if (shouldRedirectToAuth(err)) {
      const currentPath = router.currentRoute.value.path

      if (currentPath !== '/auth') {
        $toast.error('Session expired', {
          description: 'Please sign in to continue',
        })

        router.push({
          path: '/auth',
          query: { redirectTo: currentPath },
        })
      }
      return
    }

    // 2. Network → toast
    if (err.type === 'network') {
      $toast.error('No internet connection', {
        description: 'Please check your network and try again.',
      })
      return
    }

    // 3. Server → toast
    if (err.type === 'server') {
      $toast.error('Server error', {
        description: 'Please try again later',
      })
      return
    }

    // 4. Client → toast
    if (err.type === 'client') {
      if (err.status === 404) {
        $toast.error('Resource not found')
      }
      if (err.status === 409) {
        $toast.error('Conflict: resource already exists')
      }
      if (err.status === 429) {
        $toast.error('Too many requests, slow down')
      }
      return
    }
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
          const err = normalizeError(error)

          // Retry network errors (up to 2 times)
          if (err.type === 'network') {
            return failureCount < 2
          }

          // Retry server errors (once)
          if (err.type === 'server') {
            return failureCount < 1
          }

          // Don't retry: auth, validation, client, unknown
          return false
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
