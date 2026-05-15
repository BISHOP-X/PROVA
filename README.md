# PROVA

PROVA is an AI-verified disbursement engine for institutions that send money to people.

For this hackathon, PROVA should be treated as a polished proof of concept, not a production-ready rollout.

The goal is to make the core idea feel obvious, exciting, and credible in a live demo.

Our first deployment is scholarship and stipend payouts, where fake beneficiaries, duplicate identities, incorrect bank details, and weak manual review can cause real financial loss.

Instead of paying first and auditing later, PROVA verifies the beneficiary, assigns a trust decision, and only then releases funds through Squad.

## Final Project Definition

PROVA is not a scholarship app.

It is a verified disbursement platform, and scholarships are the first use case we will demo because they are easy to understand, relevant to the hackathon audience, and strong enough to prove the platform.

### Core Product

- Institutions create a payout batch.
- Beneficiaries submit identity evidence such as selfie, student ID, and bank details.
- External AI services perform liveness, face comparison, OCR, and document checks.
- Our trust engine combines those signals with product rules to produce one interpretable outcome: `approved`, `review`, or `rejected`.
- Approved beneficiaries are paid through Squad.
- Risky beneficiaries are held for manual review.
- Every verification and payout event is logged for audit.

### First Use Case

Scholarship and stipend disbursement for universities, academies, and training programs.

### Expansion Story

The same engine can later power:

- NGO aid and cash transfers
- Internship and training grants
- Payroll validation
- Insurance claim disbursement
- Cooperative or welfare payouts

That keeps the demo focused while still making the product feel like infrastructure.

## Why This Fits The Guide

This concept fits Challenge 1 better than Challenge 2.

### Challenge Fit

- The guide asks for an AI solution that verifies, trusts, or authenticates something in a fraud-prone context.
- Our AI layer verifies whether a beneficiary is legitimate before money moves.
- The output is interpretable: `approved`, `review`, `rejected`, plus reason codes and trust score.
- The workflow includes edge cases such as failed liveness, duplicate face match, suspicious bank reuse, or incomplete documents.
- Squad is not decorative. No payout is released without Squad account lookup and transfer.

### Four Pillars Fit

- AI Automation: verification happens before payout release.
- Use of Data: trust scoring combines identity signals, document signals, and payout-risk signals.
- Squad APIs: payout orchestration depends on Squad account lookup, transfer, and transfer status confirmation.
- Financial Innovation: the product inserts an intelligence layer into disbursement systems that are usually blind.

### Judging Criteria Fit

- AI Technical Depth: our contribution is not training a foundation model. It is the design of a multi-signal verification workflow, trust engine, review policy, and payout decision layer.
- Squad API Integration: Squad is the execution layer for verified payouts, not an afterthought.
- Problem Relevance: fake beneficiaries and weak payout verification are real operational problems for scholarships, stipends, and grants.
- Solution Design and Scalability: one reusable engine can expand across multiple payout-heavy sectors.
- Presentation and Demo: the demo is simple and visual. Good beneficiaries get paid. flagged beneficiaries get held.
- Impact Potential: the same system can reduce fraud across many institutional payout programs.

## Why We Are Using Existing AI APIs

This hackathon does not require us to build computer vision or liveness systems from scratch.

Using strong external AI providers is valid, just like using Squad is valid.

Our technical contribution is the product and system design around those services:

- choosing the right verification sequence
- combining signals into a trust decision
- defining approval, hold, and review logic
- handling edge cases and false positives
- securing keys and webhooks
- making Squad payout execution auditable and safe

That is the real engineering work.

## Proposed MVP

This MVP is intentionally demo-first.

It should look sharp, tell one clear story, and prove the trust-before-payout concept without drowning the judges in infrastructure detail.

### Admin Side

- Create payout batch
- View beneficiaries and verification status
- Review flagged beneficiaries
- Release approved payouts
- Track transfer results and audit logs

### Beneficiary Side

- Submit onboarding details
- Upload student ID or program proof
- Capture selfie for liveness and face comparison
- Add bank account details
- View verification and payout status

### Verification Output

- Trust score
- Decision status
- Reason codes
- Manual review notes

## Squad APIs We Can Reliably Use

These are the most credible Squad features for the MVP based on the docs in this workspace:

- `payout/account/lookup`
- `payout/transfer`
- `payout/requery`
- `merchant/balance`

Useful but not necessary for MVP:

- Dynamic virtual accounts for collection and test simulation
- Webhook recovery for missed virtual-account events
- VAS for future restricted-benefit payouts such as airtime, data, or electricity

Not core to the MVP:

- Direct debit mandates
- POS remote request
- Aggregator flows

## Recommended Stack

Your preferred stack is good enough for this project.

### Frontend

- React
- TypeScript
- Tailwind CSS
- shadcn/ui

This is strong for a clean admin dashboard, beneficiary onboarding flow, and demo polish.

### Backend And Data

- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions

This is enough for the MVP.

Supabase covers:

- authentication
- document and selfie uploads
- audit logs and relational data
- secure server-side API calls to Squad and AI providers
- webhook handling
- real-time UI updates if needed

### Deployment

- Supabase for backend services
- Render for hosting the frontend if you want a simple deploy target

### When Render Becomes Necessary Beyond Frontend Hosting

Render is optional for MVP, but useful if we later need:

- long-running background workers
- heavy Python-based image or video processing
- queue workers outside Edge Function limits
- custom ML services beyond simple external API orchestration

For hackathon speed, a Supabase-first backend is the right default.

## Current Project Structure

This first iteration is intentionally minimal. It exists to make the team structure clear before feature work starts.

- `src/components/layout` contains shared layout primitives such as the app shell.
- `src/pages` contains top-level screens while the app is still small.
- `supabase/functions` is reserved for Edge Functions that will handle Squad and AI orchestration.
- `README.md` and `ARCHITECTURE.md` remain the source of truth for product scope and system direction.
- `PLAN.md` is the source of truth for delivery phases, ownership, and merge discipline.

### First Iteration Goal

- clean root project scaffold
- working React + TypeScript + Vite app
- Tailwind wired in
- minimal placeholder UI for teammates to inspect
- Supabase folder reserved for backend work

## Demo Story

The live demo should be one simple story:

1. Admin creates a scholarship payout batch.
2. Beneficiaries submit verification materials.
3. PROVA evaluates each beneficiary.
4. One or more beneficiaries are flagged.
5. Approved beneficiaries pass Squad account lookup and transfer.
6. The system re-queries payout status and updates the audit trail.

That gives judges a clear end-to-end experience with real intelligence and real payment movement.

The demo should feel premium and believable, but it does not need to prove full production depth.

If we need to choose, we should favor:

- better visuals
- clearer state transitions
- smoother presentation flow
- tighter storytelling

over hidden technical completeness that judges will not see.

## What We Should Avoid

- Trying to serve five industries in one demo
- Claiming Squad does identity verification for us
- Claiming we built custom AI models if we did not
- Overstuffing the MVP with direct debit, VAS, payroll, and NGO logic all at once
- Building a chat app instead of a verification and payout system
- Turning the hackathon build into a production platform roadmap
- Spending demo time on backend depth that is invisible to judges

## Success Standard

We are on track if the finished demo can clearly answer these questions:

- Who is the target user?
- What fraud problem are we solving?
- What exactly does the AI decide?
- Where exactly does Squad fit?
- What happens when verification fails?
- Why can this scale beyond scholarships?

If we can answer those clearly, the concept is aligned with the guide and strong enough to compete.
