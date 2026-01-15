export const useNotifications = () => {
  const { $toast } = useNuxtApp()

  const success = (message: string, description?: string, duration?: number) => {
    $toast.success(message, {
      description,
      duration: duration ?? 3000,
    })
  }

  const error = (message: string, description?: string, duration?: number) => {
    $toast.error(message, {
      description,
      duration: duration ?? 5000,
    })
  }

  const info = (message: string, description?: string, duration?: number) => {
    $toast.info(message, {
      description,
      duration: duration ?? 3000,
    })
  }

  const warning = (message: string, description?: string, duration?: number) => {
    $toast.warning(message, {
      description,
      duration: duration ?? 4000,
    })
  }

  const loading = (message: string) => {
    return $toast.loading(message)
  }

  const promise = <T>(
    action: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
      finally?: () => void
    },
  ): Promise<T> => {
    const promiseToUse = typeof action === 'function' ? action() : action
    $toast.promise(promiseToUse, messages)
    return promiseToUse
  }

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
  }
}
