<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Mail } from 'lucide-vue-next'
import CopyButton from '@/components/common/CopyButton.vue'

interface Props {
  candidate: Candidate
}
defineProps<Props>()
</script>

<template>
  <div
    v-if="candidate.email"
    class="min-w-[220px] flex items-center gap-1.5 text-sm"
  >
    <Mail class="h-3.5 w-3.5 shrink-0" />
    <div
      v-if="candidate.email"
      class="flex items-center gap-2 min-w-0"
    >
      <span class="truncate">{{ candidate.email }}</span>
      <CopyButton
        :value="candidate.email"
      />
    </div>
  </div>
</template>
