import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Candidate } from '@/types/candidates'
import { getCandidateExperienceLabel } from '@/utils/common'
import CandidatesTableDropdown from './CandidatesTableDropdown.vue'
import CandidateInfoCell from './cells/CandidateInfoCell.vue'
import CandidateContactsCell from './cells/CandidateContactsCell.vue'
import SkillsList from '@/components/common/SkillsList.vue'

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'candidate',
    header: 'Candidate',
    cell: ({ row }) => h(CandidateInfoCell, { candidate: row.original }),
  },
  {
    accessorKey: 'experience_years',
    header: 'Experience',
    cell: ({ row }) => {
      const candidate = row.original
      return h('div', { class: candidate.experience_years ? 'text-xs' : 'text-xs text-muted-foreground' }, getCandidateExperienceLabel(candidate.experience_years))
    },
  },
  {
    accessorKey: 'contacts',
    header: 'Contacts',
    cell: ({ row }) => h(CandidateContactsCell, { candidate: row.original }),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const candidate = row.original
      const candidateLocation = [candidate.city, candidate.country].filter(Boolean).join(', ')
      return h('div', {
        class: candidateLocation ? 'text-xs' : 'text-xs text-muted-foreground',
      }, candidateLocation || 'Not specified')
    },
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => h(SkillsList, { skills: row.original.skills }),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original
      return h('div', {
        class: 'text-right',
        onClick: e => e.stopPropagation(),
      }, [
        h(CandidatesTableDropdown, { candidate }),
      ])
    },
  },
]
