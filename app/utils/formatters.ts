import type { Candidate } from '@/types/candidates'

/**
 * Format date
 * Examples: "2026-01-01" => "Jan 1, 2026"
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
 * Format salary range
 * Examples: formatSalary(4999, 5000, 'USD', 'monthly') => "$4,999 – $5,000 / mo"
 */
export const formatSalary = (
  min: number,
  max: number,
  currency: string,
  period: 'monthly' | 'yearly' | string | null,
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  })

  const salaryRange = min === max
    ? formatter.format(min)
    : formatter.formatRange(min, max)

  const periodLabel = period === 'monthly' ? '/ mo' : period === 'yearly' ? '/ yr' : ''

  return `${salaryRange} ${periodLabel}`
}

/**
 * Format candidate full name
 * Examples: "['John', 'Doe']" => "John Doe"
 */
export function getFullName(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c) return 'Unknown Candidate'
  return [c.first_name, c.last_name].filter(Boolean).join(' ')
}

/**
 * Format candidate initials
 * Examples: "John Doe" => "JD"
 */
export function getCandidateInitials(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c?.first_name && !c?.last_name) return ''
  const first = c.first_name?.charAt(0) || ''
  const last = c.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
}

/**
 * Format experience years
 * Examples: "1+ years", "Not specified"
 */
export function getCandidateExperienceLabel(experienceYears: number | null): string {
  const years = experienceYears || 0
  return years ? `${years}+ years` : 'Not specified'
}

/**
 * Format visa status
 * Examples: "Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Visa Required"
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
 * Format remote preference
 * Examples: "Remote", "Hybrid", "On-site", "Not specified"
 */
export function formatRemotePreference(preference: string | null): string {
  if (!preference) return 'Not specified'
  return preference
}
