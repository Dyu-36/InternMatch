<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Code discovery

Prefer codebase-memory-mcp (`search_graph`, `trace_path`, `get_code_snippet`, `query_graph`) over text search for code discovery. Index the repository first if needed. Use `rg` for string literals, configuration, documentation, and graph coverage gaps.

## Scope and checks

Follow `docs/Contract.md` and the 12 mockups. Keep public route paths stable and support Vietnamese/English. Never add mock fallback to production data access. Apply schema changes through versioned Supabase migrations, preserve RLS, and never commit credentials.

Run `pnpm lint` and `pnpm build`. For backend changes, run `pnpm qa:backend` with the local QA cleanup key; for user flows run `pnpm qa:ui` against a running app. Test scripts create and remove their own accounts and storage objects.

### Local Supabase QA setup

- Use the credentials already configured in the ignored `.env.local`; do not ask the user to resend them. Save this file as UTF-8 without a BOM so Node's `--env-file` reads every variable correctly.
- `SUPABASE_ACCESS_TOKEN` is a Supabase Management API personal access token, not a project service-role key. If `SUPABASE_TEST_SERVICE_ROLE_KEY` is missing, use the management token to retrieve the admin API key for the configured InternMatch project (`johsqcfalnqdbksenyjy`) and store it only in `.env.local` for local QA.
- Check that the QA key, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` belong to that same project. Never print secret values, commit them, put them in `NEXT_PUBLIC_*` variables, or deploy QA/management credentials to Vercel.
- The user has authorized the existing QA scripts to create and clean up their own test accounts and storage objects in this project. Preserve their cleanup logic and do not modify unrelated user data.
- Set `BASE_URL` to the local running app (for example `http://localhost:3001` if port 3000 is occupied). Run `pnpm qa:schools` for changes to the university list/search, in addition to the checks above.

## UI component rules

- Use the existing shadcn/ui components from `src/components/shadcn` whenever a matching component exists. Do not hand-roll generic buttons, inputs, labels, selects, textareas, checkboxes, dialogs, cards, or form controls.
- Do not create duplicate generic components under `src/components/ui`. Existing components there may be used only when they are domain-specific or when no shadcn/ui equivalent exists, such as layout primitives.
- Before adding UI, inspect `components.json` and `src/components/shadcn`; extend the shadcn/ui component set using the canonical shadcn implementation instead of inventing a parallel API or styling system.
- Forms must use shadcn/ui primitives with accessible labels, descriptions, invalid states, and field-level messages. Preserve existing business logic and authentication behavior during UI-only refactors.
- Searchable selects/comboboxes must compose the canonical shadcn `Command` and `Popover` primitives; do not use a native `<select>` when users need search.
- Keep styling consistent with shadcn/ui tokens and `cn` from `@/lib/utils`; do not import `cn` from third-party packages or introduce ad-hoc generic CSS components.
- When a requested UI has no existing shadcn primitive, explain the gap and add the smallest canonical primitive needed before composing the feature.
