# Recruit Pro - AI Development Guide

**Your Philosophy:** **Pragmatic Quality.** Code must be clean, readable, and robust ("Good Code"), but avoiding unnecessary over-engineering. We prioritize Type Safety, Separation of Concerns, and Scalability (ready for AWS/Cloud growth).

## Architecture Overview

This is a **Nuxt 4 + Supabase + TanStack Query** recruitment CRM built with strict TypeScript and the "Service Pattern" for clean separation of concerns. 
The app is designed for scalability with type safety as a top priority.

### Core Stack
- **Framework**: Nuxt 4 (Vue 3 Composition API, `<script setup lang="ts">`)
- **Backend**: Supabase (Auth, PostgreSQL, Real-time)
- **State Management**: TanStack Query v5 (Vue Query) for server state
- **UI**: shadcn-vue + Tailwind CSS + lucide-vue-next icons
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
    if (params?.search) {
      query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%`)
    }
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
  
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateFilters>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'list', toValue(params)]),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    })
  }
}
```

**Key Pattern**: Always use `MaybeRefOrGetter` + `toValue()` for reactive params in composables.

## Global Error Handling

Error handling uses a **6-type classification system** configured in [plugins/vue-query.ts](app/plugins/vue-query.ts) and [utils/errors.ts](app/utils/errors.ts):

**Error Types:**
- `auth` (401/403) → Auto-redirect to `/auth` + toast
- `network` (offline/timeout) → Global toast
- `server` (5xx, DB errors) → Global toast  
- `validation` (400/422) → Handled locally in components
- `client` (404/409/429) → Handled locally or selective toast
- `unknown` → Fallback for unexpected errors

**Key Functions:**
- `normalizeError(error: unknown): AppError` - Converts any error to typed AppError
- Error normalization is handled automatically in `AsyncState.vue` component

**Retry Logic:** Network errors retry 2x, server errors retry 1x. No retry for auth/validation/client errors.

**Usage Examples:**
```typescript
// In composables - normalize errors in onError
const { mutate } = useSignIn({
  onError: (err) => {
    const normalized = normalizeError(err)
    error.value = normalized.message
  }
})

// In components - pass error directly to AsyncState
const { error } = useCandidatesList()

// AsyncState component handles normalization internally
<AsyncState :error="error" :is-loading="isPending">
  <!-- content -->
</AsyncState>
```

## Error Display in Components

All error display is handled through the `AsyncState.vue` component, which:
- Accepts `error` prop as `unknown` type
- Automatically normalizes errors using `normalizeError()`
- Displays user-friendly error messages with retry button
- Supports validation error fields display

**Usage:**
<script setup lang="ts">
const { data, isPending, error } = useCandidatesList(params)
</script>

<template>
  <AsyncState
    :is-loading="isPending"
    :error="error"
    :is-empty="!data?.length"
    empty-title="No candidates found"
  >
    <!-- Success state content -->
  </AsyncState>
</template>


## Authentication Flow

[middleware/auth.global.ts](app/middleware/auth.global.ts) runs on every route:
- Public routes: `/`, `/auth`
- Unauthenticated users → redirect to `/auth?redirectTo={path}`
- Authenticated users on `/auth` → redirect to `/dashboard`

Auth composable in [composables/useAuth.ts](app/composables/useAuth.ts) wraps Supabase client methods.

## Component & Mutation Patterns

### Pure Composables: Clean Architecture (Architectural Standard)

**ALL composables (`useAuth`, `useCandidates`, etc.) MUST follow this pure composable pattern:**

#### 1. Composables are Pure Data Layer
- Composables return **factory functions** that create `useQuery` and `useMutation` hooks
- Composables contain ONLY data fetching/mutation logic - NO side effects
- NO toasts, NO cache invalidation, NO navigation inside composables
- Composables accept optional `options` parameter for custom callbacks (`onSuccess`, `onError`)

#### 2. Components Handle Side Effects
- `.vue` components import `useMutation`/`useQuery` from `@tanstack/vue-query`
- Components call factory functions from composables and handle ALL side effects:
  - Toast notifications via `useNuxtApp().$toast`
  - Cache invalidation via `useQueryClient()`
  - Navigation via `navigateTo()`
  - Modal closing, form resets, etc.

#### 3. Separation of Concerns
- **Composables:** Pure data operations (fetching, mutations)
- **Components:** User experience (toasts, navigation, UI state)
- This keeps composables reusable and testable

#### 4. Navigation Standard
- **ALWAYS use `navigateTo()`** for programmatic navigation (Nuxt built-in)
- NEVER use `useRouter().push()` or `window.location.href`
- Example: `await navigateTo('/dashboard')` or `navigateTo({ path: '/auth', query: { redirectTo } })`

#### 5. Exception: Critical Domain Logic
- Auth flow navigation (sign-in → dashboard) MAY be in composable as default behavior
- Use `options?.onSuccess` to allow override if needed
- Document such exceptions with JSDoc comments explaining the reasoning

#### 6. Documentation Standard
- Composables SHOULD have JSDoc comments for complex logic
- Document race conditions, auth state sync issues, query strategies
- Keep comments focused on technical details, not UX behavior

**Example Pattern:**

```typescript
// composables/useCandidates.ts - Pure composable
export const useCandidates = () => {
  const client = useSupabaseClient()

  // Factory function that returns useQuery hook
  const useCandidatesList = (params: MaybeRefOrGetter<CandidateParams>) => {
    return useQuery({
      queryKey: computed(() => ['candidates', 'list', toValue(params)]),
      queryFn: () => CandidatesService.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    })
  }

  // Factory function that returns useMutation hook
  const useCreateCandidate = (options?: MutationOptions<Candidate>) => {
    return useMutation({
      mutationFn: (data: CreateCandidateInput) => 
        CandidatesService.create(client, data),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  return {
    useCandidatesList,
    useCreateCandidate,
  }
}

// pages/candidates.vue - Component handles side effects
<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const { useCandidatesList, useCreateCandidate } = useCandidates()
const queryClient = useQueryClient()
const { $toast } = useNuxtApp()

// Query - simple usage
const { data: candidates } = useCandidatesList(params)

// Mutation - component handles all side effects
const { mutate: createCandidate, isPending } = useCreateCandidate({
  onSuccess: async (data) => {
    $toast.success('Candidate created successfully')
    await queryClient.invalidateQueries({ queryKey: ['candidates', 'list'] })
    await navigateTo(`/candidates/${data.id}`)
  },
  onError: (error) => {
    const normalized = normalizeError(error)
    $toast.error(normalized.message)
  },
})

// Or: wrap regular function in useMutation directly
const { signOut } = useAuth()
const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
  mutationFn: signOut,
  onSuccess: async () => {
    await navigateTo('/auth')
  },
})
</script>
```

**Key Benefits:**
- ✅ Composables are testable without mocking UI concerns
- ✅ Components have full control over UX flows
- ✅ Clear separation: data vs. presentation
- ✅ Easy to customize behavior per component
- ✅ No hidden side effects

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

## Development Workflow

1. **Add new feature**: Start with types → service → composable → component
2. **Data fetching**: Use `useQuery` with inline query keys (e.g., `['entity', 'type', params]`)
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