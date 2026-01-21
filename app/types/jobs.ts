import type { Database } from './supabase'

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']
export type JobUpdate = Database['public']['Tables']['jobs']['Update']

export interface JobFilters {
  status?: 'open' | 'closed'
  search?: string
}
