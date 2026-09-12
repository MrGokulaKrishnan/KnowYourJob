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
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { SessionExpiredPage } from './pages/auth/SessionExpiredPage';

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

// SEO & Category Exploration
import SeoJobCategoryPage from './pages/jobs/SeoJobCategoryPage';

// Legal & Compliance Suite
import LegalPage from './pages/legal/LegalPage';

// Customer Support & Lifecycle
import SupportPage from './pages/support/SupportPage';
import PaymentStatusPage from './pages/billing/PaymentStatusPage';

// Error & UX Lifecycle States
import NotFoundPage from './pages/errors/NotFoundPage';
import ForbiddenPage from './pages/errors/ForbiddenPage';
import ServerErrorPage from './pages/errors/ServerErrorPage';
import MaintenancePage from './pages/errors/MaintenancePage';

// Global Banners
import { OfflineBanner } from './components/ui/OfflineBanner';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';

export const App: React.FC = () => {
  return (
    <>
      <OfflineBanner />
      <CookieConsentBanner />
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        {/* Public Job Discovery & Search (Indexable & Crawlable) */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Dynamic SEO AI Job Category Pages */}
        <Route path="/jobs/category/:category" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/ai" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/artificial-intelligence" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/machine-learning" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/generative-ai" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/llm" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/nlp" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/computer-vision" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/mlops" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/prompt-engineer" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/remote-ai" element={<SeoJobCategoryPage />} />
        <Route path="/jobs/india-ai" element={<SeoJobCategoryPage />} />

        {/* Authentication Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/email-link-sent" element={<EmailLinkSentPage />} />
        <Route path="/auth/auth-action" element={<AuthActionPage />} />
        <Route path="/auth/session-expired" element={<SessionExpiredPage />} />

        {/* Onboarding Flow */}
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

        {/* Legal & Compliance Pages */}
        <Route path="/legal/:doc" element={<LegalPage />} />
        <Route path="/privacy" element={<LegalPage defaultDoc="privacy" />} />
        <Route path="/terms" element={<LegalPage defaultDoc="terms" />} />
        <Route path="/cookies" element={<LegalPage defaultDoc="cookies" />} />
        <Route path="/refund-policy" element={<LegalPage defaultDoc="refund-policy" />} />
        <Route path="/cancellation-policy" element={<LegalPage defaultDoc="cancellation-policy" />} />
        <Route path="/disclaimer" element={<LegalPage defaultDoc="disclaimer" />} />
        <Route path="/accessibility" element={<LegalPage defaultDoc="accessibility" />} />
        <Route path="/dpa" element={<LegalPage defaultDoc="dpa" />} />
        <Route path="/acceptable-use" element={<LegalPage defaultDoc="acceptable-use" />} />
        <Route path="/security-policy" element={<LegalPage defaultDoc="security-policy" />} />
        <Route path="/responsible-disclosure" element={<LegalPage defaultDoc="responsible-disclosure" />} />
        <Route path="/community-guidelines" element={<LegalPage defaultDoc="community-guidelines" />} />

        {/* Support & Customer Lifecycle */}
        <Route path="/support" element={<SupportPage />} />
        <Route path="/help" element={<SupportPage />} />
        <Route path="/billing/success" element={<PaymentStatusPage />} />
        <Route path="/billing/failed" element={<PaymentStatusPage />} />
        <Route path="/billing/pending" element={<PaymentStatusPage />} />

        {/* UX & Error States */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* Direct Aliases */}
        <Route path="/applications" element={<Navigate to="/dashboard/applications" replace />} />
        <Route path="/applications/:id" element={<Navigate to="/dashboard/applications/:id" replace />} />
        <Route path="/resume" element={<Navigate to="/dashboard/resume" replace />} />
        <Route path="/resume/analyze" element={<Navigate to="/dashboard/resume/analyze" replace />} />
        <Route path="/automation" element={<Navigate to="/dashboard/automation" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/settings/privacy" element={<Navigate to="/dashboard/privacy" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="/billing" element={<Navigate to="/dashboard/billing" replace />} />

        {/* Catch-all 404 Route (Compliant with Section 8 & 9) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
