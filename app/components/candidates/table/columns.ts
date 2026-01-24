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
    size: 200,
    minSize: 180,
    cell: ({ row }) => h(CandidateInfoCell, { candidate: row.original }),
  },
  {
    accessorKey: 'experience_years',
    header: 'Experience',
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      const candidate = row.original
      return h('div', { class: candidate.experience_years ? 'text-xs' : 'text-xs text-muted-foreground' }, getCandidateExperienceLabel(candidate.experience_years))
    },
  },
  {
    accessorKey: 'contacts',
    header: 'Contacts',
    size: 120,
    minSize: 100,
    cell: ({ row }) => h(CandidateContactsCell, { candidate: row.original }),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    size: 120,
    minSize: 100,
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
    size: 200,
    minSize: 180,
    cell: ({ row }) => h(SkillsList, { skills: row.original.skills }),
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 50,
    maxSize: 50,
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
