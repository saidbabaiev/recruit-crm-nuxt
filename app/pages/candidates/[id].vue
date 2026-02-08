<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AsyncState from '@/components/common/AsyncState.vue'

import CandidateMainInfo from '@/components/candidates/detail/CandidateMainInfo.vue'
import CandidateDetails from '@/components/candidates/detail/CandidateDetails.vue'
import CandidateJobMatching from '@/components/candidates/detail/CandidateJobMatching.vue'
import CandidateMetaData from '@/components/candidates/detail/CandidateMetaData.vue'

import { useQueryClient } from '@tanstack/vue-query'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog.vue'
import EditCandidateSheet from '@/components/candidates/sheets/EditCandidateSheet.vue'
import { normalizeError } from '@/utils/errors'

const route = useRoute()
const candidateId = computed(() => route.params.id as string)

const { $toast } = useNuxtApp()
const queryClient = useQueryClient()
const { useCandidateDetails, useDeleteCandidate } = useCandidates()

const { data: candidate, isPending, error } = useCandidateDetails(candidateId)

const isDeleteAlertOpen = ref(false)
const isEditCandidateOpen = ref(false)

const { mutate: deleteCandidateMutation } = useDeleteCandidate({
  onSuccess: async () => {
    queryClient.removeQueries({
      queryKey: ['candidates', 'detail', candidateId.value],
    })

    queryClient.removeQueries({
      queryKey: ['candidates', 'list'],
    })

    $toast.success('Candidate deleted successfully')

    await navigateTo('/candidates')
  },
  onError: (err: unknown) => {
    const normalizedError = normalizeError(err)
    $toast.error(normalizedError.message)
  },
})

const handleDeleteCandidate = () => {
  isDeleteAlertOpen.value = true
}

const confirmDelete = () => {
  if (candidate.value) {
    deleteCandidateMutation(candidate.value.id)
  }
}

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
        <CandidateMainInfo
          :candidate="candidate"
          @delete="handleDeleteCandidate"
          @edit-candidate="isEditCandidateOpen = true"
        />

        <CandidateDetails :candidate="candidate" />

        <CandidateJobMatching :candidate="candidate" />
      </div>
    </AsyncState>

    <DeleteConfirmDialog
      v-model:open="isDeleteAlertOpen"
      title="Delete Candidate"
      :entity-name="candidate ? `${candidate.first_name} ${candidate.last_name}` : ''"
      entity-type="candidate"
      @confirm="confirmDelete"
    />

    <EditCandidateSheet
      v-if="candidate"
      v-model:open="isEditCandidateOpen"
      :candidate="candidate"
    />
  </div>
</template>
