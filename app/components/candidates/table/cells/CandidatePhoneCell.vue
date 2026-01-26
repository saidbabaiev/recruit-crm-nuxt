<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Phone } from 'lucide-vue-next'
import CopyButton from '@/components/common/CopyButton.vue'

interface Props {
  candidate: Candidate
}
defineProps<Props>()
</script>

<template>
  <div class="min-w-[200px]">
    <div
      v-if="candidate.phone"
      class="flex items-center gap-1.5 text-sm"
    >
      <Phone class="h-3.5 w-3.5 shrink-0" />
      <div
        class="flex items-center gap-2 min-w-0"
      >
        <span class="truncate">{{ candidate.phone }}</span>
        <CopyButton :value="candidate.phone" />
      </div>
    </div>
    <div
      v-else
      class="text-muted-foreground"
    >
      Not specified
    </div>
  </div>
</template>
