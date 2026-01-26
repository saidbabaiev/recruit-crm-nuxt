import type { CandidateSkills } from '@/types/candidates'
import type { Job, JobMatch, JobSkills } from '@/types/jobs'

/**
 * Calculate match percentage between candidate skills and job requirements
 * @returns Percentage from 0 to 100
 */
export function calculateMatchPercentage(
  candidateSkills: CandidateSkills,
  jobStack: JobSkills,
): number {
  if (!candidateSkills || candidateSkills.length === 0) return 0
  if (!jobStack || jobStack.length === 0) return 0

  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim())
  const normalizedJobStack = jobStack.map(s => s.toLowerCase().trim())

  const matchedCount = normalizedJobStack.filter(skill =>
    normalizedCandidateSkills.includes(skill),
  ).length

  return Math.round((matchedCount / normalizedJobStack.length) * 100)
}

/**
 * Calculate detailed match info between candidate and job
 * @returns JobMatch with percentage, matched skills, and missing skills
 */
export function calculateJobMatch(
  candidateSkills: CandidateSkills,
  job: Job,
): JobMatch {
  const jobStack = job.skills || []

  if (!candidateSkills || candidateSkills.length === 0 || jobStack.length === 0) {
    return {
      job,
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: jobStack,
    }
  }

  const normalizedCandidateSkills = new Set(
    candidateSkills.map(skill => skill.toLowerCase().trim()),
  )

  const matchedSkills = jobStack.filter(skill =>
    normalizedCandidateSkills.has(skill.toLowerCase().trim()),
  )

  const missingSkills = jobStack.filter(skill =>
    !normalizedCandidateSkills.has(skill.toLowerCase().trim()),
  )

  const matchPercentage = Math.round((matchedSkills.length / jobStack.length) * 100)

  return {
    job,
    matchPercentage,
    matchedSkills,
    missingSkills,
  }
}

/**
 * Sort jobs by match percentage in descending order (best matches first)
 * @returns Array of JobMatch sorted by match percentage
*/
export function sortByMatchPercentage(matches: JobMatch[]): JobMatch[] {
  return [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage)
}
