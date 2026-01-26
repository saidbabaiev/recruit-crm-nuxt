<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Plus } from 'lucide-vue-next'

import { useDebounceFn } from '@vueuse/core'
import AsyncState from '@/components/common/AsyncState.vue'

const filters = ref({
  search: '',
  page: 1,
  limit: 10,
})

const debouncedSearch = ref('')

const updateSearch = useDebounceFn((value: string) => {
  debouncedSearch.value = value
  filters.value.page = 1
}, 500)

watch(() => filters.value.search, updateSearch)

const params = computed(() => ({
  page: filters.value.page,
  limit: filters.value.limit,
  search: debouncedSearch.value,
}))

const { useCandidatesList } = useCandidates()
const { data: candidatesResponse, isPending, error } = useCandidatesList(params)

const candidates = computed(() => candidatesResponse.value?.data || [])
const totalCount = computed(() => candidatesResponse.value?.count || 0)
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
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <Input
          v-model="filters.search"
          type="search"
          placeholder="Search candidates by name, email, phone or location..."
          class="w-full"
        />
      </div>

      <Button>
        <Plus class="mr-2 h-4 w-4" />
        Add Candidate
      </Button>
    </div>

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
  </div>
</template>
