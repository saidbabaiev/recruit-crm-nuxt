<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Mail, Phone } from 'lucide-vue-next'

interface Props {
  candidate: Candidate
}
defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1 min-w-45">
    <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Mail class="h-3 w-3 shrink-0" />
      <span
        class="truncate"
      >{{ candidate.email }}</span>
    </div>
    <div
      v-if="candidate.phone"
      class="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <Phone class="h-3 w-3 shrink-0" />
      <span class="truncate">{{ candidate.phone }}</span>
    </div>
  </div>
</template>
