import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type {
  JobApplication,
  JobApplicationCreate,
  JobApplicationFilters,
  JobApplicationListResponse,
} from '@/types/applications'
import { createValidationError } from '~/utils/errors'

export const ApplicationsService = {
  /**
   * Fetches all job applications with optional filters
   *
   * Note: Filtering by company_id is handled automatically by RLS policy.
   */
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

  /**
   * Fetches a single job application by ID
   *
   * Note: RLS policy ensures the application belongs to user's company.
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

    if (error) throw error

    return data
  },

  /**
   * Fetches job applications by candidate ID
   *
   * Note: RLS automatically filters by company_id.
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

    if (error) throw error

    return data || []
  },

  /**
   * Creates a new job application
   *
   * Note: company_id and created_by must be included in the data object.
   * RLS policy will verify that company_id matches user's company.
   */
  async create(
    client: SupabaseClient<Database>,
    data: JobApplicationCreate,
  ): Promise<JobApplication> {
    if (!data.company_id || !data.created_by) {
      throw createValidationError('company_id and created_by are required')
    }

    const { data: createdData, error } = await client
      .from('job_applications')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    return createdData
  },
}
