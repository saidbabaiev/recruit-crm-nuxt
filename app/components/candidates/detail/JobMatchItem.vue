<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import SkillsList from '@/components/common/SkillsList.vue'
import { Separator } from '@/components/ui/separator'

import type { JobMatch } from '@/types/jobs'
import {
  getSalaryRangeLabel,
  formatRemotePreference,
  getCandidateExperienceLabel,
} from '@/utils/common'

interface Props {
  match: JobMatch
  candidateId: string
  isAlreadyApplied: boolean
}

const { match, candidateId, isAlreadyApplied } = defineProps<Props>()

const { useCreateApplication } = useApplications()
const { mutate: assignToJob, isPending } = useCreateApplication()

// Check company readiness
const { isReady: isCompanyReady } = useCompanyContext()

// Determine button state
const buttonState = computed(() => {
  if (!isCompanyReady.value) return 'loading' // Block until loaded
  if (isPending.value) return 'loading'
  if (isAlreadyApplied) return 'applied'
  return 'invite'
})

const buttonConfig = {
  invite: { text: 'Assign', variant: 'default' as const, disabled: false },
  loading: { text: 'Assigning...', variant: 'secondary' as const, disabled: true },
  applied: { text: 'Assigned', variant: 'outline' as const, disabled: true },
}

// Get badge color based on match percentage
function getMatchColor(percentage: number) {
  if (percentage >= 90) return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  if (percentage >= 70) return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
  if (percentage >= 50) return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
  return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
}

// Handle invite action
function handleInvite() {
  if (!isCompanyReady.value) return
  if (isAlreadyApplied || isPending.value) return

  assignToJob({
    candidate_id: candidateId,
    job_id: match.job.id,
    status: 'new',
  })
}
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardContent>
      <div>
        <div class="flex items-center justify-between gap-4 mb-1">
          <h3 class="font-semibold text-base leading-tight truncate">
            {{ match.job.title }}
          </h3>
          <Badge
            :class="getMatchColor(match.matchPercentage)"
            class="flex shrink-0"
          >
            {{ match.matchPercentage }}% Match
          </Badge>
        </div>
        <p class="text-xs">
          {{ match.job.description }}
        </p>
      </div>

      <Separator class="my-2" />

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm ">
            <MapPin class="h-3.5 w-3.5 shrink-0" />
            <span>{{ match.job.location || 'Location not specified' }}</span>
          </div>

          <div class="text-xs">
            {{ formatRemotePreference(match.job.work_format) || 'Work format not specified' }}
          </div>
        </div>

        <div>
          <span class="text-xs font-medium text-muted-foreground">Salary:</span>
          <div class="text-sm">
            {{
              getSalaryRangeLabel(
                match.job.salary_min,
                match.job.salary_max,
                match.job.salary_currency,
                match.job.salary_period,
              )
            }}
          </div>
        </div>

        <div>
          <span class="text-xs font-medium text-muted-foreground">Experience:</span>
          <div class="text-sm text-foreground">
            {{ getCandidateExperienceLabel(match.job.min_experience_value) }}
          </div>
        </div>
        <!-- Matched Skills -->
        <div v-if="match.matchedSkills.length > 0">
          <span class="text-xs font-medium text-muted-foreground">Matched Skills:</span>

          <SkillsList
            :skills="match.matchedSkills"
            :max-visible="6"
            text-size="sm"
          />
        </div>

        <!-- Missing Skills -->
        <div v-if="match.missingSkills.length > 0">
          <span class="text-xs font-medium text-muted-foreground">Missing Skills:</span>
          <SkillsList
            :skills="match.missingSkills"
            :max-visible="6"
            text-size="sm"
          />
        </div>
      </div>
    </CardContent>
    <CardFooter class="mt-auto flex justify-center">
      <Button
        :variant="buttonConfig[buttonState].variant"
        :disabled="buttonConfig[buttonState].disabled"
        class="cursor-pointer w-3/4"
        @click="handleInvite"
      >
        {{ buttonConfig[buttonState].text }}
      </Button>
    </CardFooter>
  </Card>
</template>
