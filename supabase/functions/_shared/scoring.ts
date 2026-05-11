export type VerificationDecision = 'approved' | 'review' | 'rejected'

export interface VerificationRule {
  rule_key: string
  threshold_value: number | null
  decision_on_fail: VerificationDecision
  is_active: boolean
}

export interface VerificationScoreInput {
  fullName: string
  studentIdentifier: string
  bankCode: string
  accountNumber: string
  hasSelfie: boolean
  hasDocument: boolean
  duplicateAccountCount: number
}

export interface VerificationScoreResult {
  livenessScore: number
  faceMatchScore: number
  documentScore: number
  riskScore: number
  decision: VerificationDecision
  reasonCodes: string[]
  rawProviderSummary: Record<string, unknown>
}

const decisionSeverity: Record<VerificationDecision, number> = {
  approved: 0,
  review: 1,
  rejected: 2,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function roundScore(value: number) {
  return Number(value.toFixed(2))
}

function hashValue(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function escalateDecision(current: VerificationDecision, next: VerificationDecision) {
  return decisionSeverity[next] > decisionSeverity[current] ? next : current
}

function thresholdMap(rules: VerificationRule[]) {
  const defaults = {
    max_risk_score: { threshold: 30, decision: 'rejected' as VerificationDecision },
    min_face_match_score: { threshold: 75, decision: 'review' as VerificationDecision },
    min_liveness_score: { threshold: 70, decision: 'review' as VerificationDecision },
  }

  for (const rule of rules) {
    if (!rule.is_active || rule.threshold_value === null) {
      continue
    }

    defaults[rule.rule_key as keyof typeof defaults] = {
      threshold: Number(rule.threshold_value),
      decision: rule.decision_on_fail,
    }
  }

  return defaults
}

export function computeVerificationScores(
  input: VerificationScoreInput,
  rules: VerificationRule[],
): VerificationScoreResult {
  const thresholds = thresholdMap(rules)
  const fingerprint = [
    input.fullName.trim().toLowerCase(),
    input.studentIdentifier.trim().toLowerCase(),
    input.bankCode.trim().toLowerCase(),
    input.accountNumber.trim(),
  ].join('|')

  const livenessSeed = hashValue(`${fingerprint}|liveness`)
  const faceSeed = hashValue(`${fingerprint}|face`)
  const documentSeed = hashValue(`${fingerprint}|document`)
  const riskSeed = hashValue(`${fingerprint}|risk`)
  const reasonCodes = new Set<string>()

  let livenessScore = 76 + (livenessSeed % 18)
  let faceMatchScore = 78 + (faceSeed % 17)
  let documentScore = 74 + (documentSeed % 16)
  let riskScore = 12 + (riskSeed % 10)

  if (!input.hasSelfie) {
    livenessScore -= 6
    riskScore += 6
    reasonCodes.add('missing_selfie_capture')
  }

  if (!input.hasDocument) {
    documentScore -= 4
    riskScore += 4
    reasonCodes.add('missing_supporting_document')
  }

  if (input.duplicateAccountCount > 1) {
    riskScore += 24
    faceMatchScore -= 3
    reasonCodes.add('shared_account_number_detected')
  }

  if (input.studentIdentifier.trim().length < 6) {
    documentScore -= 8
    riskScore += 10
    reasonCodes.add('short_reference_identifier')
  }

  livenessScore = clamp(livenessScore, 0, 100)
  faceMatchScore = clamp(faceMatchScore, 0, 100)
  documentScore = clamp(documentScore, 0, 100)
  riskScore = clamp(riskScore, 0, 100)

  let decision: VerificationDecision = 'approved'

  if (livenessScore < thresholds.min_liveness_score.threshold) {
    decision = escalateDecision(decision, thresholds.min_liveness_score.decision)
    reasonCodes.add('low_liveness_score')
  }

  if (faceMatchScore < thresholds.min_face_match_score.threshold) {
    decision = escalateDecision(decision, thresholds.min_face_match_score.decision)
    reasonCodes.add('low_face_match_score')
  }

  if (riskScore > thresholds.max_risk_score.threshold) {
    decision = escalateDecision(decision, thresholds.max_risk_score.decision)
    reasonCodes.add('high_risk_score')
  }

  return {
    livenessScore: roundScore(livenessScore),
    faceMatchScore: roundScore(faceMatchScore),
    documentScore: roundScore(documentScore),
    riskScore: roundScore(riskScore),
    decision,
    reasonCodes: Array.from(reasonCodes),
    rawProviderSummary: {
      duplicateAccountCount: input.duplicateAccountCount,
      engine: 'prova-demo-risk-engine-v1',
      generatedAt: new Date().toISOString(),
      thresholds,
    },
  }
}