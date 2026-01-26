import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type {
  JobApplication,
  JobApplicationCreate,
  JobApplicationFilters,
  JobApplicationListResponse,
} from '@/types/applications'

export const ApplicationsService = {
  // Fetches all job applications with optional filters
  async getAll(
    client: SupabaseClient<Database>,
    filters?: JobApplicationFilters,
  ): Promise<JobApplicationListResponse> {
    let query = client
      .from('job_applications')
      .select('*', { count: 'exact' })

    if (filters?.candidate_id) {
      query = query.eq('candidate_id', filters.candidate_id)
    }

    if (filters?.job_id) {
      query = query.eq('job_id', filters.job_id)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      count,
    }
  },

  // Fetches a single job application by ID
  async getById(
    client: SupabaseClient<Database>,
    id: string,
  ): Promise<JobApplication> {
    const { data, error } = await client
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  },

  // Fetches job applications by candidate ID
  async getByCandidateId(
    client: SupabaseClient<Database>,
    candidateId: string,
  ): Promise<JobApplication[]> {
    const { data, error } = await client
      .from('job_applications')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  },

  // Creates a new job application
  async create(
    client: SupabaseClient<Database>,
    data: JobApplicationCreate,
  ): Promise<JobApplication> {
    const { data: createdData, error } = await client
      .from('job_applications')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    return createdData
  },
}
