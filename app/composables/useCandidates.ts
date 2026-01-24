import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateFilters as CandidateParams } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

/**
 * Query keys factory for centralized cache management.
 *
 * Hierarchical structure allows granular invalidation:
 * - all: Invalidates everything
 * - lists(): All list queries
 * - list(params): Specific filtered list
 */
export const candidateQueryKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateQueryKeys.all, 'list'] as const,
  list: (params: CandidateParams) => [...candidateQueryKeys.lists(), params] as const,
  details: () => [...candidateQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateQueryKeys.details(), id] as const,
}

export const useCandidates = () => {
  const client = useSupabaseClient()
  const { isReady } = useCompanyContext()

  /**
   * Fetches paginated and filtered candidates list.
   *
   * Note: Filtering by company_id is handled by RLS, but we wait for
   * company context to be ready before making requests (better UX).
   */
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateParams>) => {
    return useQuery({
      queryKey: computed(() => candidateQueryKeys.list(toValue(params))),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      enabled: isReady,
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    })
  }

  /**
   * Fetches single candidate by ID.
   */
  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => candidateQueryKeys.detail(unref(id))),
      queryFn: () => CandidatesService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id) && isReady.value),
      staleTime: 1000 * 60,
    })
  }

  return {
    useCandidatesList,
    useCandidateDetails,
  }
}
