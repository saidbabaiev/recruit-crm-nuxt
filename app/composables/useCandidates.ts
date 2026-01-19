import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateInsert, CandidateFilters as CandidateParams } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

// --- 1. Query keys factory ---
// Centralized query keys for candidates
export const candidateQueryKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateQueryKeys.all, 'list'] as const,
  list: (params: CandidateParams) => [...candidateQueryKeys.lists(), params] as const,
  details: () => [...candidateQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateQueryKeys.details(), id] as const,
}

export const useCandidates = () => {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()
  const { $toast } = useNuxtApp()

  // --- 2. Queries (READ) ---
  /**
   * Hook to fetch paginated and filtered list of candidates
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

  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => candidateQueryKeys.detail(unref(id))),
      queryFn: () => CandidatesService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id)), // Request will not be made until there is an ID
    })
  }

  // --- 3. Mutations (WRITE) ---
  const createCandidate = useMutation({
    mutationFn: (newCandidate: CandidateInsert) => CandidatesService.create(client, newCandidate),

    onMutate: () => {
      const toastId = $toast.loading('Creating candidate...')
      return { toastId }
    },

    onSuccess: (_data, _vars, context) => {
      // Initialize invalidation of related queries
      queryClient.invalidateQueries({ queryKey: candidateQueryKeys.lists() })

      $toast.success('Candidate created successfully', { id: context?.toastId })
    },

    onError: (err, _vars, context) => {
      const { message } = handleError(err)
      $toast.error(message || 'Failed to create', { id: context?.toastId })
    },
  })

  // TODO: Update and Delete mutations can be added here

  return {
    useCandidatesList,
    useCandidateDetails,
    createCandidate,
  }
}
