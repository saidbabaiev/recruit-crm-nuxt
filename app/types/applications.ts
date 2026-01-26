import type { Database } from './supabase'

export type JobApplication = Database['public']['Tables']['job_applications']['Row']

export type ApplicationStatus = Database['public']['Enums']['application_status']

export type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert']

export type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update']

export type JobApplicationCreate = Omit<
  JobApplicationInsert,
  'id' | 'created_at' | 'updated_at' | 'applied_at'
> & {
  candidate_id: string
  company_id: string
  job_id: string
  created_by: string
  status?: ApplicationStatus
}

// Filters for querying job applications
export interface JobApplicationFilters {
  candidate_id?: string
  job_id?: string
  status?: ApplicationStatus
}

export interface JobApplicationListResponse {
  data: JobApplication[]
  count: number | null
}

export type JobApplicationInvite = {
  candidate_id: string
  job_id: string
  status?: ApplicationStatus
}
