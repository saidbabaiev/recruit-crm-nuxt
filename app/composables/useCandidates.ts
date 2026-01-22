import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateFilters as CandidateParams } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

/**
 * Query keys factory for centralized cache management.
 * Hierarchical structure allows granular invalidation:
 * - `all`: Invalidates everything
 * - `lists()`: Invalidates all list queries (different filters)
 * - `list(params)`: Invalidates specific filtered list
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

  /**
   * Fetches paginated and filtered candidates list.
   *
   * Query automatically refetch when params change (reactive).
   * Uses `keepPreviousData` to prevent UI flash during pagination/filtering.
   * Data stays fresh for 60s to reduce unnecessary requests.
   *
   * @param params - Reactive filters (search, status, page, limit)
   */
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateParams>) => {
    return useQuery({
      // Key is reactive: when params change, the query will refetch
      queryKey: computed(() => candidateQueryKeys.list(toValue(params))),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),

      // UX Best Practices:
      placeholderData: keepPreviousData, // Do not flash an empty screen when changing filter/page
      staleTime: 60 * 1000, // Data is "fresh" for 1 minute (do not make the request again if you return to the tab)
    })
  }

  /**
   * Fetches single candidate by ID.
   *
   * Query is disabled until ID is provided (prevents invalid requests).
   * Useful for detail pages and modals.
   *
   * @param id - Reactive candidate ID
   */
  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => candidateQueryKeys.detail(unref(id))),
      queryFn: () => CandidatesService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id)), // Request will not be made until there is an ID
      staleTime: 1000 * 60,
    })
  }
  // TODO: Create, Update and Delete mutations can be added here

  return {
    useCandidatesList,
    useCandidateDetails,
  }
}
