import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Candidate, CandidateListResponse, CandidateFilters } from '@/types/candidates'
import type { WorkFormat } from '@/types/enums'

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

    if (params?.experience) {
      const raw = params.experience.trim()

      if (raw.endsWith('+')) {
        const min = Number(raw.slice(0, -1))
        if (Number.isFinite(min)) query = query.gte('experience_years', min)
      }
      else {
        const [minStr, maxStr] = raw.split('-')
        const min = Number(minStr)
        const max = Number(maxStr)
        if (Number.isFinite(min)) query = query.gte('experience_years', min)
        if (Number.isFinite(max)) query = query.lte('experience_years', max)
      }
    }

    if (params?.workFormat) {
      query = query.eq('remote_work_preference', params.workFormat)
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

  // Delete a candidate by ID
  async delete(client: SupabaseClient<Database>, id: string): Promise<void> {
    const { error, count } = await client
      .from('candidates')
      .delete({ count: 'exact' })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!count || count !== 1) {
      throw new Error('Candidate not found')
    }
  },

}
