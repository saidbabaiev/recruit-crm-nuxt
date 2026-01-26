import type { Candidate } from '@/types/candidates'

export function formatDate(date: string | null): string {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getFullName(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c) return 'Unknown Candidate'
  return [c.first_name, c.last_name].filter(Boolean).join(' ')
}

export function getCandidateInitials(c: Pick<Candidate, 'first_name' | 'last_name'> | null): string {
  if (!c?.first_name && !c?.last_name) return ''
  const first = c.first_name?.charAt(0) || ''
  const last = c.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
}

/**
 * Format salary range with currency and period
 * Examples: "50000 USD - 80000 USD year", "From 3000 EUR month"
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

export function getCandidateExperienceLabel(experienceYears: number | null): string {
  const years = experienceYears || 0
  return years ? `${years}+ years` : 'Not specified'
}

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

export function formatRemotePreference(preference: string | null): string {
  if (!preference) return 'Not specified'
  const map: Record<string, string> = {
    remote: 'Remote Only',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  }
  return map[preference] || preference
}
