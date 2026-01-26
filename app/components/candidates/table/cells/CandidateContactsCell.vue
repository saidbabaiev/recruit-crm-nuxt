<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Mail, Phone } from 'lucide-vue-next'
import CopyButton from '@/components/common/CopyButton.vue'

interface Props {
  candidate: Candidate
}
defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-1 min-w-[160px]">
    <div class="flex items-center gap-1.5 text-xs">
      <Mail class="h-3 w-3 shrink-0" />
      <div
        v-if="candidate.email"
        class="flex items-center gap-2 min-w-0"
      >
        <span class="truncate">{{ candidate.email }}</span>
        <CopyButton
          :value="candidate.email"
          size="xs"
        />
      </div>
    </div>
    <div
      v-if="candidate.phone"
      class="flex items-center gap-1.5 text-xs"
    >
      <Phone class="h-3 w-3 shrink-0" />
      <div
        class="flex items-center gap-2 min-w-0"
      >
        <span class="truncate">{{ candidate.phone }}</span>
        <CopyButton
          :value="candidate.phone"
          size="xs"
        />
      </div>
    </div>
  </div>
</template>
