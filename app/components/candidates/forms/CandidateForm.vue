<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { Briefcase, FileText, User } from 'lucide-vue-next'

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
    :default-value="['personal', 'employment', 'skills']"
  >
    <AccordionItem value="personal">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4 text-muted-foreground shrink-0" />
          Personal Information
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6">
        <CandidateFormBasic />
        <CandidateFormLocation />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="employment">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <Briefcase class="h-4 w-4 text-muted-foreground shrink-0" />
          Employment Information
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6">
        <CandidateFormProfessional />
        <CandidateFormCompensation />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="skills">
      <AccordionTrigger class="bg-secondary px-6 py-4">
        <div class="flex items-center gap-2">
          <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
          Resume, Language and Technical Skills
        </div>
      </AccordionTrigger>
      <AccordionContent class="p-6">
        <CandidateFormLinks />
        <CandidateFormSkills />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
