---
description: "Use when the task depends on live database state, live API state, production or sandbox resources, current schema, runtime logs, or any information that should be fetched from MCP or another live tool."
name: "Live Info Only"
---

# Live-Info Rules

- Always use MCP to get live information when MCP is available.
- Never answer live-state questions from memory when the source can be queried.
- Prefer live inspection over assumptions for database state, API state, payments state, and environment state.
- If the required MCP or live tool is not configured, state that constraint instead of inventing an answer.
