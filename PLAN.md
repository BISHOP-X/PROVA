# PROVA MVP Plan

## Purpose

This file is the working delivery plan for the team.

Its job is to keep the product, implementation order, and teammate responsibilities stable while we move from the current UI-first state to a proper hackathon MVP.

If new ideas come up during implementation, they do not go straight into the build. They first get evaluated against this plan.

## Non-Negotiable Product Scope

PROVA is an AI-verified disbursement platform.

The demo use case is scholarship and stipend payout verification before money moves.

The MVP must prove this exact flow:

1. Admin creates or views a payout batch.
2. Beneficiary submits identity and bank details.
3. PROVA runs verification checks and produces a trust decision.
4. Admin reviews flagged beneficiaries.
5. Only approved beneficiaries are released for payout through Squad.
6. Transfer status and audit trail are visible in the system.

Anything outside that flow is secondary.

## Current State

What we already have:

- React + TypeScript + Vite app at the repo root
- Tailwind-based UI structure
- Admin dashboard pages and beneficiary-facing pages
- shared layout components for admin and beneficiary views
- product scope documented in README.md and ARCHITECTURE.md
- Supabase folder reserved for backend work

What we do not have yet:

- real authentication
- real database schema
- real beneficiary submission flow
- real file uploads
- verification orchestration
- trust decision engine
- Squad payout execution
- audit event persistence

This means the current branch is a UI foundation, not the finished MVP.

## MVP Outcome

By the end of this plan, the demo must support one believable end-to-end story:

- an admin can see beneficiaries in different verification states
- a beneficiary can submit onboarding information
- the system stores submission data and verification results
- the system assigns `approved`, `review`, or `rejected`
- approved beneficiaries can move into payout processing
- payout status can be checked and shown in the UI
- audit events exist for major actions

The MVP does not need full production robustness. It does need a coherent end-to-end story with real state changes.

## Team Roles

There are three contributors:

- Frontend engineer: owns UI implementation quality, page flows, reusable components, client state, and integration of backend responses into the interface
- Backend engineer: owns Supabase schema, Edge Functions, provider integrations, webhook handling, data integrity, and security-sensitive server logic
- Full-stack lead: owns cross-cutting decisions, API contracts, review of both sides, integration glue, final demo quality, and any work that falls between frontend and backend

## Ownership By Folder

### Frontend engineer owns

- `src/components/**`
- `src/pages/**`
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- UI polish, loading states, empty states, error states, and responsive behavior

### Backend engineer owns

- `supabase/functions/**`
- database schema design and SQL docs to be added under `supabase/` or `docs/` if needed
- server-side integration logic for Squad and verification providers
- webhook handling and audit persistence

### Full-stack lead owns

- `README.md`
- `ARCHITECTURE.md`
- `PLAN.md`
- shared contracts between frontend and backend
- environment variable shape
- final integration testing
- changes that cross both `src/` and `supabase/`

## Working Rules

### Rules for everyone

- Do not change the product scope without updating this file first.
- Do not build side features that are not required for the MVP story.
- Do not merge broken code into `main`.
- Every non-trivial change should preserve build health.
- Prefer small, reviewable PRs or branch updates over giant unreviewed dumps.
- Keep naming consistent with the product docs.

### Rules for frontend work

- Do not fake backend behavior in a way that breaks later integration.
- Build pages around real data shapes agreed with backend, even if temporary mock data is used first.
- Use shared layout and component patterns instead of page-by-page duplication.
- Every screen must have loading, error, and empty states before it is considered complete.
- Keep routes aligned with the product flow, not just visual mockups.

### Rules for backend work

- Do not expose Squad or AI secrets to the client.
- Keep provider calls inside Edge Functions or other server-only code.
- Save important state transitions to the database.
- Write database changes in a way the frontend can consume cleanly.
- Prefer simple, explicit workflows over over-engineered abstractions.

### Rules for full-stack integration

- API contracts must be agreed before both sides implement against assumptions.
- If frontend needs mock data, mock the agreed contract shape, not random placeholder objects.
- Before demo day, all critical screens must use real backend data for the main flow.

## Delivery Phases

## Phase 1: Stabilize The UI Foundation

Goal:
Make the reviewed frontend branch the new base of `main` and clean obvious structure issues without redesigning the app.

Done when:

- branch is merged to `main`
- app builds and lints on `main`
- shared routes and layout structure are stable
- unnecessary confusion around unused placeholders is reduced

Owner split:

- Frontend engineer: clean route flow, tighten static screen quality
- Full-stack lead: merge control, review gate, plan ownership

## Phase 2: Lock Data Contracts

Goal:
Define the exact objects that move through the system.

Must define:

- beneficiary profile shape
- verification submission shape
- verification result shape
- payout batch shape
- payout item shape
- audit event shape

Done when:

- frontend and backend use the same field names
- no major screen depends on guessed response formats

Owner split:

- Backend engineer: propose schema and server payloads
- Full-stack lead: approve final contract
- Frontend engineer: adapt UI state to contract

## Phase 3: Build The Supabase Base

Goal:
Create the minimum backend foundation needed for the MVP.

Must include:

- core tables for profiles, beneficiaries, verification results, payout batches, payout items, and audit events
- storage buckets for documents/selfies if used in the demo
- basic auth model for admin and beneficiary access

Done when:

- data can be created and queried for the main flow
- frontend can read and render real records

Owner split:

- Backend engineer: schema, policies, storage, seed data
- Full-stack lead: validate model against product flow

## Phase 4: Wire Beneficiary Submission

Goal:
Turn onboarding from a static page into a working submission flow.

Must include:

- form validation
- submission persistence
- file upload handling if part of demo
- status update after submission

Done when:

- a beneficiary submission creates real backend state
- admin views can see submitted beneficiaries

Owner split:

- Frontend engineer: form UX and submission states
- Backend engineer: storage, persistence, submission endpoint
- Full-stack lead: join both sides and verify flow

## Phase 5: Add Verification Decisioning

Goal:
Produce a real trust outcome for each beneficiary.

Must include:

- external AI provider integration or controlled mock orchestration for demo
- rules that map signals into `approved`, `review`, or `rejected`
- reason codes that can be shown in admin UI

Done when:

- a beneficiary moves into one of the three decision states
- admin pages reflect the result clearly

Owner split:

- Backend engineer: orchestration and rules
- Frontend engineer: status presentation and review UI
- Full-stack lead: decision rules and demo realism

## Phase 6: Add Squad Payout Flow

Goal:
Connect approved beneficiaries to payout execution.

Must include:

- account lookup before payout
- transfer trigger for approved payout items
- transfer status requery or result tracking
- audit event creation for payout actions

Done when:

- approved beneficiaries can move from verification approval to payout state
- payout status is visible in admin UI

Owner split:

- Backend engineer: Squad integration and persistence
- Frontend engineer: payout controls and status display
- Full-stack lead: integration test and demo path

## Phase 7: Final Demo Hardening

Goal:
Make the MVP presentable and reliable enough for judges.

Must include:

- seeded demo data
- one polished admin flow
- one polished beneficiary flow
- clear audit visibility
- elimination of dead ends on key screens

Done when:

- the team can run the full story without explaining away broken gaps

## Immediate Next Tasks

### Frontend engineer next tasks

- keep the newly merged UI branch stable
- remove or implement empty placeholders that confuse routing
- prepare components to read from real backend contracts instead of static-only content
- add loading and empty states where the UI will later depend on real data

### Backend engineer next tasks

- define MVP schema and table list
- define request and response shapes for beneficiary submission and verification results
- prepare Edge Function plan for verification orchestration and Squad calls
- decide which parts of the verification flow will be real integrations versus controlled demo logic

### Full-stack lead next tasks

- merge and protect the current frontend foundation
- approve contract shapes before deeper implementation starts
- coordinate frontend/backend handoff points
- keep README, ARCHITECTURE, and PLAN aligned
- review both workstreams continuously so divergence gets stopped early

## Merge And Review Policy

- `main` stays deployable.
- No branch gets merged just because it looks good visually.
- Minimum merge gate for now: project builds, project lints, and the change does not break the agreed MVP scope.
- If a branch introduces a new dependency, it must update package files correctly.
- If a branch changes contracts, both frontend and backend owners must acknowledge the change.

## Change Control

We should only change this plan when one of these is true:

- the hackathon scope changes
- a provider or platform constraint forces a redesign
- the team finishes a phase and needs to unlock the next one
- a feature is clearly blocking the MVP story

If a task does not help the main MVP story, it is backlog, not active work.