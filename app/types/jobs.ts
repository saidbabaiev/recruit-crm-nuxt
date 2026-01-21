import type { Database } from './supabase'

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']

export interface JobMatch {
  job: Job
  matchPercentage: number // 0-100
  matchedSkills: string[] // ['Vue', TypeScript]
  missingSkills: string[] // ['React', 'Node.js']
}

export interface JobFilters {
  status?: 'open' | 'closed'
  search?: string
}

export interface JobListResponse {
  data: Job[]
  count: number | null
}
