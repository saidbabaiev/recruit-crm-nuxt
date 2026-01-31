import { useQuery, useMutation, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateFilters as CandidateParams } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'
import type { MutationOptions } from '@/types/common'

export const useCandidates = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Fetches paginated and filtered candidates list
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateParams>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'list', toValue(params)]),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value),
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

  const useDeleteCandidate = (options?: MutationOptions<void>) => {
    return useMutation({
      mutationFn: (id: string) => CandidatesService.delete(client, id),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  return {
    useCandidatesList,
    useCandidateDetails,
    useDeleteCandidate,
  }
}
