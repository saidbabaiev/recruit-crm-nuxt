# Database Migrations

## 📌 Project Context

This is the **recruit-pro** project - a pet project for recruitment management.

## 🏗️ Current Database State (as of Jan 23, 2026)

### Schema Overview

**Tables:**
- `candidates` - Candidate profiles
- `jobs` - Job positions
- `job_applications` - Applications linking candidates to jobs
- `clients` - Client companies
- `interviews` - Interview schedules
- `profiles` - User profiles
- `companies` - Company/tenant data
- `saved_searches` - Saved search queries
- `team_invitations` - Team member invitations
- `user_companies` - User-company relationships
- `candidate_notes` - Notes on candidates

### Security (RLS)

✅ **Row Level Security is ENABLED** on all tables

**Multi-tenant isolation:** All tables use `company_id` for data isolation between companies.

**Key RLS policies in place:**
- Users can only access data from their own company
- Policies enforce `company_id` matching via `get_user_company_id()` function
- All CRUD operations (SELECT, INSERT, UPDATE, DELETE) are protected

### Helper Functions

- `get_user_company_id()` - Returns the current user's company_id from their profile
- `switch_company()` - Allows users to switch between companies (if they belong to multiple)

## 🚦 Migration History

### Historical Migrations (Not Tracked)

The following migrations were created directly in Supabase Dashboard and are NOT in this repo:
- `20250805070940` - Initial schema
- `20250805081215` - (unknown)
- `20250806034816` - (unknown)
- `20250806043122` - (unknown)
- `20250806053451` - (unknown)
- `20250806055744` - (unknown)
- `20250807033612` - (unknown)
- `20250807084728` - (unknown)
- `20250824011535` - (unknown)

**Note:** These migrations are already applied in production and working correctly.

### Baseline (Jan 23, 2026)

We consider the current state as the **baseline** for future migrations.

## 📝 Going Forward

### Creating New Migrations

When you need to change the database schema:

\`\`\`bash
# 1. Create a new migration file
npx supabase migration new add_column_to_candidates

# 2. Edit the generated file in supabase/migrations/
# 3. Test locally (if using local Supabase)
npx supabase db reset

# 4. Apply to production
npx supabase db push
\`\`\`

### Migration Naming Convention

Use descriptive names with action prefixes:
- `add_column_to_candidates` ✅
- `create_table_interviews` ✅
- `add_index_on_company_id` ✅
- `enable_rls_on_new_table` ✅
- `migration1` ❌ (too vague)

### Best Practices

1. **One change per migration** - easier to rollback if needed
2. **Always include DOWN migration** - for reversibility
3. **Test before production** - use local Supabase or staging
4. **Document why** - add comments explaining the business reason

### Example Migration

\`\`\`sql
-- Migration: add_candidate_linkedin_url
-- Date: 2026-01-23
-- Author: Said
-- Reason: Track candidates' LinkedIn profiles for better sourcing

-- UP
ALTER TABLE candidates 
ADD COLUMN linkedin_url TEXT;

COMMENT ON COLUMN candidates.linkedin_url IS 'LinkedIn profile URL';

-- DOWN (for rollback)
-- ALTER TABLE candidates DROP COLUMN linkedin_url;
\`\`\`

## 🔍 Useful Commands

\`\`\`bash
# Check migration status
npx supabase migration list

# Create new migration
npx supabase migration new <name>

# Apply migrations to production
npx supabase db push

# Generate TypeScript types from schema
npm run supabase:generate-types

# View remote schema (in SQL format)
npx supabase db dump --schema public

# Check RLS policies
npx supabase db remote exec "
  SELECT tablename, policyname 
  FROM pg_policies 
  WHERE schemaname = 'public';
"
\`\`\`

## 🛡️ Security Checklist

Before deploying any migration:

- [ ] Does it maintain RLS policies?
- [ ] Does it include `company_id` for multi-tenant tables?
- [ ] Are sensitive columns protected?
- [ ] Are indexes added for performance?
- [ ] Is the migration reversible?

## 📚 Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/managing-migrations)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-tenant Architecture](https://supabase.com/docs/guides/auth/row-level-security#multi-tenancy)