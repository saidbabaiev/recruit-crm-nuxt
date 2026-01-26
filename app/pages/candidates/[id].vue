<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AsyncState from '@/components/common/AsyncState.vue'

import CandidateMainInfo from '@/components/candidates/detail/CandidateMainInfo.vue'
import CandidateDetails from '@/components/candidates/detail/CandidateDetails.vue'
import CandidateJobMatching from '@/components/candidates/detail/CandidateJobMatching.vue'
import CandidateMetaData from '@/components/candidates/detail/CandidateMetaData.vue'

const route = useRoute()
const candidateId = computed(() => route.params.id as string)

const { useCandidateDetails } = useCandidates()
const { data: candidate, isPending, error } = useCandidateDetails(candidateId)

// Navigate back to list
const goBack = () => navigateTo('/candidates')
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        @click="goBack"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Candidates
      </Button>
      <CandidateMetaData
        v-if="candidate"
        :candidate="candidate"
      />
    </div>

    <AsyncState
      :is-loading="isPending"
      :error="error"
      :empty="!candidate"
      empty-title="Candidate not found"
    >
      <template #loading>
        <div class="text-center py-12">
          <p class="text-muted-foreground">
            Loading candidate details...
          </p>
        </div>
      </template>
      <div
        v-if="candidate"
        class="space-y-6"
      >
        <CandidateMainInfo :candidate="candidate" />

        <CandidateDetails :candidate="candidate" />

        <CandidateJobMatching :candidate="candidate" />
      </div>
    </AsyncState>
  </div>
</template>
