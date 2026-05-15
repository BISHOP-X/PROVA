import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { AdminPage } from '@/pages/admin-page'
import { AdminSubmissionsPage } from '@/pages/admin-submissions'
import { BeneficiaryShell } from '@/components/layout/beneficiary-shell'
import { HomePage } from '@/pages/home-page'
import { BeneficiariesPage } from '@/pages/beneficiaries-page'
import { VerificationHubPage } from '@/pages/verification-hub-page'
import { DisbursementsPage } from '@/pages/disbursements-page'
import { AuditLogsPage } from '@/pages/audit-logs-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { StatusTrackerPage } from '@/pages/status-tracker-page'
import { LoginPage } from '@/pages/login-page'
import { SignupPage } from '@/pages/signup-page'
import { LivenessPage } from '@/pages/liveness-page'
import { AuthProvider, ProtectedRoute } from '@/contexts/AuthContext'
import { SubmissionsProvider } from '@/contexts/SubmissionsContext'
import { LoginToast } from '@/components/ui/login-toast'

function App() {
  return (
    <AuthProvider>
      <SubmissionsProvider>
        <LoginToast />
        <Routes>
          {/* Auth Entry */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Institutional Admin Suite (protected) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requireRole="admin"><AppShell><AdminPage /></AppShell></ProtectedRoute>} />
          <Route path="/admin/home" element={<ProtectedRoute requireRole="admin"><AppShell><HomePage /></AppShell></ProtectedRoute>} />
          <Route path="/admin/beneficiaries" element={<ProtectedRoute requireRole="admin"><AppShell><BeneficiariesPage /></AppShell></ProtectedRoute>} />
          <Route path="/admin/disbursements" element={<ProtectedRoute requireRole="admin"><AppShell><DisbursementsPage /></AppShell></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute requireRole="admin"><AppShell><AuditLogsPage /></AppShell></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute requireRole="admin"><AppShell><AdminSubmissionsPage /></AppShell></ProtectedRoute>} />
          <Route path="/verification-hub" element={<ProtectedRoute requireRole="admin"><AppShell><VerificationHubPage /></AppShell></ProtectedRoute>} />

          {/* Beneficiary Portal (protected for beneficiaries) */}
          <Route path="/onboarding" element={<ProtectedRoute requireRole="beneficiary"><BeneficiaryShell><OnboardingPage /></BeneficiaryShell></ProtectedRoute>} />
          <Route path="/onboarding/liveness" element={<ProtectedRoute requireRole="beneficiary"><LivenessPage /></ProtectedRoute>} />
          <Route path="/status" element={<ProtectedRoute requireRole="beneficiary"><BeneficiaryShell><StatusTrackerPage /></BeneficiaryShell></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </SubmissionsProvider>
    </AuthProvider>
  )
}

export default App
