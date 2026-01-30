import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Candidate, CandidateListResponse, CandidateFilters } from '@/types/candidates'

export const CandidatesService = {
  // Fetches all candidates with optional filters and pagination
  async getAll(client: SupabaseClient<Database>, params?: CandidateFilters): Promise<CandidateListResponse> {
    let query = client
      .from('candidates')
      .select('*', { count: 'exact' })

    if (params?.search) {
      const q = params.search.trim()
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%, country.ilike.%${q}%`)
    }

    query = query.order('created_at', { ascending: false })

    if (params?.page && params.limit) {
      const from = (params.page - 1) * params.limit
      const to = from + params.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      count,
    }
  },

  // Fetch a single candidate by ID
  async getById(client: SupabaseClient<Database>, id: string): Promise<Candidate> {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  },

}
