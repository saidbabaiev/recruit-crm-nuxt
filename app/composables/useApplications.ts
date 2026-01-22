import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { JobApplication, JobApplicationInvite } from '@/types/applications'
import { ApplicationsService } from '@/services/applications'

/**
 * Composable for Applications data operations
 */
export const useApplications = () => {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()
  const toast = useNotifications()
  const user = useSupabaseUser()
  const { companyId } = useCompanyContext()

  // Query Keys Factory (centralized cache management)
  const applicationQueryKeys = {
    all: ['applications'] as const,
    byCandidate: (candidateId: string) => [...applicationQueryKeys.all, 'candidate', candidateId] as const,
  }

  /**
   * Creates mutation hook for inviting candidate to job
   *
   * **Default UI Behavior:**
   * - Shows loading toast: "Inviting candidate..."
   * - On success: "Candidate invited to Interview!"
   * - On error: Shows error message
   * - Invalidates applications cache automatically
   * - Automatically adds company_id and created_by from user session
   *
   * @param options - Optional callbacks to override default behavior
   * @param options.onSuccess - Custom logic after invite (e.g., analytics, navigation)
   * @param options.onError - Custom error handling (e.g., inline form errors)
   *
   * @example
   * ```ts
   * // Default usage (shows toasts)
   * const { mutate: invite } = useCreateApplication()
   * invite({ candidate_id: '123', job_id: '456' })
   *
   * // Custom usage (with callback)
   * const { mutate: inviteWithAnalytics } = useCreateApplication({
   *   onSuccess: (data) => {
   *     trackEvent('candidate_invited', { jobId: data.job_id })
   *   }
   * })
   * ```
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
      onMutate: () => {
        const toastId = toast.loading('Inviting candidate...')
        return { toastId }
      },
      onSuccess: async (data, vars, context) => {
        // Invalidate cache
        await queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.byCandidate(vars.candidate_id),
        })

        if (options?.onSuccess) {
          await options.onSuccess(data)
        }
        else {
          toast.success('Candidate invited to Interview!', { id: context?.toastId })
        }
      },
      onError: (err, vars, context) => {
        if (options?.onError) {
          options.onError(err)
        }
        else {
          const { message } = handleError(err)
          toast.error(message, { id: context?.toastId })
        }
      },
    })
  }

  /**
   * Fetches applications for a candidate (to check existing invites)
   *
   * @param candidateId - Candidate ID (can be ref or getter)
   * @returns TanStack Query result with applications data
   *
   * @example
   * ```ts
   * const candidateId = computed(() => route.params.id)
   * const { data: applications } = useApplicationsByCandidate(candidateId)
   * ```
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
