<script setup lang="ts">
import { Briefcase } from 'lucide-vue-next'
import type { JobMatch } from '@/types/jobs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

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
  invite: { text: 'Invite', variant: 'default' as const, disabled: false },
  loading: { text: 'Inviting...', variant: 'secondary' as const, disabled: true },
  applied: { text: 'Applied', variant: 'outline' as const, disabled: true },
}

// Get badge variant based on match percentage
function getMatchVariant(percentage: number) {
  if (percentage >= 80) return 'default' // Green/Success
  if (percentage >= 50) return 'secondary' // Yellow/Warning
  return 'outline' // Gray/Low
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
  <Card>
    <CardContent class="p-4">
      <!-- Header: Title + Match Badge -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-base leading-tight truncate">
            {{ match.job.title }}
          </h3>
          <!-- <div class="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Building2 class="h-3.5 w-3.5 shrink-0" />
            <span class="truncate">{{ match.job.company || 'Company not specified' }}</span>
          </div> -->
        </div>

        <Badge
          :variant="getMatchVariant(match.matchPercentage)"
          class="flex shrink-0"
        >
          {{ match.matchPercentage }}% Match
        </Badge>
      </div>

      <!-- Skills Comparison -->
      <div class="space-y-2 mb-4">
        <!-- Matched Skills -->
        <div v-if="match.matchedSkills.length > 0">
          <span class="text-xs font-medium text-muted-foreground">Matched Skills:</span>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <Badge
              v-for="skill in match.matchedSkills"
              :key="skill"
              variant="default"
              class="text-xs"
            >
              {{ skill }}
            </Badge>
          </div>
        </div>

        <!-- Missing Skills -->
        <div v-if="match.missingSkills.length > 0">
          <span class="text-xs font-medium text-muted-foreground">Missing Skills:</span>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <Badge
              v-for="skill in match.missingSkills"
              :key="skill"
              variant="secondary"
              class="text-xs"
            >
              {{ skill }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <Button
        :variant="buttonConfig[buttonState].variant"
        :disabled="buttonConfig[buttonState].disabled"
        size="sm"
        class="w-full"
        @click="handleInvite"
      >
        <Briefcase class="mr-2 h-4 w-4" />
        {{ buttonConfig[buttonState].text }}
      </Button>
    </CardContent>
  </Card>
</template>
