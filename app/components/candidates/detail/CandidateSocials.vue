<script setup lang="ts">
import { Linkedin, Github } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Props {
  githubUrl: string | null
  linkedinUrl: string | null
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
      v-if="linkedinUrl"
      as="a"
      :href="linkedinUrl"
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="icon"
      aria-label="Open LinkedIn profile"
      class="rounded-full w-7 h-7 cursor-pointer text-white bg-[#0A66C2] hover:bg-[#0A66C2]/80 hover:text-white"
    >
      <Linkedin :size="14" />
    </Button>

    <Button
      v-if="githubUrl"
      as="a"
      :href="githubUrl"
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="icon"
      aria-label="Open GitHub profile"
      class="rounded-full w-7 h-7 cursor-pointer text-white bg-[#24292e] hover:bg-[#24292e]/80 hover:text-white"
    >
      <Github :size="14" />
    </Button>
  </div>
</template>
