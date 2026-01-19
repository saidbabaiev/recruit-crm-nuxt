<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

const filters = ref({
  search: '',
  status: undefined,
  page: 1,
  limit: 10,
})

const { useCandidatesList } = useCandidates()
const { data: candidatesResponse, isPending, error } = useCandidatesList(filters)

const candidates = computed(() => candidatesResponse.value?.data || [])

watch([() => filters.value.search, () => filters.value.status], () => {
  filters.value.page = 1
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Candidates
        </h1>
        <p class="text-muted-foreground mt-1">
          Manage and track all your candidates
        </p>
      </div>
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
      <Select v-model="filters.status">
        <SelectTrigger class="w-full sm:w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            All Statuses
          </SelectItem>
          <SelectItem value="new">
            New
          </SelectItem>
          <SelectItem value="screening">
            Screening
          </SelectItem>
          <SelectItem value="interview">
            Interview
          </SelectItem>
          <SelectItem value="offer">
            Offer
          </SelectItem>
          <SelectItem value="hired">
            Hired
          </SelectItem>
          <SelectItem value="rejected">
            Rejected
          </SelectItem>
        </SelectContent>
      </Select>
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
      <!-- <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
      /> -->

      <CandidatesTable
        :data="candidates"
      />
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
