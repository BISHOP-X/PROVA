import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { BeneficiaryShell } from '@/components/layout/beneficiary-shell'
import { HomePage } from '@/pages/home-page'
import { BeneficiariesPage } from '@/pages/beneficiaries-page'
import { VerificationHubPage } from '@/pages/verification-hub-page'
import { DisbursementsPage } from '@/pages/disbursements-page'
import { AuditLogsPage } from '@/pages/audit-logs-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { StatusTrackerPage } from '@/pages/status-tracker-page'

function App() {
  return (
    <Routes>
      {/* Institutional Admin Suite */}
      <Route path="/" element={<AppShell><HomePage /></AppShell>} />
      <Route path="/beneficiaries" element={<AppShell><BeneficiariesPage /></AppShell>} />
      <Route path="/verification-hub" element={<AppShell><VerificationHubPage /></AppShell>} />
      <Route path="/disbursements" element={<AppShell><DisbursementsPage /></AppShell>} />
      <Route path="/audit-logs" element={<AppShell><AuditLogsPage /></AppShell>} />

      {/* Beneficiary Portal */}
      <Route path="/onboarding" element={<BeneficiaryShell><OnboardingPage /></BeneficiaryShell>} />
      <Route path="/status" element={<BeneficiaryShell><StatusTrackerPage /></BeneficiaryShell>} />
    </Routes>
  )
}

export default App
