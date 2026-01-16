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
- [ ] **Global Error Handling:** Configure `QueryCache` and `MutationCache` in `plugins/vue-query.ts`.
    - *Goal:* Centralized handling of 401 (redirect) and 500 (toast) errors.

## 3. Application Shell (Dashboard)
- [ ] **Dashboard Layout:** Create `layouts/dashboard.vue`.
    - Components: Sidebar (Collapsible), Header (User dropdown), Breadcrumbs.
- [ ] **Logout Flow:** Implement `signOut` logic.
    - *Critical:* Must call `queryClient.clear()` to remove cached sensitive data upon logout.
- [ ] **User Session Helper:** Create `useUserSession` composable.
    - *Refactor:* Derive `company_name` and user roles directly from metadata without a complex Pinia store.

## 4. Feature: Candidates (CRM Core)
- [ ] **Schema Design:** Create `candidates` table in Supabase (RLS policies enabled).
- [ ] **Data Fetching:** Create `useCandidates` composable wrapping `useQuery`.
    - Features: Pagination, Sorting, Server-side filtering.
- [ ] **Data Table:** Implement a reusable Data Table component (TanStack Table + Shadcn).
- [ ] **Mutations:** Create "Add Candidate" modal using `useMutation` with cache invalidation (`invalidateQueries`).

## 5. Feature: Pipeline / Jobs
- [ ] **Schema:** Create `jobs` and `applications` tables.
- [ ] **Kanban Board:** Implement drag-and-drop interface for candidate stages.
    - *Tech:* `@formkit/drag-and-drop` or similar lightweight lib.
    - *Optimistic Update:* UI updates immediately before server response.

## 6. Quality Assurance & Polish
- [ ] **Performance:** Check bundle size and lazy load heavy route components.
- [ ] **Edge Cases:** Handle "Network Offline" state.