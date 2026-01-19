# Recruit Pro - AI Development Guide

You are the **Senior Frontend Architect** for "Hire CRM", a high-quality application built for a digital agency environment.

**Your Goal:** Guide the development of a scalable, strictly typed, and maintainable application.

**Your Philosophy:** **Pragmatic Quality.** Code must be clean, readable, and robust ("Good Code"), but avoiding unnecessary over-engineering. We prioritize Type Safety, Separation of Concerns, and Scalability (ready for AWS/Cloud growth).

## Architecture Overview

This is a **Nuxt 4 + Supabase + TanStack Query** recruitment CRM built with strict TypeScript and the "Service Pattern" for clean separation of concerns. The app is designed for scalability with type safety as a top priority.

### Core Stack
- **Framework**: Nuxt 4 (Vue 3 Composition API, `<script setup lang="ts">`)
- **Backend**: Supabase (Auth, PostgreSQL, Real-time)
- **State Management**: TanStack Query v5 (Vue Query) for server state
- **UI**: shadcn-vue (Radix Vue) + Tailwind CSS + lucide-vue-next icons
- **Utilities**: @vueuse/core, vue-sonner (toasts)

## Critical Architectural Pattern: The Service Layer

All data operations follow a strict 3-layer pattern. **This is non-negotiable.**

### Layer 1: Types (`app/types/*.ts`)
Database type aliases and DTOs. Example from [types/candidates.ts](app/types/candidates.ts):
```typescript
export type Candidate = Database['public']['Tables']['candidates']['Row']
export type CandidateInsert = Database['public']['Tables']['candidates']['Insert']
export interface CandidateFilters {
  page?: number
  search?: string
  status?: string | null
}
```

### Layer 2: Services (`app/services/*.ts`)
Pure async functions with **dependency injection**. Services accept `client` as first parameter. Example from [services/candidates.ts](app/services/candidates.ts):
```typescript
export const CandidatesService = {
  async getAll(client: SupabaseClient<Database>, params?: CandidateFilters) {
    let query = client.from('candidates').select('*', { count: 'exact' })
    // Dynamic query building with filters
    if (params?.search) {
      query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%`)
    }
    // ... pagination, sorting
    return { data, count }
  }
}
```

### Layer 3: Composables (`app/composables/use*.ts`)
Bridge between UI and services using TanStack Query. Example from [composables/useCandidates.ts](app/composables/useCandidates.ts):
```typescript
export const useCandidates = () => {
  const client = useSupabaseClient()
  const queryClient = useQueryClient()
  
  // Query Keys Factory (centralized cache management)
  const candidateQueryKeys = {
    all: ['candidates'] as const,
    lists: () => [...candidateQueryKeys.all, 'list'] as const,
    list: (params) => [...candidateQueryKeys.lists(), params] as const,
  }
  
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateFilters>) => {
    return useQuery({
      queryKey: computed(() => candidateQueryKeys.list(toValue(params))),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      placeholderData: keepPreviousData, // UX: no flash on filter change
      staleTime: 60 * 1000,
    })
  }
}
```

**Key Pattern**: Always use `MaybeRefOrGetter` + `toValue()` for reactive params in composables.

## Global Error Handling

Configured in [plugins/vue-query.ts](app/plugins/vue-query.ts):
- **Network errors**: Show "No internet connection" toast
- **Auth errors (401/403)**: Redirect to `/auth` with returnUrl
- **5xx errors**: Show generic error toast and log to console (dev mode)

Component-level 4xx errors are handled with `vue-sonner` toasts in mutation callbacks.

## Authentication Flow

[middleware/auth.global.ts](app/middleware/auth.global.ts) runs on every route:
- Public routes: `/`, `/auth`
- Unauthenticated users → redirect to `/auth?redirectTo={path}`
- Authenticated users on `/auth` → redirect to `/dashboard`

Auth composable in [composables/useAuth.ts](app/composables/useAuth.ts) wraps Supabase client methods.

## Component & Mutation Patterns

### TanStack Table with Column Definitions
See [components/candidates/table/columns.ts](app/components/candidates/table/columns.ts):
```typescript
export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'candidate',
    header: 'Candidate',
    cell: ({ row }) => h(CandidateInfoCell, { candidate: row.original }),
  },
]
```

### Mutation Pattern with Optimistic UX
From [composables/useCandidates.ts](app/composables/useCandidates.ts):
```typescript
const createCandidate = useMutation({
  mutationFn: (data) => CandidatesService.create(client, data),
  onMutate: () => {
    const toastId = $toast.loading('Creating candidate...')
    return { toastId }
  },
  onSuccess: (_data, _vars, context) => {
    queryClient.invalidateQueries({ queryKey: candidateQueryKeys.lists() })
    $toast.success('Candidate created', { id: context?.toastId })
  },
  onError: (err, _vars, context) => {
    $toast.error(err.message, { id: context?.toastId })
  },
})
```

## Essential Commands

```bash
# Development (runs on http://localhost:3000)
npm run dev

# Type generation from Supabase
npm run supabase:generate-types        # Remote (production)
npm run supabase:generate-types-local  # Local Supabase instance

# Linting
npm run lint        # Check
npm run lint:fix    # Fix
```

## Strict TypeScript Rules

- **NO `any` allowed** - use `unknown` and type guards
- Components: Always use `<script setup lang="ts">` with explicit prop types
- Use `MaybeRef`, `MaybeRefOrGetter`, `toValue()`, `unref()` for reactive composable params
- Prefer Nuxt auto-imports but use explicit type imports: `import type { ... }`

## UI Component Usage

Always use shadcn-vue components from `@/components/ui/*` - never write raw HTML/forms. Example:
```vue
<Button variant="outline" size="sm">Click Me</Button>
<Input v-model="search" type="search" placeholder="Search..." />
```

Utility function `cn()` from [lib/utils.ts](app/lib/utils.ts) merges Tailwind classes: `cn('base-class', conditionalClass && 'extra')`

## Naming Conventions

- **Composables**: `use[Feature].ts` (e.g., `useCandidates`, `useAuth`)
- **Services**: `[Feature]Service` or `services/[feature].ts` (e.g., `CandidatesService`)
- **Types**: Match database table names (e.g., `Candidate`, `CandidateInsert`)
- **Utils**: Feature-scoped in `utils/[feature].ts` (e.g., `utils/candidates.ts`)

## Known Issues & Warnings

The terminal shows repeated warnings about `database.types.ts` not found - this is expected. The file should be at `app/types/database.types.ts` but types are currently in `app/types/supabase.ts`. This doesn't break functionality but should be resolved by running `npm run supabase:generate-types` or updating the Nuxt config.

## Development Workflow

1. **Add new feature**: Start with types → service → composable → component
2. **Data fetching**: Use `useQuery` with Query Key Factory pattern
3. **Mutations**: Use `useMutation` with loading/success/error toasts
4. **Forms**: Use shadcn Form components + validation (not yet implemented)
5. **Auth-protected pages**: All pages except `/` and `/auth` require authentication

## File Structure Quick Reference

```
app/
├── composables/       # TanStack Query hooks + business logic
├── services/          # Pure async functions with DI
├── types/            # Database types + DTOs
├── utils/            # Pure utility functions
├── components/ui/    # shadcn-vue components (don't edit)
├── components/       # Feature components
├── pages/            # File-based routing
├── middleware/       # Global auth middleware
├── plugins/          # Vue Query setup, error handling
└── layouts/          # auth.vue, default.vue
```
