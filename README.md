# Nuxt Minimal Starter
# Recruit Pro - IT Recruitment CRM

Modern recruitment CRM built with Nuxt 4, Supabase, and TanStack Query.

## Features
- 🔐 Authentication (Supabase Auth)
- 👥 Candidate Management (CRUD)
- 🔍 Smart Search & Filtering
- 📊 Job Matching Algorithm
- 🎨 Modern UI (shadcn-vue + Tailwind)
- ⚡ Optimized Performance (TanStack Query caching)

## Tech Stack
- **Frontend**: Nuxt 4, Vue 3, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query v5
- **UI**: shadcn-vue, Tailwind CSS
- **Icons**: lucide-vue-next

## Architecture
3-layer pattern: Types → Services → Composables
[Add architecture diagram or link to copilot-instructions.md]

## Setup
1. Clone the repository
2. Install dependencies
3. Set up Supabase
4. Run the development server

```bash
npm install
npm run dev
```

## Configuration
1. Create a `.env` file and add your Supabase credentials
2. Run `npm run supabase:generate-types` to generate the Supabase types
3. Run `npm run supabase:push` to push the migrations to the database
4. Run `npm run dev` to start the development server

## Demo
[Add live demo link if deployed on Vercel/Netlify]
