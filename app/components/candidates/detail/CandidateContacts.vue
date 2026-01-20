<script setup lang="ts">
import { FileText, Mail, Phone } from 'lucide-vue-next'

import type { Candidate } from '@/types/candidates'
import CandidateSocials from './CandidateSocials.vue'

interface Props {
  candidate: Candidate
}

defineProps<Props>()
</script>

<template>
  <!-- Contact Info Grid -->
  <div class="grid grid-cols-4 text-sm">
    <!-- Email -->
    <div class="flex items-center gap-2">
      <Mail class="h-4 w-4 text-muted-foreground shrink-0" />
      <a
        v-if="candidate.email"
        :href="`mailto:${candidate.email}`"
        class="text-primary hover:underline truncate"
      >
        {{ candidate.email }}
      </a>
      <span
        v-else
        class="text-muted-foreground"
      >Not specified</span>
    </div>

    <!-- Phone -->
    <div class="flex items-center gap-2">
      <Phone class="h-4 w-4 text-muted-foreground shrink-0" />
      <a
        v-if="candidate.phone"
        :href="`tel:${candidate.phone}`"
        class="text-primary hover:underline"
      >
        {{ candidate.phone }}
      </a>
      <span
        v-else
        class="text-muted-foreground"
      >Not specified</span>
    </div>

    <!-- Resume -->
    <div class="flex items-center gap-2">
      <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
      <a
        v-if="candidate.resume_url"
        :href="candidate.resume_url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary hover:underline truncate"
      >
        Download Resume
      </a>
      <span
        v-else
        class="text-muted-foreground"
      >Not specified</span>
    </div>
    <div class="flex items-center justify-end">
      <CandidateSocials
        :github-url="candidate.github_url"
        :linkedin-url="candidate.linkedin_url"
      />
    </div>
  </div>
</template>
