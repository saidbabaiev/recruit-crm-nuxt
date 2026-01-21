import { useQuery } from '@tanstack/vue-query'
import type { JobFilters } from '@/types/jobs'
import { JobsService } from '@/services/jobs'

/**
 * Composable for Jobs data operations
 */
export const useJobs = () => {
  const client = useSupabaseClient()

  // Query Keys Factory (centralized cache management)
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
   * @param filters - Optional filters (status, search)
   * @returns TanStack Query result with jobs data
   *
   * @example
   * ```ts
   * // Fetch all open jobs
   * const { data: jobs } = useJobsList({ status: 'open' })
   *
   * // With reactive filters
   * const filters = ref({ search: 'Vue' })
   * const { data: jobs } = useJobsList(filters)
   * ```
   */
  const useJobsList = (filters?: MaybeRefOrGetter<JobFilters>) => {
    return useQuery({
      queryKey: computed(() => jobQueryKeys.list(toValue(filters))),
      queryFn: () => JobsService.getAll(client, toValue(filters)),
      staleTime: 60 * 1000,
    })
  }

  return { useJobsList, jobQueryKeys }
}
