import type { CandidateSkills } from '@/types/candidates'
import type { Job, JobMatch, JobSkills } from '@/types/jobs'

/**
 * Calculates match percentage between candidate skills and job stack
 * Pure function - no side effects
 * @param candidateSkills - Array of candidate skills (can be null)
 * @param jobStack - Array of job required skills (can be null)
 * @returns Match percentage from 0 to 100
 */
export function calculateMatchPercentage(
  candidateSkills: CandidateSkills,
  jobStack: JobSkills,
): number {
  if (!candidateSkills || candidateSkills.length === 0) return 0
  if (!jobStack || jobStack.length === 0) return 0

  // Normalize skills to lowercase for case-insensitive comparison
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim())
  const normalizedJobStack = jobStack.map(s => s.toLowerCase().trim())

  // Calculate matches
  const matchedCount = normalizedJobStack.filter(skill =>
    normalizedCandidateSkills.includes(skill),
  ).length

  // Return 0-100
  return Math.round((matchedCount / normalizedJobStack.length) * 100)
}

/**
 * Calculates detailed match info between candidate and job
 * @param candidateSkills - Array of candidate skills
 * @param job - Job object with skills/stack
 * @returns Detailed match information with matched/missing skills
 */
export function calculateJobMatch(
  candidateSkills: CandidateSkills,
  job: Job,
): JobMatch {
  const jobStack = job.skills || []

  // Handle null or empty cases
  if (!candidateSkills || candidateSkills.length === 0 || jobStack.length === 0) {
    return {
      job,
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: jobStack,
    }
  }

  // Normalize once for comparison
  const normalizedCandidateSkills = new Set(
    candidateSkills.map(skill => skill.toLowerCase().trim()),
  )

  // Find matched skills (preserve original casing from job)
  const matchedSkills = jobStack.filter(skill =>
    normalizedCandidateSkills.has(skill.toLowerCase().trim()),
  )

  // Find missing skills
  const missingSkills = jobStack.filter(skill =>
    !normalizedCandidateSkills.has(skill.toLowerCase().trim()),
  )

  // Calculate percentage
  const matchPercentage = Math.round((matchedSkills.length / jobStack.length) * 100)

  return {
    job,
    matchPercentage,
    matchedSkills,
    missingSkills,
  }
}

/**
 * Sorts jobs by match percentage in descending order (best matches first)
 * Pure function - does not mutate original array
 * @param matches - Array of job match objects
 * @returns Sorted array with highest match percentage first
 */
export function sortByMatchPercentage(matches: JobMatch[]): JobMatch[] {
  return [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage)
}
