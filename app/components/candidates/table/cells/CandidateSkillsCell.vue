<script setup lang="ts">
import type { Candidate } from '@/types/candidates'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { computed } from 'vue'

interface Props {
  candidate: Candidate
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 4,
})

const visibleSkills = computed(() =>
  props.candidate.skills?.slice(0, props.maxVisible) ?? [],
)

const remainingCount = computed(() =>
  Math.max(0, (props.candidate.skills?.length ?? 0) - props.maxVisible),
)
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-if="candidate.skills && candidate.skills.length > 0"
      class="flex gap-1"
    >
      <HoverCard>
        <HoverCardTrigger as-child>
          <button
            type="button"
            class="max-w-50 truncate text-left text-xs"
          >
            <span
              v-for="(skill, index) in visibleSkills"
              :key="skill"
            >
              {{ skill }}<span v-if="index < visibleSkills.length - 1">, </span>
            </span>
            <span
              v-if="remainingCount > 0"
              class="font-medium"
            >
              +{{ remainingCount }} more
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent class="w-80">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="skill in candidate.skills"
              :key="skill"
              class="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {{ skill }}
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
    <span
      v-else
      class="text-xs text-muted-foreground"
    >
      Not specified
    </span>
  </div>
</template>
