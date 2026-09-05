import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public & Landing
import { LandingPage } from './pages/LandingPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { EmailLinkSentPage } from './pages/auth/EmailLinkSentPage';
import { AuthActionPage } from './pages/auth/AuthActionPage';

// Onboarding
import { OnboardingPage } from './pages/onboarding/OnboardingPage';

// Protected Route Guard
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Dashboard Suite Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { JobsPage } from './pages/dashboard/JobsPage';
import { RecommendedJobsPage } from './pages/dashboard/RecommendedJobsPage';
import { ApplicationsPage } from './pages/dashboard/ApplicationsPage';
import { ResumePage } from './pages/dashboard/ResumePage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { PreferencesPage } from './pages/dashboard/PreferencesPage';
import { AutomationPage } from './pages/dashboard/AutomationPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { BillingPage } from './pages/dashboard/BillingPage';

// Detailed / Specialized Views
import JobDetailPage from './pages/jobs/JobDetailPage';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import ResumeAnalyzePage from './pages/resume/ResumeAnalyzePage';
import AdminPage from './pages/admin/AdminPage';
import PrivacyPage from './pages/settings/PrivacyPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* Authentication Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="/auth/email-link-sent" element={<EmailLinkSentPage />} />
      <Route path="/auth/auth-action" element={<AuthActionPage />} />

      {/* Onboarding Flow (Protected, but allows onboarding to complete) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard Suite */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/recommended"
        element={
          <ProtectedRoute>
            <RecommendedJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/applications/:id"
        element={
          <ProtectedRoute>
            <ApplicationDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/resume"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/resume/analyze"
        element={
          <ProtectedRoute>
            <ResumeAnalyzePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/preferences"
        element={
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/automation"
        element={
          <ProtectedRoute>
            <AutomationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/privacy"
        element={
          <ProtectedRoute>
            <PrivacyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/billing"
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        }
      />

      {/* Convenience Direct Aliases */}
      <Route path="/jobs" element={<Navigate to="/dashboard/jobs" replace />} />
      <Route path="/jobs/:id" element={<Navigate to="/dashboard/jobs/:id" replace />} />
      <Route path="/applications" element={<Navigate to="/dashboard/applications" replace />} />
      <Route path="/applications/:id" element={<Navigate to="/dashboard/applications/:id" replace />} />
      <Route path="/resume" element={<Navigate to="/dashboard/resume" replace />} />
      <Route path="/resume/analyze" element={<Navigate to="/dashboard/resume/analyze" replace />} />
      <Route path="/automation" element={<Navigate to="/dashboard/automation" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      <Route path="/privacy" element={<Navigate to="/dashboard/privacy" replace />} />
      <Route path="/settings/privacy" element={<Navigate to="/dashboard/privacy" replace />} />
      <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="/billing" element={<Navigate to="/dashboard/billing" replace />} />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
