import { useQuery, useMutation, keepPreviousData } from '@tanstack/vue-query'
import type { Candidate, CandidateInsert, CandidateFilters as CandidateParams, CandidateUpdate } from '@/types/candidates'
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

  // Create a new candidate
  const useCreateCandidate = (options?: MutationOptions<Candidate>) => {
    return useMutation({
      mutationFn: async (candidate: Omit<CandidateInsert, 'company_id' | 'created_by'>) => {
        if (!user.value?.sub) {
          throw new Error('User not authenticated')
        }

        const { data: companyId, error: companyError } = await client
          .rpc('get_user_company_id')

        if (companyError || !companyId) {
          throw new Error('Failed to get company info')
        }

        return CandidatesService.create(client, {
          ...candidate,
          company_id: companyId,
          created_by: user.value.sub,
        })
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  // Update a candidate
  const useUpdateCandidate = (options?: MutationOptions<Candidate>) => {
    return useMutation({
      mutationFn: async (candidate: CandidateUpdate) => {
        if (!user.value?.sub) {
          throw new Error('User not authenticated')
        }

        if (!candidate.id) {
          throw new Error('Candidate ID is required')
        }

        const { data: companyId, error: companyError } = await client
          .rpc('get_user_company_id')

        if (companyError || !companyId) {
          throw new Error('Failed to get company info')
        }

        return CandidatesService.update(client, candidate.id, {
          ...candidate,
          company_id: companyId,
          created_by: user.value.sub,
        })
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  // Delete a candidate by ID
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
    useCreateCandidate,
    useUpdateCandidate,
    useDeleteCandidate,
  }
}
