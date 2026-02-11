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

export const NOTICE_PERIOD_OPTIONS = [
  '1 week', '2 weeks', '3 weeks',
  '1 month', '2 months', '3 months', '4 months', '5 months', '6 months',
  '7 months', '8 months', '9 months', '10 months', '11 months', '12 months',
] as const

export type NoticePeriod = typeof NOTICE_PERIOD_OPTIONS[number] | 'null'
