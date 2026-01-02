export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();

    // Add all protected routes here
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    const isProtected = protectedRoutes.some(route => to.path.startsWith(route)); 

    // If the route is protected and user is not authenticated, redirect to auth
    if (isProtected && !user.value) {
        return navigateTo('/auth');
    }

    // If user is authenticated and trying to access auth page, redirect to dashboard
    if (to.path === '/auth' && user.value) {
        return navigateTo('/dashboard')
    }

})