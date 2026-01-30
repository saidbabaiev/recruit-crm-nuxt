import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { JobApplication, JobApplicationInvite } from '@/types/applications'
import { ApplicationsService } from '@/services/applications'
import type { MutationOptions } from '@/types/common'

export const useApplications = () => {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()
  const user = useSupabaseUser()

  // Creates mutation hook for inviting candidate to job
  const useCreateApplication = (options?: MutationOptions<JobApplication>) => {
    return useMutation({
      mutationFn: async (data: JobApplicationInvite) => {
        if (!user.value?.sub) {
          throw new Error('User not authenticated')
        }
        const { data: companyId, error: companyError } = await client
          .rpc('get_user_company_id')

        if (companyError || !companyId) {
          throw new Error('Unable to get company context. Please refresh the page.')
        }

        return ApplicationsService.create(client, {
          ...data,
          company_id: companyId,
          created_by: user.value.sub,
        })
      },
      onSuccess: async (data, vars) => {
        await queryClient.invalidateQueries({
          queryKey: ['applications', 'candidate', vars.candidate_id],
        })

        await options?.onSuccess?.(data)
      },
      onError: options?.onError,
    })
  }

  // Fetches applications for a candidate (to check existing invites)
  const useApplicationsByCandidate = (candidateId: MaybeRefOrGetter<string>) => {
    return useQuery({
      queryKey: computed(() => ['applications', 'candidate', toValue(candidateId)]),
      queryFn: () => ApplicationsService.getByCandidateId(client, toValue(candidateId)),
    })
  }

  return {
    useCreateApplication,
    useApplicationsByCandidate,
  }
}
