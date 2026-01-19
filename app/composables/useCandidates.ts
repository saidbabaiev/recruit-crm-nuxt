import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query'
import type { Candidate, CandidateInsert, CandidateFilters as CandidateParams } from '@/types/candidates'
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
  const queryClient = useQueryClient()
  const toast = useNotifications()

  // --- Queries (READ) ---

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
    })
  }

  // --- Mutations (WRITE) ---

  /**
   * Creates a new candidate with automatic cache invalidation and toast notifications.
   *
   * **Default behavior:**
   * - Shows loading toast
   * - Invalidates all list queries on success
   * - Shows success/error toast
   *
   * **Custom behavior:**
   * Pass `options.onSuccess` to override (e.g., navigate to detail page, close modal).
   * Pass `options.onError` to handle errors in component (e.g., inline form validation).
   *
   * @param options - Optional callbacks to customize behavior
   *
   * @example
   * ```ts
   * // Default (shows toasts, invalidates cache)
   * const { mutate: create } = useCreateCandidate()
   * create({ first_name: 'John', last_name: 'Doe', ... })
   *
   * // Custom (navigate after creation)
   * const { mutate: createAndNavigate } = useCreateCandidate({
   *   onSuccess: (data) => navigateTo(`/candidates/${data.id}`)
   * })
   * ```
   */
  const useCreateCandidate = (options?: {
    onSuccess?: (data: Candidate) => void | Promise<void>
    onError?: (error: Error) => void
  }) => {
    return useMutation({
      mutationFn: (newCandidate: CandidateInsert) => CandidatesService.create(client, newCandidate),

      onMutate: () => {
        const toastId = toast.loading('Creating candidate...')
        return { toastId }
      },

      onSuccess: async (data, vars, context) => {
        queryClient.invalidateQueries({ queryKey: candidateQueryKeys.lists() })
        if (options?.onSuccess) {
          await options.onSuccess(data)
        }
        else {
          toast.success('Candidate created successfully', { id: context?.toastId })
        }
      },
      onError: (err, vars, context) => {
        if (options?.onError) {
          options.onError(err)
        }
        else {
          const { message } = handleError(err)
          toast.error(message || 'Failed to create', { id: context?.toastId })
        }
      },
    })
  }

  // TODO: Update and Delete mutations can be added here

  return {
    useCandidatesList,
    useCandidateDetails,
    useCreateCandidate,
  }
}
