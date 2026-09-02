import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireEmailVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboarding = true,
  requireEmailVerification = false,
}) => {
  const { user, userDoc, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Auth state loading guard: zero flicker
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090e]">
        <div className="liquid-glass-elevated p-8 rounded-2xl">
          <LoadingSpinner label="Securing authentication session..." />
        </div>
      </div>
    );
  }

  // 2. Unauthenticated check: preserve destination
  if (!isAuthenticated || !user) {
    const target = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?redirect=${target}`} replace />;
  }

  // 3. Email verification guard (if strictly requested and using password auth)
  if (
    requireEmailVerification &&
    !user.emailVerified &&
    user.providerData.some((p) => p.providerId === 'password')
  ) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // 4. Onboarding guard: if not completed, steer to onboarding
  if (requireOnboarding && userDoc && userDoc.onboardingCompleted === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
