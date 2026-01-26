import { useQuery } from '@tanstack/vue-query'
import type { JobFilters } from '@/types/jobs'
import { JobsService } from '@/services/jobs'

export const useJobs = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Fetches list of jobs with optional filters
  const useJobsList = (filters?: MaybeRefOrGetter<JobFilters>) => {
    return useQuery({
      queryKey: computed(() => ['jobs', 'list', toValue(filters)]),
      queryFn: () => JobsService.getAll(client, toValue(filters)),
      enabled: computed(() => !!user.value),
      staleTime: 60 * 1000,
    })
  }

  return { useJobsList }
}
