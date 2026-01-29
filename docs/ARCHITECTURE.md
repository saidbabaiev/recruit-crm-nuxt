# Architecture

## Overview

**Recruit Pro** is a modern IT recruitment CRM built with **Nuxt 4 + Supabase + TanStack Query**. The application follows strict TypeScript practices and implements a clean 3-layer architecture for separation of concerns.

The system is designed for scalability with type safety as the top priority, making it ready for cloud deployment (AWS/Vercel/etc).

## Technology Stack

### Core Technologies

- **Framework**: Nuxt 4 (Vue 3 Composition API, `<script setup lang="ts">`)
- **Backend**: Supabase (Authentication, PostgreSQL, Real-time subscriptions)
- **State Management**: TanStack Query v5 (Vue Query) for server state
- **UI Framework**: shadcn-vue + Tailwind CSS
- **Icons**: lucide-vue-next
- **Utilities**: @vueuse/core, vue-sonner (toast notifications)

### Why This Stack?

- **Nuxt 4**: Server-side rendering, file-based routing, excellent DX
- **Supabase**: PostgreSQL with real-time capabilities, built-in auth
- **TanStack Query**: Powerful caching, automatic background refetching, optimistic updates
- **shadcn-vue**: High-quality, accessible, customizable components
- **TypeScript**: Type safety across the entire stack

## Critical Architecture Pattern: 3-Layer System

All data operations follow a strict 3-layer pattern. **This is non-negotiable.**

```
┌─────────────────────────────────────────┐
│          Vue Components (.vue)          │
│        (UI, user interactions)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Composables (use*.ts)              │
│   (TanStack Query hooks, side effects)  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Services (*Service.ts)             │
│   (Pure async functions with DI)        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Types (types/*.ts)              │
│    (Database types, DTOs, interfaces)   │
└─────────────────────────────────────────┘
```

### Layer 1: Types (`app/types/*.ts`)

Database type aliases and Data Transfer Objects (DTOs).

**Example** from `types/candidates.ts`:

```typescript
import type { Database } from '@/types/supabase'

export type Candidate = Database['public']['Tables']['candidates']['Row']
export type CandidateInsert = Database['public']['Tables']['candidates']['Insert']

export interface CandidateFilters {
  page?: number
  limit?: number
  search?: string
}
```

**Purpose:**
- Single source of truth for data shapes
- Auto-generated from Supabase schema
- Enables full type safety across layers

**Additional Type Files:**

- **`types/supabase.ts`** - Auto-generated from database schema via `npm run supabase:generate-types`
- **`types/enums.ts`** - Centralized enum definitions and UI helpers
  ```typescript
  // Database enums
  export type JobStatus = Database['public']['Enums']['job_status']
  export type WorkFormat = Database['public']['Enums']['work_format']
  
  // UI helpers for enums
  export const jobStatusVariants: Record<JobStatus, BadgeVariant> = {
    open: 'default',
    closed: 'destructive',
    // ...
  }
  ```
- **`types/errors.ts`** - Error type definitions (`AppError`, `ERROR_MESSAGES`)
- **`types/candidates.ts`** - Candidate-specific types and filters
- **`types/jobs.ts`** - Job-specific types and filters
- **`types/applications.ts`** - Application-specific types and filters

### Layer 2: Services (`app/services/*.ts`)

Pure async functions with **dependency injection**. Services accept `client` as the first parameter.

**Example** from `services/candidates.ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { CandidateFilters, CandidateListResponse } from '@/types/candidates'

export const CandidatesService = {
  async getAll(
    client: SupabaseClient<Database>, 
    params?: CandidateFilters
  ): Promise<CandidateListResponse> {
    let query = client
      .from('candidates')
      .select('*', { count: 'exact' })
    
    if (params?.search) {
      const q = params.search.trim()
      query = query.or(
        `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
      )
    }
    
    query = query.order('created_at', { ascending: false })
    
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit
      const to = from + params.limit - 1
      query = query.range(from, to)
    }
    
    const { data, error, count } = await query
    if (error) throw error
    
    return {
      data: data || [],
      count,
    }
  },

  async getById(client: SupabaseClient<Database>, id: string): Promise<Candidate> {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
}
```

**Key Principles:**
- ✅ Pure functions (no side effects)
- ✅ Dependency injection (testable without mocking)
- ✅ Database-agnostic (could swap Supabase for another service)
- ✅ Throw errors (let upper layers handle them)

### Layer 3: Composables (`app/composables/use*.ts`)

Bridge between UI and services using TanStack Query. Composables return **factory functions** that create query/mutation hooks.

**Example** from `composables/useCandidates.ts`:

```typescript
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import type { CandidateFilters } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

export const useCandidates = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Factory function that returns useQuery hook
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateFilters>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'list', toValue(params)]),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value),
      placeholderData: keepPreviousData, // UX: no flash on filter change
      staleTime: 60 * 1000,
    })
  }

  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'detail', unref(id)]),
      queryFn: () => CandidatesService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id) && !!user.value),
      staleTime: 60 * 1000,
    })
  }

  return {
    useCandidatesList,
    useCandidateDetails,
  }
}
```

**Key Pattern**: Always use `MaybeRefOrGetter` + `toValue()` for reactive params in composables.

**Why?** This allows components to pass refs, computed values, or plain values - maximum flexibility.

## File Structure

```
app/
├── composables/       # TanStack Query hooks
│   ├── useAuth.ts        # Authentication (sign in, sign out)
│   ├── useCandidates.ts  # Candidate queries
│   ├── useJobs.ts        # Job queries
│   └── useApplications.ts # Application queries
├── services/          # Pure async functions with DI
│   ├── candidates.ts     # CandidatesService (CRUD)
│   ├── jobs.ts          # JobsService (CRUD)
│   └── applications.ts  # ApplicationsService (CRUD)
├── types/            # Database types + DTOs
│   ├── supabase.ts      # Auto-generated from DB schema
│   ├── errors.ts        # AppError, ERROR_MESSAGES
│   ├── enums.ts         # Centralized enums + UI helpers
│   ├── candidates.ts    # Candidate types & filters
│   ├── jobs.ts          # Job types & filters
│   └── applications.ts  # Application types & filters
├── utils/            # Pure utility functions
│   └── errors.ts        # normalizeError(), shouldRedirectToAuth()
├── components/
│   ├── ui/              # shadcn-vue components (DON'T EDIT)
│   ├── common/          # Shared components
│   │   ├── AsyncState.vue   # Loading/error/empty states
│   │   ├── CopyButton.vue   # Copy to clipboard
│   │   └── SkillsList.vue   # Skills display
│   ├── candidates/      # Candidate-specific components
│   │   ├── detail/          # Candidate detail page components
│   │   └── table/           # Candidate table components
│   └── sidebar/         # Navigation components
├── pages/            # File-based routing
│   ├── index.vue         # Landing page (public)
│   ├── auth.vue          # Sign in/up page (public)
│   ├── dashboard.vue     # Dashboard (protected)
│   ├── jobs.vue          # Jobs list (protected)
│   └── candidates/       # Candidates section (protected)
│       ├── index.vue         # Candidates list
│       └── [id].vue          # Candidate detail
├── middleware/       # Route middleware
│   └── auth.global.ts    # Global auth check + redirects
├── plugins/          # Nuxt plugins
│   └── vue-query.ts      # TanStack Query setup + error handling
├── layouts/          # Page layouts
│   ├── default.vue       # Default layout (with sidebar)
│   └── auth.vue          # Auth layout (centered, no sidebar)
└── lib/              # Library utilities
    └── utils.ts          # cn() - Tailwind class merger

supabase/
├── migrations/       # Database migrations (*.sql)
└── config.toml       # Supabase configuration

docs/                 # Project documentation
├── README.md         # Documentation overview
├── ARCHITECTURE.md   # System design (you are here!)
├── PATTERNS.md       # Code patterns & best practices
├── API.md            # API reference
└── CONTRIBUTING.md   # Development guidelines
```

## Authentication Flow

**Middleware** (`middleware/auth.global.ts`) runs on every route:

- **Public routes**: `/`, `/auth`
- **Unauthenticated users** → redirect to `/auth?redirectTo={path}`
- **Authenticated users on `/auth`** → redirect to `/dashboard`

**Auth composable** (`composables/useAuth.ts`) wraps Supabase auth methods:

```typescript
export const useAuth = () => {
  const supabase = useSupabaseClient()
  
  const useSignIn = (options?) => {
    return useMutation({
      mutationFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email, password
        })
        if (error) throw error
        return data
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { useSignIn, signOut }
}
```

## Development Workflow

### Adding a New Feature

Follow this order: **Types → Service → Composable → Component**

1. **Types** - Define data shapes in `types/[feature].ts`
2. **Service** - Create CRUD functions in `services/[feature].ts`
3. **Composable** - Wrap service in TanStack Query hooks in `composables/use[Feature].ts`
4. **Component** - Build UI in `components/[feature]/` or `pages/`

### Example: Adding "Jobs" Feature

```bash
# 1. Types
app/types/jobs.ts
  → export type Job = Database['public']['Tables']['jobs']['Row']

# 2. Service
app/services/jobs.ts
  → export const JobsService = { getAll, getById, create, update }

# 3. Composable
app/composables/useJobs.ts
  → export const useJobs = () => { useJobsList, useJobDetails, ... }

# 4. Components
app/pages/jobs/index.vue
app/pages/jobs/[id].vue
app/components/jobs/JobCard.vue
```

## Scalability Considerations

- **Database**: PostgreSQL via Supabase (can handle millions of rows)
- **Caching**: TanStack Query reduces API calls by 90%+
- **Real-time**: Supabase subscriptions for live updates
- **Deployment**: Vercel/Netlify for frontend, Supabase for backend
- **Monitoring**: Error tracking via normalized error system

## Key Decisions

### Why TanStack Query over Pinia?

- Server state caching out-of-the-box
- Automatic background refetching
- Optimistic updates support
- Less boilerplate than Pinia stores

### Why Services with DI?

- **Testable**: Mock `client` parameter in tests
- **Flexible**: Could swap Supabase for REST/GraphQL later
- **Pure**: No hidden dependencies, no side effects

### Why Pure Composables?

- **Separation**: Data layer (composables) vs UX layer (components)
- **Reusable**: Same composable for different UX flows
- **Testable**: No need to mock toasts/navigation in composable tests

## Next Steps

- Read [PATTERNS.md](./PATTERNS.md) for code patterns
- Check [API.md](./API.md) for API reference
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
