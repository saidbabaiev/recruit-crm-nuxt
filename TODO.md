# 📝 TODO: Hirecrm Rewrite (Nuxt 4 + Supabase)

# CRM Implementation Plan

## 1. Core Setup & Authentication (✅ Completed)
- [x] **Project Init:** Nuxt 4 + Tailwind CSS + Shadcn UI configured.
- [x] **Code Quality:** ESLint & Prettier (Zero Config) setup.
- [x] **Supabase Setup:** `useAuth` composable implemented (raw client).
- [x] **Async State Management:** `@tanstack/vue-query` installed & configured with Devtools.
- [x] **UI Feedback:** `vue-sonner` integrated for toast notifications.
- [x] **Auth UI:** Login/Signup forms refactored to use `useMutation` (Optimistic UX).

## 2. Architecture & Security (Current Focus)
- [x] **Auth Middleware:** `auth.global.ts` implemented for route protection.
- [x] **Type Generation:** Supabase types generated + shortcuts in `types/database.ts`.
- [x] **Global Error Handling:** Configure `QueryCache` and `MutationCache` in `plugins/vue-query.ts`.
- [ ] **Error Normalization:** Implement `AppError` type and `toError` utility to eliminate `any` in error handlers.

## 3. Application Shell (Dashboard)
- [x] **Default Layout:** Create `layouts/default.vue`.
- [ ] **Logout Flow:** Implement `signOut` logic.
    - *Critical:* Must call `queryClient.clear()` to remove cached sensitive data upon logout.
- [ ] **User Session Helper:** Create `useUserSession` composable.
    - *Refactor:* Derive `company_name` and user roles directly from metadata without a complex Pinia store.

## 4. Feature: Candidates (CRM Core)
- [x] **Domain Logic:** Service Layer (`services/candidates`) & `useCandidates` composable (TanStack Query) implemented.
- [ ] **Data Table UI:** Implement smart list view using Shadcn components.
    - [ ] **Filters:** Create `CandidateFilters.vue` (Search Input + Status Select) with `refDebounced` (VueUse) to prevent API spam.
    - [ ] **Pagination:** Implement Pagination controls connected to server-side `count` and `page` param.
    - [ ] **Sorting:** Add UI controls for sorting (e.g., "Newest first", "Alphabetical") wired to the query key.
    - [ ] **Loading States:** Replace full-page loader with Skeleton Cards (`isPending` state) for smooth transitions.
    - [ ] **Empty States:** Design a "No candidates found" placeholder for zero results.
- [ ] **Candidate Details:** Create dynamic page `pages/candidates/[id].vue`.
    - [ ] **UI:** Display detailed info, Skeletons, and Error handling.
    - [ ] **Navigation:** Connect list items to detail view.
- [ ] **Mutations:** Create "Add Candidate" modal using `useMutation` with cache invalidation (`invalidateQueries`).

## 5. Feature: Pipeline / Jobs
- [ ] **Kanban Board:** Implement drag-and-drop interface for candidate stages.
    - *Tech:* `@formkit/drag-and-drop` or similar lightweight lib.
    - *Optimistic Update:* UI updates immediately before server response.

## 6. Quality Assurance & Polish
- [ ] **Performance:** Check bundle size and lazy load heavy route components.
- [ ] **Edge Cases:** Handle "Network Offline" state.