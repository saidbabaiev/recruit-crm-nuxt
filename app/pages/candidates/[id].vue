<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import CandidateMainInfo from '@/components/candidates/detail/CandidateMainInfo.vue'
import CandidateDetails from '~/components/candidates/detail/CandidateDetails.vue'
import CandidateJobMatching from '~/components/candidates/detail/CandidateJobMatching.vue'
import CandidateMetaData from '~/components/candidates/detail/CandidateMetaData.vue'

const route = useRoute()
const candidateId = computed(() => route.params.id as string)

const { useCandidateDetails } = useCandidates()
const { data: candidate, isPending, error } = useCandidateDetails(candidateId)

// Navigate back to list
const goBack = () => navigateTo('/candidates')
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
      class="space-y-6"
    >
      <CandidateMetaData :candidate="candidate" />

      <CandidateMainInfo :candidate="candidate" />

      <CandidateDetails :candidate="candidate" />

      <CandidateJobMatching :candidate="candidate" />
    </div>
  </div>
</template>
