<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex justify-between items-center">
    <span class="font-medium">{{ label }}</span>
    <div class="text-right font-light">
      <slot />
    </div>
  </div>
</template>
