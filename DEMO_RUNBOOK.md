# PROVA Demo Runbook

## Guide Alignment

This demo is aligned to the local hackathon guide:

- The product shows a working end-to-end prototype, not a slide-only concept.
- Squad is used as a core workflow dependency, not a decorative add-on.
- The AI layer produces an interpretable decision with reason codes and risk scoring.
- The demo stays within the scholarship disbursement use case so the story is clear in five minutes.

## Demo Cohort

These are the recommended records to use during the final presentation.

### Ready For Release

- Name: `Chiamaka Nwosu`
- Application ID: `d1dd43e0-5b7e-437d-aaae-93c34cdaee50`
- Program: `PROVA Final Demo Cohort`
- Organization: `Squad Hackathon Demo Institution`
- Status: `approved`
- Amount shown in disbursement queue: `NGN 257,500`
- Why it matters:
  - uses the live sandbox payout rail
  - account name resolved to `IKESINACHI ELVIS EZEPUE`
  - can be used as the fresh live release candidate during the demo

### Manual Review Case

- Name: `Samuel Adeyemi`
- Application ID: `c75567ec-db29-4603-8f53-921e43e0a4c9`
- Status: `review`
- Reasoning:
  - missing supporting document
  - unresolved account lookup
  - manually escalated with reviewer note

### Rejected Case

- Name: `Tolu Fakecase`
- Application ID: `d01d8430-6480-4682-b620-d9a6e9944fd0`
- Status: `rejected`
- Reasoning:
  - missing selfie
  - missing document
  - short reference identifier
  - high risk score

### Existing Successful Live Payouts

Use these in the payout history section to prove live Squad execution:

- `c0015d51-0760-4305-a71e-a0c786866802`
- `4866440c-cd71-462a-8f02-ee886267933d`
- `44cda746-4e1c-4384-9d93-f81e6f8435b7`

## Recommended Demo Click Path

1. Start with the intro deck and problem framing.
2. Go to the admin dashboard and explain the trust-before-payout concept.
3. Open the verification queue:
   - show `Samuel Adeyemi` as the review case
   - show `Tolu Fakecase` as the rejected case
   - explain the reason codes and manual review notes
4. Open the disbursements page:
   - point to `Chiamaka Nwosu` as the approved record ready for release
   - point to the live Squad balance card
5. Release the approved beneficiary.
6. Refresh or revisit payout activity to show the Squad status update.
7. Open audit logs or status tracker to show that the event trail was written.

## AI Layer: Truthful Positioning

Use this wording during the presentation:

- PROVA does not claim to have trained a custom foundation model.
- The intelligence layer is the verification and decision engine.
- It combines verification signals, data quality checks, duplicate-account risk, and review policy into one interpretable outcome:
  - `approved`
  - `review`
  - `rejected`
- The current MVP uses a controlled trust engine for demo safety and clear state transitions.
- The architecture is provider-ready for external verification APIs such as liveness, OCR, face comparison, and document checks through Supabase Edge Functions.

## What We Should Not Claim

- Do not say the current demo uses live computer-vision verification if it does not.
- Do not say Squad performs the AI verification.
- Do not say the system is production-ready.

## Q&A Position On AI Providers

If asked whether an external AI API is already plugged in:

- The architecture supports external AI providers server-side.
- For the hackathon MVP, the trust engine and decision policy are the main technical contribution.
- A live external provider would strengthen the system later, but the current prototype already demonstrates meaningful intelligence, interpretable outputs, and end-to-end workflow control.

## Final Reminder

The guide rewards:

- real intelligence
- meaningful Squad integration
- a stable demo
- clear explanation

It does not reward pretending the system is more production-complete than it is.
