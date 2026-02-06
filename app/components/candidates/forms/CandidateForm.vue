<script setup lang="ts">
import CandidateFormBasic from '@/components/candidates/forms/CandidateFormBasic.vue'
import CandidateFormLocation from '@/components/candidates/forms/CandidateFormLocation.vue'
import CandidateFormProfessional from '@/components/candidates/forms/CandidateFormProfessional.vue'
import CandidateFormCompensation from '@/components/candidates/forms/CandidateFormCompensation.vue'
</script>

<template>
  <CandidateFormBasic />
  <CandidateFormLocation />
  <CandidateFormProfessional />
  <CandidateFormCompensation />
  <!-- TODO:
   - CandidateFormLinks
   - CandidateFormSkills
   -->
</template>
