# 📝 TODO: Hirecrm Rewrite (Nuxt 4 + Supabase)

## 🏗 Phase 1: Foundation & Architecture
*Focus: Setting up the "skeleton" and ensuring type safety.*

- [x] **Type Integration**
    - [x] Import generated Supabase types into the project.
    - [x] Create a global type definition or utility to easily access `Database` types in components.
- [~] **Layout System**
    - [x] Create `layouts/auth.vue` (Blank canvas for Auth page).
    - [ ] Create `layouts/default.vue` (Sidebar + Topbar + Slot for content).
- [x] **Authentication Flow**
    - [x] Implement Auth page (`/auth`) with Supabase Auth.
    - [x] Create main landing page (`/`) with basic marketing content.
    - [x] Create `middleware/auth.global.ts` to protect routes and handle redirects.
    - [x] Add `redirectTo` query parameter support to remember intended destination.
    - [x] Implement inverted auth logic (publicRoutes whitelist instead of protectedRoutes).
- [ ] **Base UI Components**
    - [x] Install/Configure UI Library (Nuxt UI / Tailwind).
    - [ ] Setup a dark/light mode toggle (optional but good for practice).
- [ ] **Global Error Handling & Notifications**
    - [ ] Install and configure toast notification library (vue-sonner or Nuxt UI Toast).
    - [ ] Replace all `alert()` calls with toast notifications.
    - [ ] Add global error boundary for uncaught errors.
    - [ ] Create composable for consistent error messaging (`useErrorHandler`).

## 🏢 Phase 2: Multi-Tenancy (Organizations)
*Focus: Handling multiple workspaces for a single user.*

- [ ] **Organization Logic (State)**
    - [ ] Create a Pinia store or Composable (`useTenant`) to manage the `currentOrg`.
    - [ ] Implement logic to fetch user's organizations on login.
- [ ] **Organization Middleware**
    - [ ] Create `middleware/tenant.ts` to ensure user has access to the requested Org ID in the URL.
    - [ ] Handle "No Organization" state (redirect to "Create Org" or "Onboarding").
- [ ] **Organization UI**
    - [ ] Build an "Organization Switcher" component in the Sidebar.
    - [ ] Build a "Create New Organization" form.

## 👥 Phase 3: Candidates Module (Core Feature)
*Focus: CRUD, Server-side pagination, and Forms.*

- [ ] **Candidates List**
    - [ ] Create `pages/org/[id]/candidates/index.vue`.
    - [ ] Implement **Server-Side Pagination** using `useAsyncData` and Supabase `range()`.
    - [ ] Add Search and Filters (by status, role) keeping state in URL (query params).
- [ ] **Candidate Details**
    - [ ] Create dynamic route `pages/org/[id]/candidates/[candidateId].vue`.
    - [ ] Fetch detailed candidate profile + related data (e.g., applications).
- [ ] **Candidate Mutations**
    - [ ] Create "Add Candidate" Modal/Drawer.
    - [ ] Implement form validation (Zod + Nuxt Form).
    - [ ] Implement "Delete Candidate" with confirmation.

## 💼 Phase 4: Jobs & Pipeline
*Focus: relational data and status management.*

- [ ] **Jobs Management**
    - [ ] Create `pages/org/[id]/jobs/index.vue` (List view).
    - [ ] Create "Post a Job" wizard.
- [ ] **Recruitment Pipeline**
    - [ ] Link Candidates to Jobs (Many-to-Many relationship).
    - [ ] Create a Kanban or Status view for a specific Job (Applied -> Interview -> Offer).
    - [ ] Implement Drag-and-Drop to change candidate status (optional, can start with dropdowns).

## 🚀 Phase 5: UX & Performance Polish
*Focus: Making it feel like a professional app.*

- [ ] **Feedback Loop**
    - [ ] Implement Toast notifications for success/error actions (Nuxt UI Toasts).
    - [ ] Create specific Error Pages (404, 403).
- [ ] **Loading States**
    - [ ] Add Skeleton loaders for Tables and Cards while fetching data.
    - [ ] Use `NuxtLoadingIndicator` for route transitions.
- [ ] **SEO & Meta (Basic)**
    - [ ] Configure `useHead` for dynamic page titles (e.g., "Candidate Name | HR CRM").

## 🧪 Phase 6: QA & Hardening (Bonus)
- [ ] **Linting**
    - [ ] Ensure ESLint and Prettier are strict.
- [ ] **Security Check**
    - [ ] Verify Supabase RLS (Row Level Security) policies match the frontend logic.