# Demo database seed

The demo seeds load **100 jobs across information technology, accounting and
sales** plus **30 fictional applicants and 200 applications** into Supabase.
Jobs feed the public job board; applicants populate company dashboards through
the normal RLS-protected application queries.

Nothing here is read by the application at runtime. The app keeps talking to
Supabase directly; these commands only populate the database.

## Files

| File | Purpose |
| --- | --- |
| `../../scripts/seed-jobs.mjs` | Seeder: creates the demo company accounts and upserts the jobs. |
| `../../scripts/resolve-company-logos.mjs` | Resolves real company logos from Wikidata/Wikimedia Commons and verifies them over HTTP. |
| `../../scripts/seed-data/companies.mjs` | 25 real companies, reserved demo contact fields, and the industry strings the job filters match on. |
| `../../scripts/seed-data/jobs.mjs`, `jobs-accounting.mjs`, `jobs-sales.mjs` | The 100 postings. |
| `../../scripts/seed-data/company-logos.json` | Generated logo catalog. Do not hand-edit. |
| `../../scripts/seed-applicants.mjs` | Applicant seeder: creates reserved demo student accounts and upserts 200 applications against the 100 jobs. |
| `../../scripts/seed-data/applicants.mjs` | 30 fictional applicants and a fixed Pexels workspace-image catalog. |

## Running it

```bash
# 1. Plan only (default, no writes)
node --env-file=.env.local scripts/seed-jobs.mjs

# 2. Write to the database
node --env-file=.env.local scripts/seed-jobs.mjs --apply

# 3. Re-apply on a later day: deadlines and posting dates roll forward, ids stay the same
node --env-file=.env.local scripts/seed-jobs.mjs --apply --today=2026-09-25

# 4. One company only
node --env-file=.env.local scripts/seed-jobs.mjs --apply --slug=deloitte

# 5. Remove every seeded row and account
node --env-file=.env.local scripts/seed-jobs.mjs --apply --purge
```

Applicant and application seed:

```bash
# Plan only: 30 fictional students and 200 applications (no database access)
pnpm seed:applicants:plan

# Write to the configured test/demo project
pnpm seed:applicants

# Remove only matching reserved applicant accounts and their applications
node --env-file=.env.local scripts/seed-applicants.mjs --purge
node --env-file=.env.local scripts/seed-applicants.mjs --purge --apply
```

Run the job seed before the applicant seed. Supabase assigns the actual Auth,
profile, student-profile, and seeded company owner ids; the applicant seeder
discovers and reuses those ids. Job ids and application ids are deterministic,
so re-applying updates the same job and application rows. The dataset has 10
applicants in each focus group and eight applications per seeded company.
Applicant accounts use the `seed_app_` username prefix and exact reserved
`seed-applicant-*@internmatch.example` emails, carry random unusable passwords,
and are accepted for overwrite or purge only when every reserved marker matches.
Avatars use verified fixed Pexels workspace images (not faces); if none are
available, the UI safely falls back to initials. No CV files are created.

Required environment (from the ignored `.env.local`, never committed):
`NEXT_PUBLIC_SUPABASE_URL` plus `SUPABASE_TEST_SERVICE_ROLE_KEY` (or
`INTERNMATCH_SUPABASE_SECRET_KEY`). Secrets are read from the environment only;
the script never prints or writes them.

## Idempotency and safety

- **Stable database rows.** Job ids and application ids are UUIDv5 values of a
  fixed namespace plus the entity slug. Applicant applications store the actual
  Supabase Auth/profile id returned when each reserved account is created or
  discovered, and target the actual owner id stored on each seeded job.
- **Reserved marker.** Demo companies use the username prefix `seed_` and the
  reserved, non-deliverable email domain `internmatch.example`. Applicant
  accounts use exact `seed-applicant-*@internmatch.example` emails and the
  `seed_app_` username prefix. Each seeder refuses identity collisions that do
  not match all of its reserved markers, so real registrations are not changed.
- **Unusable accounts.** Each demo account gets a random password that is never
  printed, so nobody can sign in as a seeded company.
- **No real contact data.** E-mail addresses use the reserved `.example` domain,
  the tax code is `0000000000`, hotlines are empty, and addresses are
  district-level only. Company names, official websites and logos are accurate
  real-world information; the postings themselves are fictional, and every
  company description repeats that notice in the UI.
- **Bounded blast radius.** Applicant `--purge` discovers only exact reserved
  applicant emails/usernames, requires the `STUDENT` role, and deletes only
  applications attached to those verified actual profile ids plus their Auth
  users. Companies and jobs are out of scope.
- **Explicit writes.** Nothing is written without `--apply`; the default run
  prints the plan.
- **Data validation.** The seeder refuses to run unless the dataset has exactly
  100 jobs, unique slugs, known companies, valid `JobType` values, positive
  quotas, and `max_salary >= min_salary`.

## Logos are real, never drawn

Logos are **not** generated, edited, or approximated. `resolve-company-logos.mjs`
reads each company's Wikidata item, takes the official logo file from property
`P154` (falling back to `P41`), and links the Wikimedia Commons thumbnail served
from `upload.wikimedia.org`. Each entry records the Commons file, its source
page and licence, so every asset is traceable to its real brand.

Every URL in the catalog was confirmed to return `200` with an `image/*` content
type, and a sample of the images was visually checked. Any company that cannot
be resolved and verified is written **without** a logo and falls back to the
company initial in the UI.

Two entries use a reviewed override in the script, because Wikidata points at
something that is not the international brand logo: `bdo` (Wikidata links the
German member firm logo) and `intel` (Wikidata links the 1968-2006 lockup).

Refresh or audit the catalog with:

```bash
node scripts/resolve-company-logos.mjs          # re-resolve and rewrite the catalog
node scripts/resolve-company-logos.mjs --check  # verify the committed URLs, exit 1 on drift
```

## Dataset scope

The complete demo dataset is **25 companies, 100 jobs, 30 fictional student
profiles, and 200 applications**. Applicant applications are distributed
across all 100 jobs, with two applicants per job and eight applications per
company. The mixture includes PENDING, REVIEWED, ACCEPTED, and REJECTED states
so company dashboard workflows are visible immediately.

Run both seeders only against a test/demo Supabase project. Applicant Auth
accounts are intentionally reserved and unusable, but application RLS still
exposes them to the corresponding company dashboards. Use the guarded purge
commands before reusing that project for real users.

## Notes

- 5 of the 100 postings are seeded with a deadline in the past so the closed
  state ("Tin tuyển dụng đã hết hạn nhận hồ sơ") is visible in the demo; the
  other 95 close 12-35 days after the run date.
- Re-running the seed on a different day rolls the deadlines and posting dates
  forward, which keeps the demo board from ageing out. Use `--today=YYYY-MM-DD`
  for a byte-reproducible run.
- Staggered `created_at` dates keep the default "newest first" ordering stable.
