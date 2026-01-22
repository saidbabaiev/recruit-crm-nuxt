/**
 * Get salary range label
 * @param min Minimum salary
 * @param max Maximum salary
 * @param currency Currency code
 * @param period Period (e.g., year, month)
 * @returns Formatted salary range string
 */
export function getSalaryRangeLabel(min: number | null, max: number | null, currency: string | null, period: string | null): string {
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
 * Get candidate experience label
 * @param experienceYears Number of years of experience
 * @returns Formatted experience label
 */
export const getCandidateExperienceLabel = (experienceYears: number | null) => {
  const years = experienceYears || 0
  return years ? `${years}+ years` : 'Not specified'
}

/**
 * Format visa status
 * @param visaStatus Visa status string
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
 * Format remote work preference
 * @param preference Remote work preference string
 * @returns Formatted remote work preference
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
