import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Candidate, CandidateListResponse, CandidateFilters } from '@/types/candidates'

export const CandidatesService = {
  /**
   * Fetches all candidates with optional filters and pagination
   * @param client - Supabase client instance
   * @param params - Optional filters (search, page, limit)
   * @returns Promise with candidates data and total count
   */
  async getAll(client: SupabaseClient<Database>, params?: CandidateFilters): Promise<CandidateListResponse> {
    // 1. Initialize query
    let query = client
      .from('candidates')
      .select('*', { count: 'exact' })

    // 2. Apply filters (Dynamic Query Building)
    // search
    if (params?.search) {
      const q = params.search.trim()
      // Use ilike for case-insensitive partial matching
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%, country.ilike.%${q}%`)
    }

    // 3. Sort by default by created_at descending
    query = query.order('created_at', { ascending: false })

    // 4. Pagination logic
    if (params?.page && params.limit) {
      const from = (params.page - 1) * params.limit
      const to = from + params.limit - 1
      query = query.range(from, to)
    }

    // 5. Execute query
    const { data, error, count } = await query

    if (error) {
      // We can log the error here to Sentry/Datadog
      throw error
    }

    return {
      data: data || [],
      count,
    }
  },

  /**
   * Fetch a single candidate by ID
   * @param client - Supabase client instance
   * @param id - Candidate ID
   * @returns Promise with candidate data
   */
  async getById(client: SupabaseClient<Database>, id: string): Promise<Candidate> {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // We can log the error here to Sentry/Datadog
      throw error
    }

    return data
  },
}
