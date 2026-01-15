import type { Candidate, CandidateInsert, CandidateUpdate } from '@/types/database'
import type { Database } from '@/types/supabase'

export const useCandidates = () => {
  const supabase = useSupabaseClient<Database>()
  const { promise } = useNotifications()

  /**
     * READ: Get all candidates
     * @returns List of candidates
     */
  const getCandidates = async () => {
    return useAsyncData<Candidate[]>('candidates', async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    })
  }

  /**
     * READ: Get candidate by ID
     * @param id Candidate ID
     * @returns Candidate object
     */
  const getCandidateById = async (id: string) => {
    return useAsyncData<Candidate>(`candidate-${id}`, async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Candidate not found')

      return data
    })
  }

  /**
     * WRITE: Create a new candidate
     * @param candidate Candidate data to insert
     * @returns Promise resolving to the created Candidate
     */
  const createCandidate = async (candidate: CandidateInsert) => {
    return promise<Candidate>(
      async () => {
        const { data, error } = await supabase
          .from('candidates')
          .insert(candidate)
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No data returned after insert')

        await refreshNuxtData('candidates')
        return data
      },
      {
        loading: 'Creating candidate...',
        success: 'Candidate created successfully!',
        error: err => `Error creating candidate: ${err.message}`,
      },
    )
  }

  /**
     * WRITE: Update an existing candidate
     * @param id Candidate ID
     * @param updates Candidate data to update
     * @returns Promise resolving to the updated Candidate
     */
  const updateCandidate = async (id: string, updates: CandidateUpdate) => {
    return promise<Candidate>(
      async () => {
        const { data, error } = await supabase
          .from('candidates')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No data returned from update')

        await Promise.all([
          refreshNuxtData('candidates'),
          refreshNuxtData(`candidate-${id}`),
        ])

        return data as Candidate
      },
      {
        loading: 'Updating candidate...',
        success: 'Candidate updated successfully!',
        error: err => `Error updating candidate: ${err.message}`,
      },
    )
  }

  /**
     * DELETE: Delete a candidate by ID
     * @param id Candidate ID
     * @returns Promise resolving when the candidate is deleted
     */
  const deleteCandidate = async (id: string) => {
    return promise<void>(
      async () => {
        const { error } = await supabase
          .from('candidates')
          .delete()
          .eq('id', id)

        if (error) throw error
        await refreshNuxtData('candidates')
      },
      {
        loading: 'Deleting candidate...',
        success: 'Candidate deleted successfully!',
        error: err => `Error deleting candidate: ${err.message}`,
      },
    )
  }

  const searchCandidates = async (query: string): Promise<Candidate[]> => {
    if (!query.trim()) return []

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return []

    return data || []
  }

  return {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    searchCandidates,
  }
}
