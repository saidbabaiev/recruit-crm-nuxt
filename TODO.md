# 📝 TODO: Hirecrm Rewrite (Nuxt 4 + Supabase)

# CRM Implementation Plan

## 1. Core Setup & Authentication (✅ Completed)
- [x] **Project Init:** Nuxt 4 + Tailwind CSS + Shadcn UI configured.
- [x] **Code Quality:** ESLint & Prettier (Zero Config) setup.
- [x] **Supabase Setup:** `useAuth` composable implemented (raw client).
- [x] **Async State Management:** `@tanstack/vue-query` installed & configured with Devtools.
- [x] **UI Feedback:** `vue-sonner` integrated for toast notifications.
- [x] **Auth UI:** Login/Signup forms refactored to use `useMutation`

## 2. Architecture & Security (✅ Completed)
- [x] **Auth Middleware:** `auth.global.ts` implemented for route protection.
- [x] **Type Generation:** Supabase types generated + shortcuts in `types/database.ts`.
- [x] **Global Error Handling:** Configured `QueryCache` and `MutationCache` in `plugins/vue-query.ts`.
  - [x] Network errors → "No internet" toast
  - [x] Auth errors (401/PGRST301) → Redirect to `/auth` + session expired toast
  - [x] Database/HTTP 5xx → Generic error toast
  - [x] HTTP 4xx → Silent (component handles inline)
- [x] **Error Normalization:** Implemented `AppError` discriminated union in `types/errors.ts`.
  - [x] `normalizeError()` utility converts all errors to type-safe `AppError`
  - [x] HTTP status detection with `hasHttpStatus()` type guard
  - [x] Component-level pattern: inline errors for forms, toasts for success only

## 3. Application Shell (Dashboard)
- [x] **Default Layout:** Create `layouts/default.vue`.
- [x] **Auth Layout:** Create `layouts/auth.vue`.
- [x] **Logout Flow:** Implement `signOut` logic.
    - *Critical:* Must call `queryClient.clear()` to remove cached sensitive data upon logout.
- [ ] **User Session Helper:** Create `useUserSession` composable.
    - *Refactor:* Derive `company_name` and user roles directly from metadata without a complex Pinia store.

## 4. Feature: Candidates (CRM Core)
- [x] **Domain Logic:** Service Layer (`services/candidates`) & `useCandidates` composable (TanStack Query) implemented.
- [x] **Component Structure:** Organized components into `table/`, `card/`, and future `board/` folders.
- [x] **Data Table UI:** Implemented TanStack Table with Shadcn components.
    - [x] **Table Component:** `CandidatesTable.vue` with sorting support.
    - [x] **Columns Config:** `columns.ts` with custom cell renderers (avatar, status, skills, contacts).
    - [x] **Row Actions:** `CandidatesTableDropdown.vue` for edit/delete/schedule actions.
    - [x] **Loading States:** Skeleton rows for smooth loading transitions.
    - [x] **Empty States:** "No candidates found" placeholder.
    - [x] **Clickable Rows:** Navigate to candidate details, prevent on action clicks.
    - [x] **Search Filter:** Implemented with `v-model` reactive binding (searches across name, email).
        - [x] Auto-resets to page 1 on search change
        - [x] Debouncing handled by TanStack Query `staleTime` (60s) to prevent API spam
        - [x] Uses `placeholderData: keepPreviousData` for smooth UX during filtering
    - [x] **Pagination:** Implemented with Shadcn `Pagination` component.
        - [x] Server-side pagination via `range(from, to)` in Supabase
        - [x] Displays "Showing X-Y of Z candidates"
        - [x] Connected to reactive `filters.page` with automatic query refetch
        - [x] Only shows when `totalCount > limit`
    - [ ] **Sorting UI:** Add UI controls for column sorting (currently only programmatic).
- [x] **Candidate Details:** Create dynamic page `pages/candidates/[id].vue`.
    - [ ] **UI:** Display detailed info, Skeletons, and Error handling.
    - [x] **Navigation:** Connect list items to detail view (✅ partially done - table rows clickable).
    - [ ] **Refactor:** Refactor CandidateDetails into smaller components.
- [ ] **Job Matching:** Implement basic job matching logic in candidate details.
    - [ ]*Tech:* Simple algorithm based on skills and experience.
    - [ ]*UI:* Show matched jobs section in candidate details.

## 5. Feature: Pipeline / Jobs
- [ ] **Kanban Board:** Implement drag-and-drop interface for candidate stages.
    - *Tech:* `@formkit/drag-and-drop` or similar lightweight lib.
    - *Optimistic Update:* UI updates immediately before server response.

## 6. Quality Assurance & Polish
- [ ] **Performance:** Check bundle size and lazy load heavy route components.
- [ ] **Edge Cases:** Handle "Network Offline" state.