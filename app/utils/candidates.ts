import type { Candidate } from "~/types/database";

/**
 * Get full name of the candidate
 * @param c Candidate object with first_name and last_name
 * @returns Full name of the candidate or 'Unknown Candidate' if not available
 */
export const getFullName = (c: Pick<Candidate, 'first_name' | 'last_name'> | null) => {
    if (!c) return 'Unknown Candidate';
    return [c.first_name, c.last_name].filter(Boolean).join(' ');
}
/**
 * Get candidate initials
 * @param c Candidate object with first_name and last_name
 * @returns Initials of the candidate in uppercase
 */
export const getCandidateInitials = (c: Pick<Candidate, 'first_name' | 'last_name'> | null) => {
    if (!c?.first_name && !c?.last_name) return ''
    const first = c.first_name?.charAt(0) || ''
    const last = c.last_name?.charAt(0) || ''
    return (first + last).toUpperCase()
}

/**
 * Get candidate experience label
 * @param years Number of years of experience
 * @returns Experience label string
 */
export const getCandidateExperienceLabel = (c: Pick<Candidate, 'experience_years'> | null) => {
    const years = c?.experience_years || 0;
    return years ? `${years}+ years experience` : 'No experience'
}