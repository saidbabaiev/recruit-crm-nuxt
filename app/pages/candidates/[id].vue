<script setup lang="ts">
import { ArrowLeft, Clock, Calendar } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CandidateMainInfo from '@/components/candidates/detail/CandidateMainInfo.vue'
import CandidateDetails from '~/components/candidates/detail/CandidateDetails.vue'
import CandidateJobMatching from '~/components/candidates/detail/CandidateJobMatching.vue'

const route = useRoute()
const candidateId = computed(() => route.params.id as string)

const { useCandidateDetails } = useCandidates()
const { data: candidate, isPending, error } = useCandidateDetails(candidateId)

// Navigate back to list
const goBack = () => navigateTo('/candidates')

// Format date
const formatDate = (date: string | null) => {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Back button -->
    <Button
      variant="ghost"
      size="sm"
      @click="goBack"
    >
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Candidates
    </Button>

    <!-- Loading state -->
    <div
      v-if="isPending"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        Loading candidate...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-center py-12"
    >
      <p class="text-destructive">
        {{ error.message }}
      </p>
      <Button
        class="mt-4"
        @click="goBack"
      >
        Back to List
      </Button>
    </div>

    <!-- Success state -->
    <div
      v-else-if="candidate"
      class="max-w-6xl mx-auto"
    >
      <!-- Main Info -->
      <CandidateMainInfo :candidate="candidate" />

      <CandidateDetails :candidate="candidate" />

      <!-- Metadata Footer -->
      <div class="flex items-center justify-between text-xs text-muted-foreground mt-6">
        <div class="flex items-center gap-2">
          <Clock class="h-3 w-3" />
          <span>Created: {{ formatDate(candidate.created_at) }}</span>
        </div>
        <div
          v-if="candidate.updated_at"
          class="flex items-center gap-2"
        >
          <Calendar class="h-3 w-3" />
          <span>Last Updated: {{ formatDate(candidate.updated_at) }}</span>
        </div>
      </div>

      <CandidateJobMatching :candidate="candidate" />
    </div>
  </div>
</template>
