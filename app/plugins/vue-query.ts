import {
  VueQueryPlugin,
  QueryClient,
  QueryCache,
  MutationCache,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query'

interface ExtendedError extends Error {
  statusCode?: number
  status?: number | string
  code?: string
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { $toast } = useNuxtApp()

  const handleGlobalError = (err: unknown) => {
    const error = err as ExtendedError
    // Log the error for debugging
    if (import.meta.dev) {
      console.error('[Global Query Error]:', error)
    }

    // Handling authentication errors (401/403)
    const status = error.status || error.statusCode || error.code
    const message = error.message || 'Something went wrong'

    const isSessionExpired
      = status == 401
        || status == 403
        || message.includes('JWT')

    if (isSessionExpired) {
      if (router.currentRoute.value.path !== '/auth') {
        $toast.error('Session expired. Please login again.')
        router.push('/auth')
      }
      return
    }

    // Ignoring client errors (400-499) because they are handled locally
    if (typeof status === 'number' && status >= 400 && status < 500) {
      return
    }

    // Handling server errors (500 and others)
    // We only show a toast if it's not a manual request cancellation.
    $toast.error(message, {
      description: 'Our team has been notified.',
    })
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalError }),
    mutationCache: new MutationCache({ onError: handleGlobalError }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 минут
        refetchOnWindowFocus: false,
        retry: 1,
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
