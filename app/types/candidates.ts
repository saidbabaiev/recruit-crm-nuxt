import type { Database } from '@/types/supabase'

// Candidate types
export type Candidate = Database['public']['Tables']['candidates']['Row']
export type CandidateInsert = Database['public']['Tables']['candidates']['Insert']
export type CandidateUpdate = Database['public']['Tables']['candidates']['Update']

export type CandidateSkills = Database['public']['Tables']['candidates']['Row']['skills']

// Candidate Note types
export type CandidateNote = Database['public']['Tables']['candidate_notes']['Row']
export type CandidateNoteInsert = Database['public']['Tables']['candidate_notes']['Insert']
export type CandidateNoteUpdate = Database['public']['Tables']['candidate_notes']['Update']

// Filters for querying candidates
export interface CandidateFilters {
  page?: number
  limit?: number
  search?: string
}

// Interface for candidate list response with data and count
export interface CandidateListResponse {
  data: Candidate[]
  count: number | null
}
