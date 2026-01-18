import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Candidate } from '@/types/candidates'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone } from 'lucide-vue-next'
import { getCandidateInitials, getFullName, getCandidateExperienceLabel } from '@/utils/candidates'
import CandidatesTableDropdown from './CandidatesTableDropdown.vue'

// 1. Define status to badge variant mapping
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'
const statusVariants: Record<string, BadgeVariant> = {
  new: 'default',
  screening: 'secondary',
  interview: 'outline',
  offer: 'default',
  hired: 'default',
  rejected: 'destructive',
  withdrawn: 'secondary',
}

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'candidate',
    header: 'Candidate',
    cell: ({ row }) => {
      const candidate = row.original
      const avatarSrc = ''

      return h('div', { class: 'flex items-center gap-3 min-w-[200px]' }, [
        h(Avatar, { class: 'h-8 w-8 shrink-0' }, {
          default: () => [
            h(AvatarImage, {
              src: avatarSrc,
              alt: getFullName(candidate),
            }),
            h(AvatarFallback, {
              class: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold',
            }, {
              default: () => getCandidateInitials(candidate),
            }),
          ],
        }),
        h('div', { class: 'min-w-0 flex-1' }, [
          h('div', { class: 'font-medium text-sm truncate' }, getFullName(candidate)),
          h('div', { class: 'text-xs text-muted-foreground truncate' }, candidate.current_position || 'No position'),
        ]),
      ])
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      // Convert to lowercase for safe matching
      const rawStatus = row.getValue('status') as string | null
      const status = rawStatus || 'new'
      const variant = statusVariants[status.toLowerCase()] || 'secondary'

      return h(Badge, {
        variant: variant,
        class: 'capitalize',
      }, {
        default: () => status,
      })
    },
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
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => {
      const skills = row.getValue('skills') as string[] | null

      if (!skills?.length) {
        return h('div', { class: 'text-xs text-muted-foreground' }, '-')
      }

      const visibleSkills = skills.slice(0, 2)
      const remainingCount = skills.length - visibleSkills.length

      const badges = visibleSkills.map(skill =>
        h(Badge, {
          variant: 'secondary',
          class: 'text-xs px-1.5 py-0 font-normal border-slate-200 bg-slate-50 text-slate-600',
        }, {
          default: () => skill,
        }),
      )

      if (remainingCount > 0) {
        badges.push(
          h(Badge, {
            variant: 'outline',
            class: 'text-xs px-1.5 py-0 font-normal text-muted-foreground',
          }, {
            default: () => `+${remainingCount}`,
          }),
        )
      }

      return h('div', { class: 'flex flex-wrap gap-1' }, badges)
    },
  },
  {
    accessorKey: 'email', // Use key email for sorting/filtering
    header: 'Contacts',
    cell: ({ row }) => {
      const candidate = row.original

      const emailText = candidate.email || ''

      return h('div', { class: 'flex flex-col gap-1 min-w-[180px]' }, [
        // Email row
        h('div', { class: 'flex items-center gap-1.5 text-xs text-muted-foreground' }, [
          h(Mail, { class: 'h-3 w-3 shrink-0' }),
          h('span', { class: 'truncate', title: emailText }, emailText),
        ]),
        // Phone row (Render only if phone exists)
        candidate.phone
          ? h('div', { class: 'flex items-center gap-1.5 text-xs text-muted-foreground' }, [
              h(Phone, { class: 'h-3 w-3 shrink-0' }),
              h('span', { class: 'truncate' }, candidate.phone),
            ])
          : null,
      ])
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original

      // Prevent row click when clicking on actions dropdown
      return h('div', {
        class: 'text-right',
        onClick: e => e.stopPropagation(),
      }, [
        h(CandidatesTableDropdown, { candidate }),
      ])
    },
  },
]
