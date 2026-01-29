# Recruit Pro

> Modern IT recruitment CRM built with Nuxt 4, Supabase, and TanStack Query

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00DC82)](https://nuxt.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E)](https://supabase.com/)

## ✨ Features

- 🔐 **Authentication** - Secure auth via Supabase
- 👥 **Candidate Management** - Full CRUD with advanced filtering
- 🔍 **Smart Search** - Multi-field search across candidates
- 📊 **Job Matching** - AI-powered candidate-job matching
- 🎨 **Modern UI** - Beautiful, responsive interface with shadcn-vue
- ⚡ **Performance** - Optimized caching with TanStack Query
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/recruit-pro.git
cd recruit-pro
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Generate Supabase types**

```bash
npm run supabase:generate-types
```

5. **Start development server**

```bash
npm run dev
```

6. **Open browser** at http://localhost:3000

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Nuxt 4 (Vue 3 Composition API) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **State Management** | TanStack Query v5 |
| **UI Components** | shadcn-vue + Tailwind CSS |
| **Icons** | lucide-vue-next |
| **Language** | TypeScript (strict mode) |
| **Utilities** | @vueuse/core, vue-sonner |

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

- **[Architecture](./docs/ARCHITECTURE.md)** - System design, 3-layer pattern, tech stack decisions
- **[Patterns](./docs/PATTERNS.md)** - Code patterns, best practices, naming conventions
- **[API Reference](./docs/API.md)** - TypeScript guidelines, commands, utilities
- **[Contributing](./docs/CONTRIBUTING.md)** - Development workflow, commit guidelines

**New to the project?** Start with [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🏛️ Architecture Overview

The application follows a strict **3-layer architecture**:

```
┌─────────────────────────────────────┐
│     Components (UI Layer)           │
│     - User interactions             │
│     - Side effects (toasts, nav)    │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│     Composables (Data Layer)        │
│     - TanStack Query hooks          │
│     - Pure data operations          │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│     Services (Business Logic)       │
│     - Pure async functions          │
│     - Dependency injection          │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│     Types (Data Shapes)             │
│     - Auto-generated from DB        │
└─────────────────────────────────────┘
```

**Key Principle:** Clean separation of concerns - data operations vs. user experience.

## 🛠️ Essential Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build

# Supabase
npm run supabase:generate-types        # Generate types from remote schema
npm run supabase:generate-types-local  # Generate types from local Supabase
npm run supabase:push                  # Push database migrations
npm run supabase:new-migration         # Create new migration

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) to get started.

### Development Philosophy

**Pragmatic Quality** - Clean, readable, robust code without over-engineering.

Core values:
- ✅ Type safety (strict TypeScript)
- ✅ Separation of concerns (3-layer architecture)
- ✅ Scalability (cloud-ready)
- ✅ Developer experience (clear patterns, good docs)

## 📄 License

[MIT License](./LICENSE)

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Nuxt](https://nuxt.com/)
- [Supabase](https://supabase.com/)
- [TanStack Query](https://tanstack.com/query)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/)
