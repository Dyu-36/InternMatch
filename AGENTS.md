<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Code discovery

Prefer codebase-memory-mcp (`search_graph`, `trace_path`, `get_code_snippet`, `query_graph`) over text search for code discovery. Index the repository first if needed. Use `rg` for string literals, configuration, documentation, and graph coverage gaps.

## Scope and checks

Follow `docs/Contract.md` and the 12 mockups. Keep public route paths stable and support Vietnamese/English. Never add mock fallback to production data access. Apply schema changes through versioned Supabase migrations, preserve RLS, and never commit credentials.

Run `pnpm lint` and `pnpm build`. For backend changes, run `pnpm qa:backend` with a temporary QA cleanup key; for user flows run `pnpm qa:ui` against a running app. Test scripts create and remove their own accounts and storage objects.
