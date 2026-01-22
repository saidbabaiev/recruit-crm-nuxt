<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Props {
  candidate: Candidate
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3">
    <Avatar class="h-8 w-8">
      <AvatarFallback class="bg-linear-to-br from-blue-300 to-violet-300 text-white font-semibold">
        {{ getCandidateInitials(candidate) }}
      </AvatarFallback>
    </Avatar>
    <div>
      <div class="font-medium">
        {{ getFullName(candidate) }}
      </div>
      <div class="text-xs text-muted-foreground">
        {{ candidate.current_position || 'No position' }}
      </div>
    </div>
  </div>
</template>
