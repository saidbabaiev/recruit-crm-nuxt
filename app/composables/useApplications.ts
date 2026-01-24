import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { JobApplication, JobApplicationInvite } from '@/types/applications'
import { ApplicationsService } from '@/services/applications'

/**
 * Composable for Applications data operations
 */
export const useApplications = () => {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()
  const user = useSupabaseUser()
  const { companyId } = useCompanyContext()

  const applicationQueryKeys = {
    all: ['applications'] as const,
    byCandidate: (candidateId: string) => [...applicationQueryKeys.all, 'candidate', candidateId] as const,
  }

  /**
   * Creates mutation hook for inviting candidate to job
   */
  const useCreateApplication = (options?: {
    onSuccess?: (data: JobApplication) => void | Promise<void>
    onError?: (error: Error) => void
  }) => {
    return useMutation({
      mutationFn: async (data: JobApplicationInvite) => {
        if (!companyId.value || typeof companyId.value !== 'string') {
          throw new Error('Company context is not ready. Please refresh the page.')
        }
        if (!user.value?.sub) {
          throw new Error('User not authenticated')
        }

        return ApplicationsService.create(client, {
          ...data,
          company_id: companyId.value,
          created_by: user.value.sub,
        })
      },
      onSuccess: async (data, vars) => {
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.byCandidate(vars.candidate_id),
        })

        await options?.onSuccess?.(data)
      },
      onError: options?.onError,
    })
  }

  /**
   * Fetches applications for a candidate (to check existing invites)
   */
  const useApplicationsByCandidate = (candidateId: MaybeRefOrGetter<string>) => {
    return useQuery({
      queryKey: computed(() => applicationQueryKeys.byCandidate(toValue(candidateId))),
      queryFn: () => ApplicationsService.getByCandidateId(client, toValue(candidateId)),
    })
  }

  return {
    useCreateApplication,
    useApplicationsByCandidate,
    applicationQueryKeys,
  }
}
