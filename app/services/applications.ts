import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type {
  JobApplication,
  JobApplicationFilters,
  JobApplicationListResponse,
} from '@/types/applications'

export const ApplicationsService = {
  /**
    * Fetches all job applications with optional filters
    * @param client supabase client instance
    * @param filters optional filters (candidate_id, job_id, status)
    * @returns Promise with job applications data and total count
    */
  async getAll(
    client: SupabaseClient<Database>,
    filters?: JobApplicationFilters): Promise<JobApplicationListResponse> {
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
   * @param id  Job application ID
   * @returns Promise with job application data
   */
  async getById(client: SupabaseClient<Database>, id: string): Promise<JobApplication> {
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
}
