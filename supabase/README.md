# Supabase setup

## 1. Environment

Copy `.env.example` to `.env.local` and set the public app origin and publishable credentials:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://johsqcfalnqdbksenyjy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
AUTH_EMAIL_DOMAIN=internmatch.vercel.app
```

The publishable key is safe for browser use. Never put a `service_role` key in the frontend or commit it. `NEXT_PUBLIC_SITE_URL` is the canonical public origin used in recovery emails; production must set it to the trusted public site origin rather than a localhost value.

On Vercel, set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_INTERNMATCH_SUPABASE_URL`, and `NEXT_PUBLIC_INTERNMATCH_SUPABASE_PUBLISHABLE_KEY` for the app. The project-specific variables take precedence over `NEXT_PUBLIC_SUPABASE_*` injected by integrations. Set `INTERNMATCH_SUPABASE_SECRET_KEY` as a server-only secret for account creation; the app falls back to regular Auth sign-up when it is absent.

## 2. Authentication

- New registrations require a real email address, the student's full name or company name, a password, and password confirmation. Do not map new accounts to an internal email domain.
- Login accepts either the real email or a legacy username. Only the legacy username compatibility path maps a username through `AUTH_EMAIL_DOMAIN`; it is not a contact address.
- Forgot/reset password uses Supabase recovery PKCE and sends the recovery link to the account's real email. The callback completes the session before the user sets a new password.

In **Supabase Dashboard → Authentication → URL Configuration**, verify this production checklist:

- Set **Site URL** to the production value of `NEXT_PUBLIC_SITE_URL`.
- Add `<NEXT_PUBLIC_SITE_URL>/auth/callback` to **Redirect URLs**.
- For local development, use `http://localhost:3000` as Site URL and allow `http://localhost:3000/auth/callback`.

Do not change the callback to a bare `/auth/callback` entry: Supabase must receive the absolute `<SITE_URL>/auth/callback` URL for each trusted environment.

## 3. Database and Storage

The InternMatch project has both migrations applied. For a new project, apply the files in `supabase/migrations/` in timestamp order. They create:

- `profiles`, `student_profiles`, `company_profiles`
- `jobs`, `applications`
- RLS policies for student/company ownership
- `avatars`, `company-logos`, and private `resumes` buckets

The second migration makes account roles immutable, creates profiles in an Auth trigger, limits column updates, snapshots applicant details, enforces file limits, and grants receiving companies access to submitted CVs. Migrations are recorded in `supabase_migrations.schema_migrations`; do not reapply recorded migrations.

See [handover](../docs/HANDOVER.md) for test commands and operating instructions.
