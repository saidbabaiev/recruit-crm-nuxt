<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'

const filters = ref({
  search: '',
  page: 1,
  limit: 10,
})

const { useCandidatesList } = useCandidates()
const { data: candidatesResponse, isPending, error } = useCandidatesList(filters)

const candidates = computed(() => candidatesResponse.value?.data || [])
const totalCount = computed(() => candidatesResponse.value?.count || 0)
// const totalPages = computed(() => Math.ceil(totalCount.value / filters.value.limit))

watch(() => filters.value.search, () => {
  filters.value.page = 1
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold tracking-tight">
        Candidates List
      </h1>
      <Button>
        <Plus class="mr-2 h-4 w-4" />
        Add Candidate
      </Button>
    </div>

    <!-- Filters Section -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <Input
          v-model="filters.search"
          type="search"
          placeholder="Search candidates by name, email, or skills..."
          class="w-full"
        />
      </div>
      <Select>
        <SelectTrigger class="w-full sm:w-45">
          <SelectValue placeholder="Position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            All Positions
          </SelectItem>
          <SelectItem value="frontend">
            Frontend Developer
          </SelectItem>
          <SelectItem value="backend">
            Backend Developer
          </SelectItem>
          <SelectItem value="fullstack">
            Full Stack Developer
          </SelectItem>
          <SelectItem value="devops">
            DevOps Engineer
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Candidates Grid -->
    <div
      v-if="!isPending && !error && candidates?.length"
    >
      <CandidatesTable
        :data="candidates"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="!isPending && !error && totalCount > filters.limit"
      class="flex items-center justify-between"
    >
      <p class="text-sm text-muted-foreground">
        Showing {{ (filters.page - 1) * filters.limit + 1 }}-{{ Math.min(filters.page * filters.limit, totalCount) }} of {{ totalCount }} candidates
      </p>

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
    </div>

    <!-- Loading State -->
    <div
      v-if="isPending"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        Loading candidates...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="text-center py-12"
    >
      <p class="text-destructive">
        {{ error.message }}
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isPending && !error && !candidates?.length"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        No candidates found
      </p>
    </div>
  </div>
</template>
