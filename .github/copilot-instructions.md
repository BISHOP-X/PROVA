# Project Guidelines

## Research And Verification

- Never assume platform behavior, API fields, limits, or product capabilities. Always use the docs.
- If the docs are missing, unclear, or contradictory, stop and verify before making a decision.
- Use MCP tools for live information whenever they are available instead of relying on memory.

## Database And Change Safety

- Never delete the database.
- Full-file rewrites are not acceptable when a smaller targeted change can solve the problem.
- Prefer the smallest efficient change that preserves existing behavior.
