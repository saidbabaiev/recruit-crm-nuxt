export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const publicRoutes = ['/', '/auth']
  const isPublic = publicRoutes.some((route) => {
    return to.path === route || to.path.startsWith(route + '/')
  })

  // If route is not public and user is not logged in → redirect to /auth
  if (!isPublic && !user.value) {
    return navigateTo({
      path: '/auth',
      query: { redirectTo: to.fullPath },
    })
  }

  // If user is logged in and tries to access /auth → redirect to /dashboard
  if (to.path === '/auth' && user.value) {
    return navigateTo('/dashboard')
  }
})
