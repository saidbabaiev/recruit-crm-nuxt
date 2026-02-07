<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { Briefcase, FileText, Link, User } from 'lucide-vue-next'

import CandidateFormBasic from '@/components/candidates/forms/CandidateFormBasic.vue'
import CandidateFormLocation from '@/components/candidates/forms/CandidateFormLocation.vue'
import CandidateFormProfessional from '@/components/candidates/forms/CandidateFormProfessional.vue'
import CandidateFormCompensation from '@/components/candidates/forms/CandidateFormCompensation.vue'
import CandidateFormLinks from '@/components/candidates/forms/CandidateFormLinks.vue'
import CandidateFormSkills from '@/components/candidates/forms/CandidateFormSkills.vue'
</script>

<template>
  <Accordion
    type="multiple"
    :default-value="['personal', 'employment', 'skills', 'links']"
  >
    <AccordionItem value="personal">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4 text-muted-foreground shrink-0" />
          Personal Information
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6 space-y-6">
        <CandidateFormBasic />
        <CandidateFormLocation />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="employment">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <Briefcase class="h-4 w-4 text-muted-foreground shrink-0" />
          Professional Information
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6 space-y-6">
        <CandidateFormProfessional />
        <CandidateFormCompensation />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="skills">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
          Skills and Languages
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6 space-y-6">
        <CandidateFormSkills />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="links">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <Link class="h-4 w-4 text-muted-foreground shrink-0" />
          Links
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6 space-y-6">
        <CandidateFormLinks />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
