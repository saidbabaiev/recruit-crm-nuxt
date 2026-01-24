import { useQuery } from '@tanstack/vue-query'
import type { JobFilters } from '@/types/jobs'
import { JobsService } from '@/services/jobs'

/**
 * Composable for Jobs data operations
 */
export const useJobs = () => {
  const client = useSupabaseClient()
  const { isReady } = useCompanyContext()

  const jobQueryKeys = {
    all: ['jobs'] as const,
    lists: () => [...jobQueryKeys.all, 'list'] as const,
    list: (filters?: JobFilters) => [...jobQueryKeys.lists(), filters] as const,
    details: () => [...jobQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...jobQueryKeys.details(), id] as const,
  }

  /**
   * Fetches list of jobs with optional filters
   *
   * Note: Filtering by company_id is handled by RLS, but we wait for
   * company context to be ready before making requests.
   */
  const useJobsList = (filters?: MaybeRefOrGetter<JobFilters>) => {
    return useQuery({
      queryKey: computed(() => jobQueryKeys.list(toValue(filters))),
      queryFn: () => JobsService.getAll(client, toValue(filters)),
      enabled: isReady,
      staleTime: 60 * 1000,
    })
  }

  return { useJobsList, jobQueryKeys }
}
