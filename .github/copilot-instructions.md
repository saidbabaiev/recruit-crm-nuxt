# GitHub Copilot Instructions

> **📚 Full documentation:** See [`/docs`](../docs) folder for comprehensive guides

This file contains GitHub Copilot-specific instructions. For detailed architecture, patterns, and contributing guidelines, refer to the main documentation.

## Quick Links

- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)** - System design, 3-layer pattern, tech stack
- **[PATTERNS.md](../docs/PATTERNS.md)** - Code patterns, best practices, conventions
- **[API.md](../docs/API.md)** - TypeScript rules, commands, utilities
- **[CONTRIBUTING.md](../docs/CONTRIBUTING.md)** - Development workflow, commit guidelines

---

## Core Philosophy

**Pragmatic Quality** - Clean, readable, robust code without over-engineering.

Priorities: Type Safety, Separation of Concerns, Scalability.

## Tech Stack (Quick Reference)

- **Framework**: Nuxt 4 (Vue 3 Composition API, `<script setup lang="ts">`)
- **Backend**: Supabase (Auth, PostgreSQL, Real-time)
- **State Management**: TanStack Query v5 (Vue Query)
- **UI**: shadcn-vue + Tailwind CSS + lucide-vue-next
- **Language**: TypeScript (strict mode, NO `any`)

## 3-Layer Architecture (Critical)

**All data operations MUST follow this pattern:**

```
Components → Composables → Services → Types
   (UI)      (Queries)    (Data)     (Schema)
```

### Quick Reference

1. **Types** (`app/types/*.ts`) - Database types, DTOs
2. **Services** (`app/services/*.ts`) - Pure async functions with DI
3. **Composables** (`app/composables/use*.ts`) - TanStack Query hooks
4. **Components** (`.vue`) - UI + side effects (toasts, navigation)

**Details:** See [ARCHITECTURE.md](../docs/ARCHITECTURE.md#critical-architecture-pattern-3-layer-system)

## Error Handling (Quick Reference)

6-type system: `auth`, `network`, `server`, `validation`, `client`, `unknown`

- Use `normalizeError(error)` in components
- Use `<AsyncState :error="error">` for display
- Network errors auto-retry 2x, server errors 1x

**Details:** See [PATTERNS.md](../docs/PATTERNS.md#global-error-handling)

## Authentication

- Public routes: `/`, `/auth`
- Middleware: `auth.global.ts` (auto-redirect)
- Composable: `useAuth()` wraps Supabase auth

**Details:** See [ARCHITECTURE.md](../docs/ARCHITECTURE.md#authentication-flow)

## Pure Composables Pattern (Critical)

**Composables:**
- Return factory functions for `useQuery`/`useMutation` hooks
- NO side effects (no toasts, no navigation, no cache invalidation)
- Accept `options` parameter for callbacks

**Components:**
- Import `useMutation`/`useQuery` from `@tanstack/vue-query`
- Handle ALL side effects (toasts, navigation, cache invalidation)

**Example:**

```typescript
// composables/useCandidates.ts
const useCreateCandidate = (options?) => {
  return useMutation({
    mutationFn: (data) => CandidatesService.create(client, data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

// components/MyComponent.vue
const { mutate } = useCreateCandidate({
  onSuccess: async (data) => {
    $toast.success('Created!')
    await queryClient.invalidateQueries({ queryKey: ['candidates'] })
    await navigateTo(`/candidates/${data.id}`)
  },
})
```

**Full details:** See [PATTERNS.md](../docs/PATTERNS.md#pure-composables-pattern)

## Copilot-Specific Quick Rules

### TypeScript
- ❌ NO `any` - use `unknown` with type guards
- ✅ Explicit prop types: `defineProps<Props>()`
- ✅ Type imports: `import type { ... }`
- ✅ Reactive params: `MaybeRefOrGetter` + `toValue()`

### UI Components
- ✅ Always use shadcn-vue: `<Button>`, `<Input>`, etc.
- ❌ Never raw HTML: `<button>`, `<input>`
- ✅ Use `cn()` for class merging

### Navigation & Toasts
- ✅ `navigateTo('/path')` (Nuxt built-in)
- ❌ `useRouter().push()` or `window.location.href`
- ✅ `$toast.success()` from `useNuxtApp()`

### Naming
- Composables: `use[Feature].ts`
- Services: `[Feature]Service`
- Types: Match DB tables

### Development Flow
1. Types → 2. Service → 3. Composable → 4. Component

**Full details:** [API.md](../docs/API.md), [PATTERNS.md](../docs/PATTERNS.md)

## File Structure

```
app/
├── composables/    # use*.ts (TanStack Query hooks)
├── services/       # *Service.ts (pure async functions)
├── types/          # Database types + DTOs
├── components/     # Feature components
├── pages/          # File-based routing
└── middleware/     # auth.global.ts
```

---

**📚 For detailed documentation, see [`/docs`](../docs) folder.**