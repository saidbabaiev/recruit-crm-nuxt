// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss', 
    'shadcn-nuxt', 
    '@nuxtjs/supabase', 
    'vue-sonner/nuxt'
  ],

  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    redirect: false
  },

  shadcn: {
    prefix: '',
    /**
     * Directory that the component lives in. Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  }
})