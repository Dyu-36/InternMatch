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

Run `supabase/migrations/20260924181500_initial_schema.sql` once in the Supabase SQL Editor. It creates:

- `profiles`, `student_profiles`, `company_profiles`
- `jobs`, `applications`
- RLS policies for student/company ownership
- `avatars`, `company-logos`, and private `resumes` buckets

The migration uses `if not exists` and replaces only the policies created by this migration. Review an existing project before applying it.
