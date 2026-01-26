import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Candidate } from '@/types/candidates'
import { getCandidateExperienceLabel } from '@/utils/formatters'
import CandidatesTableDropdown from './CandidatesTableDropdown.vue'
import CandidateInfoCell from './cells/CandidateInfoCell.vue'
import CandidateEmailCell from './cells/CandidateEmailCell.vue'
import CandidatePhoneCell from './cells/CandidatePhoneCell.vue'
import SkillsList from '@/components/common/SkillsList.vue'

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'candidate',
    header: 'Candidate',
    size: 240,
    minSize: 220,
    cell: ({ row }) => h(CandidateInfoCell, { candidate: row.original }),
  },
  {
    accessorKey: 'experience_years',
    header: 'Experience',
    size: 140,
    minSize: 120,
    cell: ({ row }) => {
      const candidate = row.original
      return h('div', { class: candidate.experience_years ? 'text-sm' : 'text-sm text-muted-foreground' }, getCandidateExperienceLabel(candidate.experience_years))
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 240,
    minSize: 220,
    cell: ({ row }) => h(CandidateEmailCell, { candidate: row.original }),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    size: 220,
    minSize: 220,
    cell: ({ row }) => h(CandidatePhoneCell, { candidate: row.original }),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    size: 220,
    minSize: 200,
    cell: ({ row }) => {
      const candidate = row.original
      const candidateLocation = [candidate.city, candidate.country].filter(Boolean).join(', ')
      return h('div', {
        class: candidateLocation ? 'text-sm' : 'text-sm text-muted-foreground',
      }, candidateLocation || 'Not specified')
    },
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    size: 220,
    minSize: 200,
    cell: ({ row }) => h(SkillsList, { skills: row.original.skills, textSize: 'sm' }),
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 60,
    maxSize: 60,
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
