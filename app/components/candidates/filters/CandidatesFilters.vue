<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { CandidateExperienceRange } from '@/types/candidates'

interface Props {
  search: string
  experience: CandidateExperienceRange
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:experience', value: CandidateExperienceRange): void
}>()

const search = computed({
  get: () => props.search,
  set: value => emit('update:search', value),
})

const experience = computed({
  get: () => props.experience,
  set: value => emit('update:experience', value as CandidateExperienceRange),
})

const clearFilters = () => {
  experience.value = '' as CandidateExperienceRange
}
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between gap-4">
    <div class="flex items-center gap-4">
      <Input
        v-model="search"
        type="search"
        placeholder="Search candidates by name, email, phone or location..."
        class="w-full"
      />

      <Select v-model="experience">
        <SelectTrigger>
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-1">
            0-1 years
          </SelectItem>
          <SelectItem value="1-3">
            1-3 years
          </SelectItem>
          <SelectItem value="3-5">
            3-5 years
          </SelectItem>
          <SelectItem value="5-10">
            5-10 years
          </SelectItem>
          <SelectItem value="10+">
            10+ years
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        v-if="experience"
        variant="ghost"
        class="cursor-pointer"
        @click="clearFilters"
      >
        Clear
      </Button>
    </div>

    <Button>
      <Plus class="mr-2 h-4 w-4" />
      Add Candidate
    </Button>
  </div>
</template>
