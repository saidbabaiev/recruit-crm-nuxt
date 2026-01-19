export const useNotifications = () => {
  const { $toast } = useNuxtApp()

  return {
    success: (message: string, options?: { id?: string | number, duration?: number }) =>
      $toast.success(message, options),

    error: (message: string, options?: { id?: string | number, duration?: number }) =>
      $toast.error(message, options),

    info: (message: string, options?: { id?: string | number, duration?: number }) =>
      $toast.info(message, options),

    loading: (message: string, options?: { id?: string | number }) =>
      $toast.loading(message, options),
  }
}
