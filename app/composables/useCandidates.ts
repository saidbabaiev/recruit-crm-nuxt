import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateFilters as CandidateParams } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

export const useCandidates = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Fetches paginated and filtered candidates list
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateParams>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'list', toValue(params)]),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value), // Wait for user context to be ready
      placeholderData: keepPreviousData, // UX: no flash on filter change
      staleTime: 60 * 1000,
    })
  }

  // Fetches single candidate by ID
  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'detail', unref(id)]),
      queryFn: () => CandidatesService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id) && !!user.value),
      staleTime: 1000 * 60,
    })
  }

  return {
    useCandidatesList,
    useCandidateDetails,
  }
}
