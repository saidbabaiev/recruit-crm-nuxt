# Code Patterns & Best Practices

This document describes the code patterns and conventions used throughout the Recruit Pro codebase.

## Pure Composables Pattern

**ALL composables MUST follow the Pure Composables pattern.** This is the core architectural pattern of the application.

### Core Principles

#### 1. Composables are Pure Data Layer

- Composables return **factory functions** that create `useQuery` and `useMutation` hooks
- Composables contain ONLY data fetching/mutation logic - **NO side effects**
- **NO toasts**, **NO cache invalidation**, **NO navigation** inside composables
- Composables accept optional `options` parameter for custom callbacks (`onSuccess`, `onError`)

#### 2. Components Handle Side Effects

- `.vue` components import `useMutation`/`useQuery` from `@tanstack/vue-query`
- Components call factory functions from composables and handle **ALL** side effects:
  - Toast notifications via `useNuxtApp().$toast`
  - Cache invalidation via `useQueryClient()`
  - Navigation via `navigateTo()`
  - Modal closing, form resets, etc.

#### 3. Separation of Concerns

- **Composables:** Pure data operations (fetching, mutations)
- **Components:** User experience (toasts, navigation, UI state)
- This keeps composables reusable and testable

### Example: Pure Composable

```typescript
// composables/useCandidates.ts
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
```

### Example: Component with Side Effects

```vue
<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const { useCandidatesList, useCreateCandidate } = useCandidates()
const queryClient = useQueryClient()
const { $toast } = useNuxtApp()

// Query - simple usage
const { data: candidates, isPending, error } = useCandidatesList(params)

// Mutation - component handles all side effects
const { mutate: createCandidate, isPending: isCreating } = useCreateCandidate({
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

// Alternative: wrap regular function in useMutation directly
const { signOut } = useAuth()
const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
  mutationFn: signOut,
  onSuccess: async () => {
    await navigateTo('/auth')
  },
})
</script>

<template>
  <AsyncState 
    :is-loading="isPending" 
    :error="error"
    :is-empty="!candidates?.length"
  >
    <!-- Success state content -->
  </AsyncState>
</template>
```

### Exception: Critical Domain Logic

Auth flow navigation (sign-in → dashboard) MAY be in composable as default behavior:

```typescript
const useSignIn = (options?: MutationOptions<SignInSuccess>) => {
  return useMutation({
    mutationFn: async ({ email, password }) => { /* ... */ },
    onSuccess: async (data) => {
      if (options?.onSuccess) {
        await options.onSuccess(data)
      } else {
        // Race condition: user is not immediately available after sign in
        await until(user).toBeTruthy({ timeout: 3000 })
        await navigateTo('/dashboard')
      }
    },
    onError: options?.onError,
  })
}
```

**When to use:** Only for critical flows that should "just work" by default, but always allow override via `options`.

### Benefits of Pure Composables

- ✅ Composables are testable without mocking UI concerns
- ✅ Components have full control over UX flows
- ✅ Clear separation: data vs. presentation
- ✅ Easy to customize behavior per component
- ✅ No hidden side effects

## Global Error Handling

The application uses a **6-type error classification system** for consistent error handling.

### Error Types

Configured in `plugins/vue-query.ts` and `utils/errors.ts`:

| Type | HTTP Codes | Behavior | Retry |
|------|-----------|----------|-------|
| `auth` | 401, 403 | Auto-redirect to `/auth` + toast | ❌ No |
| `network` | Timeout, Offline | Global toast | ✅ 2x |
| `server` | 5xx, DB errors | Global toast | ✅ 1x |
| `validation` | 400, 422 | Handled locally in components | ❌ No |
| `client` | 404, 409, 429 | Handled locally or selective toast | ❌ No |
| `unknown` | Unexpected | Fallback error message | ❌ No |

### Key Functions

**`normalizeError(error: unknown): AppError`**

Converts any error to a typed `AppError` with consistent structure:

```typescript
interface AppError {
  type: 'auth' | 'network' | 'server' | 'validation' | 'client' | 'unknown'
  message: string
  statusCode?: number
  fields?: Record<string, string[]> // For validation errors
}
```

### Usage Examples

#### In Composables (with callbacks)

```typescript
const { mutate } = useSignIn({
  onError: (err) => {
    const normalized = normalizeError(err)
    error.value = normalized.message
  }
})
```

#### In Components (with AsyncState)

```typescript
const { data, isPending, error } = useCandidatesList()

// AsyncState component handles normalization internally
<AsyncState :error="error" :is-loading="isPending">
  <!-- content -->
</AsyncState>
```

## Error Display Pattern

All error display is handled through the `AsyncState.vue` component:

### AsyncState Component

```vue
<template>
  <AsyncState
    :is-loading="isPending"
    :error="error"
    :is-empty="!data?.length"
    empty-title="No candidates found"
    empty-description="Try adjusting your filters"
  >
    <!-- Success state content -->
    <CandidateTable :data="data" />
  </AsyncState>
</template>
```

**Features:**
- Accepts `error` prop as `unknown` type
- Automatically normalizes errors using `normalizeError()`
- Displays user-friendly error messages with retry button
- Supports loading, empty, and error states
- Supports validation error fields display

## Navigation Standard

**ALWAYS use `navigateTo()`** for programmatic navigation (Nuxt built-in).

```typescript
// ✅ Correct
await navigateTo('/dashboard')
await navigateTo({ path: '/auth', query: { redirectTo: '/jobs' } })

// ❌ Wrong
useRouter().push('/dashboard')
window.location.href = '/dashboard'
```

**Why?** `navigateTo()` works in both client and server contexts (SSR-safe).

## Toast Notifications Standard

**ALWAYS use `$toast` from `useNuxtApp()`** for toast notifications.

```typescript
const { $toast } = useNuxtApp()

// Success
$toast.success('Candidate created successfully')

// Error
$toast.error('Failed to create candidate')

// Info
$toast.info('Processing...')

// Warning
$toast.warning('Are you sure?')
```

## UI Component Usage

**Always use shadcn-vue components** from `@/components/ui/*` - never write raw HTML/forms.

```vue
<template>
  <!-- ✅ Correct -->
  <Button variant="outline" size="sm">Click Me</Button>
  <Input v-model="search" type="search" placeholder="Search..." />
  
  <!-- ❌ Wrong -->
  <button class="border rounded">Click Me</button>
  <input v-model="search" type="text" class="border">
</template>
```

### cn() Utility

Use `cn()` from `lib/utils.ts` to merge Tailwind classes:

```vue
<template>
  <div :class="cn('base-class', isActive && 'active-class', className)">
    Content
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  className?: string
  isActive?: boolean
}>()
</script>
```

## Naming Conventions

### Files & Exports

- **Composables**: `use[Feature].ts` (e.g., `useCandidates`, `useAuth`)
- **Services**: `[feature].ts` with named export `[Feature]Service` (e.g., `CandidatesService`)
- **Types**: Match database table names (e.g., `Candidate`, `CandidateInsert`)
- **Utils**: Feature-scoped in `utils/[feature].ts` (e.g., `utils/errors.ts`)
- **Components**: PascalCase (e.g., `CandidateCard.vue`, `AsyncState.vue`)

### Variables & Functions

```typescript
// ✅ Correct
const candidates = ref<Candidate[]>([])
const isLoading = ref(false)
const fetchCandidates = async () => { /* ... */ }

// ❌ Wrong
const Candidates = ref<Candidate[]>([])
const loading = ref(false) // ambiguous
const getCandidates = async () => { /* ... */ } // "get" suggests synchronous
```

## Reactive Parameters Pattern

**Always use `MaybeRefOrGetter` + `toValue()` for reactive params in composables.**

```typescript
// ✅ Correct
const useCandidatesList = (params: MaybeRefOrGetter<CandidateFilters>) => {
  return useQuery({
    queryKey: computed(() => ['candidates', 'list', toValue(params)]),
    queryFn: () => CandidatesService.getAll(client, toValue(params)),
  })
}

// Usage in components - all work!
const filters = ref({ search: 'John' })
const { data: candidates1 } = useCandidatesList(filters)
const { data: candidates2 } = useCandidatesList({ search: 'Jane' })
const { data: candidates3 } = useCandidatesList(computed(() => ({ ... })))
```

**Why?** Maximum flexibility - components can pass refs, computed values, or plain objects.

## Documentation Standard

### When to Add Comments

- ✅ Complex business logic (e.g., race conditions, auth sync)
- ✅ Non-obvious performance optimizations
- ✅ Workarounds for external library bugs
- ❌ Self-explanatory code
- ❌ Obvious type definitions

### JSDoc for Composables

```typescript
/**
 * Creates a mutation hook for signing in a user.
 * 
 * **Default Behavior:**
 * - Waits for auth state sync (up to 3s timeout)
 * - Redirects to /dashboard on success
 * 
 * **Race Condition Handling:**
 * After Supabase signIn, the `useSupabaseUser()` ref is not immediately updated.
 * We use `until(user).toBeTruthy()` to wait for the auth state sync.
 * 
 * @param options.onSuccess - Override success behavior (e.g., custom redirect)
 * @param options.onError - Handle errors (use normalizeError for typed errors)
 */
const useSignIn = (options?: MutationOptions<SignInSuccess>) => {
  // ...
}
```

## TypeScript Strict Rules

### No `any` Allowed

```typescript
// ❌ Wrong
const handleError = (error: any) => { /* ... */ }

// ✅ Correct
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

### Explicit Component Props

```vue
<script setup lang="ts">
// ✅ Correct
interface Props {
  candidate: Candidate
  isLoading?: boolean
}

const props = defineProps<Props>()

// ❌ Wrong
defineProps({
  candidate: Object,
  isLoading: Boolean,
})
</script>
```

### Type Imports

Use `import type` for types to avoid runtime imports:

```typescript
// ✅ Correct
import type { Candidate } from '@/types/candidates'
import { CandidatesService } from '@/services/candidates'

// ❌ Wrong (types are bundled in runtime)
import { Candidate, CandidatesService } from '@/services/candidates'
```

## Query Key Patterns

**Consistent query keys** enable predictable cache invalidation.

```typescript
// Format: [entity, operation, ...params]

// Lists
['candidates', 'list', { search: 'John', page: 1 }]
['jobs', 'list', { status: 'active' }]

// Details
['candidates', 'detail', candidateId]
['jobs', 'detail', jobId]

// Related data
['candidates', 'jobs', candidateId]
['jobs', 'candidates', jobId]
```

**Invalidation examples:**

```typescript
// Invalidate all candidate queries
await queryClient.invalidateQueries({ queryKey: ['candidates'] })

// Invalidate only candidate lists
await queryClient.invalidateQueries({ queryKey: ['candidates', 'list'] })

// Invalidate specific candidate detail
await queryClient.invalidateQueries({ 
  queryKey: ['candidates', 'detail', candidateId] 
})
```

## Next Steps

- Check [API.md](./API.md) for API reference
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
