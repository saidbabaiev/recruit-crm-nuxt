<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Calendar, Clock } from 'lucide-vue-next'
import { formatDate } from '@/utils/formatters'

defineProps<{
  candidate: Candidate
}>()
</script>

<template>
  <div class="text-xs text-muted-foreground">
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
