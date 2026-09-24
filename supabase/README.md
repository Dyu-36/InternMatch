# Supabase setup

## 1. Environment

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://johsqcfalnqdbksenyjy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The publishable key is safe for browser use. Never put a `service_role` key in the frontend or commit it.

## 2. Authentication

The current product contract uses username + password. InternMatch maps the username to an internal Auth email (`username@internmatch.local`). In Supabase Dashboard, open **Authentication → Providers → Email** and disable **Confirm email**. Otherwise the internal email cannot receive the confirmation message.

## 3. Database and Storage

The InternMatch project has both migrations applied. For a new project, apply the files in `supabase/migrations/` in timestamp order. They create:

- `profiles`, `student_profiles`, `company_profiles`
- `jobs`, `applications`
- RLS policies for student/company ownership
- `avatars`, `company-logos`, and private `resumes` buckets

The second migration makes account roles immutable, creates profiles in an Auth trigger, limits column updates, snapshots applicant details, enforces file limits, and grants receiving companies access to submitted CVs. Migrations are recorded in `supabase_migrations.schema_migrations`; do not reapply recorded migrations.

See [handover](../docs/HANDOVER.md) for test commands and operating instructions.
