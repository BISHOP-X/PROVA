# PROVA One-Page Summary

## Product Name

PROVA

## What Problem Are We Solving?

Institutions often release money before they are fully sure who should receive it.

In scholarship, stipend, and grant programs, this creates real risk:

- fake beneficiaries
- duplicate identities
- incomplete verification
- wrong bank details
- weak audit trails after payout

The result is financial leakage for the institution and unfair delays for the real beneficiary.

## Our Solution

PROVA is a verified disbursement system.

It verifies the beneficiary before payout is approved.

Instead of paying first and auditing later, PROVA adds a trust layer before money moves.

The system:

1. collects beneficiary identity and bank details
2. checks verification signals and payout risk
3. produces a clear decision:
   - approved
   - review
   - rejected
4. allows only approved cases to move to payout
5. records every review and payout event in an audit trail

## Target Users

- universities
- scholarship boards
- training programs
- NGOs
- institutions running multi-beneficiary disbursement programs

## Why It Matters

PROVA reduces fraud risk and improves trust in institutional payouts.

It helps teams answer one important question before money moves:

`Is this the right person, and is this payout safe to release?`

## Squad APIs Used

Squad is a core part of the product, not a decorative integration.

We use Squad for the payout rail through:

- `merchant/balance`
- `payout/account/lookup`
- `payout/transfer`
- `payout/requery`

This means PROVA does not stop at verification.
It connects trust decisions directly to payout execution.

## AI / Data Intelligence

PROVA’s intelligence layer is the trust engine.

It combines:

- identity signals
- document presence and verification checks
- liveness and face-match style scoring
- bank and payout risk checks
- manual review rules

The output is explainable, not a black box.

Each case produces:

- a trust decision
- a risk score
- reason codes
- review notes where needed

## Four Pillars Addressed

- **AI Automation:** trust scoring before payout
- **Use of Data:** risk and verification signals combined into one decision
- **Squad APIs:** live payout orchestration through Squad
- **Financial Innovation:** trust-before-payout infrastructure for institutional disbursement

## Live Demo Story

In the demo:

- the intro flow explains the problem and system
- the dashboard shows the live operator view
- the verification hub shows approved, review, and rejected cases
- the disbursement screen shows only approved beneficiaries reaching the payout rail
- the audit flow shows traceability across the full system

## Expansion Potential

Although the first use case is scholarships and stipends, the same system can also support:

- grants
- welfare payouts
- payroll validation
- insurance or claims disbursement
- NGO cash transfer programs

## Closing

PROVA helps institutions verify first, decide clearly, and only then release funds through Squad.
