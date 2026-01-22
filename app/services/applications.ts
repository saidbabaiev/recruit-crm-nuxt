import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type {
  JobApplication,
  JobApplicationCreate,
  JobApplicationFilters,
  JobApplicationListResponse,
} from '@/types/applications'

export const ApplicationsService = {
  /**
   * Fetches all job applications with optional filters
   * @param client Supabase client instance
   * @param filters Optional filters (candidate_id, job_id, status)
   * @returns Promise with job applications data and total count
   */
  async getAll(
    client: SupabaseClient<Database>,
    filters?: JobApplicationFilters,
  ): Promise<JobApplicationListResponse> {
    let query = client
      .from('job_applications')
      .select('*', { count: 'exact' })

    // Apply candidate_id filter
    if (filters?.candidate_id) {
      query = query.eq('candidate_id', filters.candidate_id)
    }

    // Apply job_id filter
    if (filters?.job_id) {
      query = query.eq('job_id', filters.job_id)
    }

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Sort by created date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return {
      data: data || [],
      count,
    }
  },

  /**
   * Fetches a single job application by ID
   * @param client Supabase client instance
   * @param id Job application ID
   * @returns Promise with job application data
   */
  async getById(
    client: SupabaseClient<Database>,
    id: string,
  ): Promise<JobApplication> {
    const { data, error } = await client
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  },

  /**
   * Fetches job applications by candidate ID
   * @param client Supabase client instance
   * @param candidateId Candidate ID
   * @returns Promise with job applications array
   */
  async getByCandidateId(
    client: SupabaseClient<Database>,
    candidateId: string,
  ): Promise<JobApplication[]> {
    const { data, error } = await client
      .from('job_applications')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  },

  /**
   * Creates a new job application
   * Note: company_id and created_by must be included in the data object
   * @param client Supabase client instance
   * @param data Job application data to insert (must include company_id, created_by)
   * @returns Promise with created job application data
   */
  async create(
    client: SupabaseClient<Database>,
    data: JobApplicationCreate,
  ): Promise<JobApplication> {
    if (!data.company_id || !data.created_by) {
      throw new Error('company_id and created_by are required')
    }

    const { data: createdData, error } = await client
      .from('job_applications')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw error
    }

    return createdData
  },
}
