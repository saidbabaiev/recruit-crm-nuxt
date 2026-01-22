import type { Candidate } from '@/types/candidates'

/**
 * Get full name of the candidate
 */
export const getFullName = (c: Pick<Candidate, 'first_name' | 'last_name'> | null) => {
  if (!c) return 'Unknown Candidate'
  return [c.first_name, c.last_name].filter(Boolean).join(' ')
}
/**
 * Get candidate initials
 */
export const getCandidateInitials = (c: Pick<Candidate, 'first_name' | 'last_name'> | null) => {
  if (!c?.first_name && !c?.last_name) return ''
  const first = c.first_name?.charAt(0) || ''
  const last = c.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
}
