<script setup lang="ts">
import CandidateFormBasic from '@/components/candidates/forms/CandidateFormBasic.vue'
import CandidateFormLocation from '@/components/candidates/forms/CandidateFormLocation.vue'
import CandidateFormProfessional from '@/components/candidates/forms/CandidateFormProfessional.vue'
</script>

<template>
  <CandidateFormBasic />
  <CandidateFormLocation />
  <CandidateFormProfessional />
  <!-- TODO:
   - CandidateFormCompensation
   - CandidateFormLinks
   - CandidateFormSkills
   -->
</template>
