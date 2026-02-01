<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog.vue'
import AsyncState from '@/components/common/AsyncState.vue'
import CandidatesTable from '@/components/candidates/table/CandidatesTable.vue'
import { createColumns } from '@/components/candidates/table/columns'

import type { Candidate } from '@/types/candidates'

import { normalizeError } from '@/utils/errors'

// --- Composables & Instances ---
const queryClient = useQueryClient()
const { $toast } = useNuxtApp()
const { useCandidatesList, useDeleteCandidate } = useCandidates()

// --- Reactive State ---
const filters = ref({
  search: '',
  page: 1,
  limit: 10,
})

const debouncedSearch = ref('')
const isDeleteAlertOpen = ref(false)
const candidateToDelete = ref<Candidate | null>(null)

const updateSearch = useDebounceFn((value: string) => {
  debouncedSearch.value = value
  filters.value.page = 1
}, 500)

// --- Computed ---
const params = computed(() => ({
  page: filters.value.page,
  limit: filters.value.limit,
  search: debouncedSearch.value,
}))

const candidates = computed(() => candidatesResponse.value?.data || [])
const totalCount = computed(() => candidatesResponse.value?.count || 0)

// --- Watchers ---
watch(() => filters.value.search, updateSearch)

// --- Queries & Mutations ---
const { data: candidatesResponse, isPending, error } = useCandidatesList(params)

const { mutate: deleteCandidateMutation } = useDeleteCandidate({
  onSuccess: () => {
    $toast.success('Candidate deleted successfully')
    queryClient.invalidateQueries({ queryKey: ['candidates', 'list'] })
    isDeleteAlertOpen.value = false
    candidateToDelete.value = null
  },
  onError: (err: unknown) => {
    const normalizedError = normalizeError(err)
    $toast.error(normalizedError.message)
  },
})

const tableColumns = computed(() => createColumns(handleDeleteCandidate))

const handleDeleteCandidate = (candidate: Candidate) => {
  isDeleteAlertOpen.value = true
  candidateToDelete.value = candidate
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between ">
      <h1 class="text-lg font-bold">
        Candidates List
      </h1>
    </div>

    <!-- Filters Section -->
    <CandidatesFilters
      v-model:search="filters.search"
    />

    <AsyncState
      :skip-loading="true"
      :error="error"
      :is-empty="!isPending && candidates.length === 0"
      empty-title="No candidates found"
      empty-description="Try adjusting your search or filters to find candidates."
    >
      <div
        v-if="candidates?.length || isPending"
        class="mb-3"
      >
        <CandidatesTable
          :data="candidates"
          :is-loading="isPending"
          :columns="tableColumns"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="totalCount > filters.limit"
        class="flex items-center justify-between"
      >
        <Pagination
          v-slot="{ page }"
          v-model:page="filters.page"
          :total="totalCount"
          :items-per-page="filters.limit"
          :sibling-count="1"
          show-edges
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious />

            <template
              v-for="(item, index) in items"
              :key="index"
            >
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
                size="sm"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis
                v-else
                :index="index"
              />
            </template>

            <PaginationNext />
          </PaginationContent>
        </Pagination>

        <div class="text-xs text-muted-foreground min-w-50">
          Showing {{ (filters.page - 1) * filters.limit + 1 }}-{{ Math.min(filters.page * filters.limit, totalCount) }} of {{ totalCount }} candidates
        </div>
      </div>
    </AsyncState>

    <DeleteConfirmDialog
      v-model:open="isDeleteAlertOpen"
      title="Delete Candidate"
      :entity-name="candidateToDelete?.first_name + ' ' + candidateToDelete?.last_name"
      entity-type="candidate"
      @confirm="deleteCandidateMutation(candidateToDelete!.id)"
    />
  </div>
</template>
