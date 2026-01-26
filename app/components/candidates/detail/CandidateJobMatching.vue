<script setup lang="ts">
import { Briefcase } from 'lucide-vue-next'
import type { Candidate } from '@/types/candidates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateJobMatch, sortByMatchPercentage } from '@/utils/job-matching'
import JobMatchItem from './JobMatchItem.vue'
import AsyncState from '@/components/common/AsyncState.vue'

interface Props {
  candidate: Candidate
}

const { candidate } = defineProps<Props>()

// Fetch jobs (open positions only)
const { useJobsList } = useJobs()
const { data: jobsResponse, refetch: refetchJobs, isPending: isLoadingJobs, error: jobsError } = useJobsList({ status: 'open' })

// Fetch existing applications for this candidate
const { useApplicationsByCandidate } = useApplications()
const { data: applications, isPending: isLoadingApplications } = useApplicationsByCandidate(
  computed(() => candidate.id),
)

// Calculate job matches
const jobMatches = computed(() => {
  if (!jobsResponse.value?.data || !candidate.skills || candidate.skills.length === 0) {
    return []
  }

  const matches = jobsResponse.value.data.map(job =>
    calculateJobMatch(candidate.skills, job))
    .filter(match => match.matchPercentage > 0)

  return sortByMatchPercentage(matches)
})

// Check if candidate already applied to a job
function isAlreadyApplied(jobId: string): boolean {
  if (!applications.value) return false
  return applications.value.some(app => app.job_id === jobId)
}

// Loading state
const isLoading = computed(() =>
  isLoadingJobs.value || isLoadingApplications.value,
)

// Empty state messages
const emptyStateMessage = computed(() => {
  if (!candidate.skills || candidate.skills.length === 0) {
    return 'Add skills to candidate profile to see matching jobs'
  }
  if (jobMatches.value.length === 0) {
    return 'No open positions available at the moment'
  }
  return null
})
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <Briefcase class="h-5 w-5 text-muted-foreground" />
        <CardTitle>Job Matching</CardTitle>
      </div>
      <CardDescription>
        Best matching open positions based on candidate skills
      </CardDescription>
    </CardHeader>

    <CardContent>
      <AsyncState
        :is-loading="isLoading"
        :error="jobsError"
        :is-empty="jobMatches.length === 0"
        empty-title="No matches found"
        :empty-description="emptyStateMessage"
        @retry="refetchJobs"
      >
        <div
          v-if="jobMatches"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <JobMatchItem
            v-for="match in jobMatches"
            :key="match.job.id"
            :match="match"
            :candidate-id="candidate.id"
            :is-already-applied="isAlreadyApplied(match.job.id)"
          />
        </div>
      </AsyncState>
    </CardContent>
  </Card>
</template>
