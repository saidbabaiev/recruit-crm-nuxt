import { useQuery } from '@tanstack/vue-query'
import type { Database } from '@/types/supabase'

interface CompanyContext {
  company_id: string
  company_name: string | null
}

/**
 * Provides company context for the current authenticated user.
 *
 * **Architecture:**
 * - Fetches company_id from user's profile once
 * - Caches result in TanStack Query (persists across navigation)
 * - Automatically refetch on user change
 * - Throws error if user is not authenticated
 *
 * **Usage in Composables:**
 * ```ts
 * const { companyId } = useCompanyContext()
 *
 * const useCreateCandidate = () => {
 *   return useMutation({
 *     mutationFn: (data) => CandidatesService.create(client, {
 *       ...data,
 *       company_id: companyId.value,
 *     })
 *   })
 * }
 * ```
 */
export const useCompanyContext = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const { data: context, isLoading, error } = useQuery({
    queryKey: ['company-context', user.value?.sub] as const,
    queryFn: async (): Promise<CompanyContext> => {
      if (!user.value?.sub) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await client
        .from('profiles')
        .select('company_id, companies!profiles_company_id_fkey(name)')
        .eq('id', user.value.sub)
        .single()

      if (error) throw error
      if (!data) throw new Error('Profile not found')

      return {
        company_id: data.company_id,
        company_name: Array.isArray(data.companies)
          ? null
          : data.companies?.name ?? null,
      }
    },
    enabled: computed(() => !!user.value?.sub),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 1000 * 60 * 60,
  })

  const companyId = computed(() => {
    if (!context.value?.company_id) {
      return null
    }
    return context.value.company_id
  })

  const companyName = computed(() => context.value?.company_name ?? null)

  return {
    companyId: companyId as ComputedRef<string | null>,
    companyName,
    context,
    isLoading,
    error,
    isReady: computed(() => !isLoading.value && !!companyId.value),
  }
}
