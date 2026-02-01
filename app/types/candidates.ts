import type { Database } from '@/types/supabase'
import type { WorkFormat } from './enums'

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
export type CandidateExperienceRange = '' | '0-1' | '1-3' | '3-5' | '5-10' | '10+'

export interface CandidateFilters {
  page?: number
  limit?: number
  search?: string
  experience?: CandidateExperienceRange
  workFormat?: WorkFormat
}

// Interface for candidate list response with data and count
export interface CandidateListResponse {
  data: Candidate[]
  count: number | null
}
