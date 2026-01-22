<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Calendar, Clock } from 'lucide-vue-next'

defineProps<{
  candidate: Candidate
}>()

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
  <div class="flex items-center justify-between text-xs text-muted-foreground mb-3">
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
</template>
