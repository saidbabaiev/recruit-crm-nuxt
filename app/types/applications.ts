import type { Database } from './supabase'

export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']
export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']

// Filters for querying job applications
export interface JobApplicationFilters {
  candidate_id?: string
  job_id?: string
  status?: string
}
