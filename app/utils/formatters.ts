import type { Candidate } from '@/types/candidates'

/**
 * Format date string to human-readable format
 * @param date - ISO date string or null
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string | null): string {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get full name of the candidate
 * @param c - Candidate object with first_name and last_name
 * @returns Full name or "Unknown Candidate"
 */
export function getFullName(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c) return 'Unknown Candidate'
  return [c.first_name, c.last_name].filter(Boolean).join(' ')
}

/**
 * Get candidate initials from first and last name
 * @param c - Candidate object with first_name and last_name
 * @returns Uppercase initials (e.g., "JD")
 */
export function getCandidateInitials(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c?.first_name && !c?.last_name) return ''
  const first = c.first_name?.charAt(0) || ''
  const last = c.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
}

/**
 * Format salary range with currency and period
 * @param min - Minimum salary
 * @param max - Maximum salary
 * @param currency - Currency code (e.g., "USD", "EUR")
 * @param period - Pay period (e.g., "year", "month")
 * @returns Formatted salary range string
 */
export function getSalaryRangeLabel(
  min: number | null,
  max: number | null,
  currency: string | null,
  period: string | null,
): string {
  if (min && max) {
    return `${min} ${currency} - ${max} ${currency} ${period}`
  }
  else if (min) {
    return `From ${min} ${currency} ${period}`
  }
  else if (max) {
    return `Up to ${max} ${currency} ${period}`
  }
  else {
    return 'Salary not specified'
  }
}

/**
 * Format candidate experience years
 * @param experienceYears - Number of years of experience
 * @returns Formatted experience label (e.g., "5+ years")
 */
export function getCandidateExperienceLabel(experienceYears: number | null): string {
  const years = experienceYears || 0
  return years ? `${years}+ years` : 'Not specified'
}

/**
 * Format visa status to human-readable string
 * @param visaStatus - Raw visa status string
 * @returns Formatted visa status
 */
export function formatVisaStatus(visaStatus: string | null): string {
  if (!visaStatus) return 'Not specified'
  const map: Record<string, string> = {
    citizen: 'Citizen',
    permanent_resident: 'Permanent Resident',
    work_visa: 'Work Permit',
    student_visa: 'Student Visa',
    requires_sponsorship: 'Visa Required',
  }
  return map[visaStatus] || visaStatus
}

/**
 * Format remote work preference to human-readable string
 * @param preference - Raw preference string
 * @returns Formatted preference
 */
export function formatRemotePreference(preference: string | null): string {
  if (!preference) return 'Not specified'
  const map: Record<string, string> = {
    remote: 'Remote Only',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  }
  return map[preference] || preference
}
