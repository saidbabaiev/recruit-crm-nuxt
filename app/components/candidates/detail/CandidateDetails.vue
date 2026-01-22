<script setup lang="ts">
import SkillsList from '@/components/common/SkillsList.vue'
import type { Candidate } from '@/types/candidates'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/utils/date'
import {
  getSalaryRangeLabel,
  formatVisaStatus,
  formatRemotePreference,
  getCandidateExperienceLabel,
} from '@/utils/common'
import CandidateDetailsItem from './CandidateDetailsItem.vue'

interface Props {
  candidate: Candidate
}

defineProps<Props>()
</script>

<template>
  <Card>
    <CardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-2 text-sm">
        <!-- Current Organization -->
        <CandidateDetailsItem label="Current Organization">
          {{ candidate.current_company || 'Not specified' }}
        </CandidateDetailsItem>

        <!-- Notice Period -->
        <CandidateDetailsItem label="Notice Period">
          {{ candidate.notice_period || 'Not specified' }}
        </CandidateDetailsItem>

        <!-- Skills -->
        <CandidateDetailsItem label="Skills">
          <SkillsList
            :skills="candidate.skills"
            text-size="sm"
          />
        </CandidateDetailsItem>

        <!-- Availability Date -->
        <CandidateDetailsItem label="Availability Date">
          {{ formatDate(candidate.availability_date) }}
        </CandidateDetailsItem>

        <!-- Experience -->
        <CandidateDetailsItem label="Experience">
          {{ getCandidateExperienceLabel(candidate.experience_years) }}
        </CandidateDetailsItem>

        <!-- Remote Work Preference -->
        <CandidateDetailsItem label="Remote Work Preference">
          {{ formatRemotePreference(candidate.remote_work_preference) }}
        </CandidateDetailsItem>

        <!-- Salary Expectation -->
        <CandidateDetailsItem label="Salary Expectation">
          <div v-if="candidate.expected_salary_min || candidate.expected_salary_max">
            {{
              getSalaryRangeLabel(
                candidate.expected_salary_min,
                candidate.expected_salary_max,
                candidate.salary_currency,
                candidate.salary_period,
              )
            }}
          </div>
          <span v-else>Not specified</span>
        </CandidateDetailsItem>

        <!-- Languages -->
        <CandidateDetailsItem label="Languages">
          <span
            v-if="candidate.languages && candidate.languages.length"
            class="font-light truncate"
          >
            {{ candidate.languages.join(', ') }}
          </span>
          <span v-else>Not specified</span>
        </CandidateDetailsItem>

        <!-- Visa Status -->
        <CandidateDetailsItem label="Visa Status">
          <span class="text-right font-light">{{ formatVisaStatus(candidate.visa_status) }}</span>
        </CandidateDetailsItem>

        <!-- Education -->
        <CandidateDetailsItem label="Education">
          {{ candidate.education || 'Not specified' }}
        </CandidateDetailsItem>
      </div>
    </CardContent>
  </Card>
</template>
