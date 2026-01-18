import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Candidate } from '@/types/candidates'
import { getCandidateExperienceLabel } from '@/utils/candidates'
import CandidatesTableDropdown from './CandidatesTableDropdown.vue'
import CandidateInfoCell from './cells/CandidateInfoCell.vue'
import CandidateContactsCell from './cells/CandidateContactsCell.vue'

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
      return h('div', { class: 'text-sm' }, getCandidateExperienceLabel(candidate))
    },
  },
  {
    accessorKey: 'contacts',
    header: 'Contacts',
    cell: ({ row }) => h(CandidateContactsCell, { candidate: row.original }),
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
