import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Job, JobFilters, JobListResponse } from '@/types/jobs'

export const JobsService = {
  /**
   * Fetches all jobs with optional filters
   * @param client - Supabase client instance
   * @param filters - Optional filters (status, search)
   * @returns Promise with jobs data and total count
   */
  async getAll(
    client: SupabaseClient<Database>,
    filters?: JobFilters,
  ): Promise<JobListResponse> {
    let query = client
      .from('jobs')
      .select('*', { count: 'exact' })

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    // Apply search filter (title or company)
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
      )
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
   * Fetches a single job by ID
   * @param client - Supabase client instance
   * @param id - Job ID
   * @returns Promise with job data
   */
  async getById(
    client: SupabaseClient<Database>,
    id: string,
  ): Promise<Job> {
    const { data, error } = await client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  },
}
