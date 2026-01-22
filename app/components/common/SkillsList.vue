<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { computed } from 'vue'

interface Props {
  skills: string[] | null | undefined
  maxVisible?: number
  textSize?: 'xs' | 'sm'
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 4,
  textSize: 'xs',
})

const visibleSkills = computed(() =>
  props.skills?.slice(0, props.maxVisible) ?? [],
)

const remainingCount = computed(() =>
  Math.max(0, (props.skills?.length ?? 0) - props.maxVisible),
)
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-if="skills && skills.length > 0"
      class="flex gap-1"
    >
      <HoverCard>
        <HoverCardTrigger as-child>
          <button
            type="button"
            :class="`max-w-50 truncate text-left text-${props.textSize}`"
          >
            <span
              v-for="(skill, index) in visibleSkills"
              :key="skill"
            >
              {{ skill }}<span v-if="index < visibleSkills.length - 1">, </span>
            </span>
            <span
              v-if="remainingCount > 0"
              :class="`font-medium text-${props.textSize}`"
            >
              +{{ remainingCount }} more
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent class="w-80">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="skill in skills"
              :key="skill"
              :class="`inline-flex items-center rounded-md bg-secondary px-2 py-1 text-${props.textSize} font-medium text-secondary-foreground`"
            >
              {{ skill }}
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
    <span
      v-else
      :class="`text-muted-foreground text-${props.textSize}`"
    >
      Not specified
    </span>
  </div>
</template>
