# AGENTS.md

## Scope

- Work from this repository root: `C:\Users\dell\Desktop\SQUAD HACKATHON`.
- Treat this repo as the single project scope. Do not assume sibling folders or other Supabase projects are relevant.

## Product And Architecture

- `README.md`, `ARCHITECTURE.md`, and `PLAN.md` are the source of truth for product scope and implementation direction.
- The app is a React + TypeScript + Vite frontend with Supabase Edge Functions under `supabase/functions`.
- Do not assume Squad, AI providers, auth flows, or payout flows are fully implemented. Verify backend scope from code and the live Supabase project before making changes.

## Research And Verification

- Never assume platform behavior, API fields, limits, or product capabilities. Use the docs first.
- If documentation is missing, unclear, or contradictory, stop and verify before deciding.
- Use MCP for live information whenever it is available.
- For database state, auth state, edge functions, logs, or current schema, use live inspection instead of memory.
- If the needed MCP or live tool is not configured, state that constraint explicitly instead of guessing.

## Database And Backend Safety

- Never delete the database.
- Use read-only live inspection by default.
- Do not infer schema, RLS posture, or function behavior from env files alone. Confirm against the live project.
- Call out mismatches between repo env/config and the live Supabase project before feature work.

## Code Change Policy

- Prefer the smallest targeted change that solves the problem and preserves behavior.
- Avoid full-file rewrites when a surgical edit is sufficient.
- Preserve existing conventions unless there is a clear, project-specific reason to change them.
- Keep frontend and backend changes aligned to the actual contract shape used by the app.

## Demo Constraints

- This project is a hackathon MVP and should remain demo-first.
- Favor clarity, believable state transitions, and auditability over speculative production depth.
- Do not claim unsupported functionality in code or documentation.
