import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, confirmPasswordReset, isSignInWithEmailLink } from 'firebase/auth';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase/auth';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getAuthErrorMessage } from '../../utils/authErrorMapper';

export const AuthActionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeEmailLinkSignIn } = useAuth();
  const { showToast } = useToast();

  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  // Execution lock refs to prevent duplicate triggers from re-renders or StrictMode
  const hasExecutedRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Guard against duplicate execution
    if (hasExecutedRef.current || isProcessingRef.current || isDone) {
      return;
    }

    const handleAction = async () => {
      // 0. If user is already authenticated, smoothly forward to dashboard
      if (auth.currentUser) {
        setIsDone(true);
        setIsLoading(false);
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        return;
      }

      // 1. Passwordless Email Link handler
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const storedEmail = window.localStorage.getItem('knowyourjob_email_link_target');
        if (storedEmail) {
          hasExecutedRef.current = true;
          isProcessingRef.current = true;
          try {
            await completeEmailLinkSignIn(storedEmail, window.location.href);
            // Clear URL params to avoid re-triggering on reload
            if (typeof window !== 'undefined' && window.history.replaceState) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            setIsDone(true);
            setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
          } catch (err: any) {
            // If the user ended up signed in despite a race error, treat as success
            if (auth.currentUser) {
              if (typeof window !== 'undefined' && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
              }
              setIsDone(true);
              setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
              return;
            }
            console.error('Passwordless sign-in error:', err);
            setErrorMessage(getAuthErrorMessage(err));
          } finally {
            isProcessingRef.current = false;
            setIsLoading(false);
          }
        } else {
          // Require user to confirm their email
          setNeedsEmailConfirm(true);
          setIsLoading(false);
        }
        return;
      }

      // 2. Email verification code
      if (mode === 'verifyEmail' && actionCode) {
        hasExecutedRef.current = true;
        isProcessingRef.current = true;
        try {
          await applyActionCode(auth, actionCode);
          showToast('Email verified successfully!', 'success');
          setIsDone(true);
          setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
        } catch (err: any) {
          if (auth.currentUser?.emailVerified) {
            setIsDone(true);
            setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
            return;
          }
          setErrorMessage(getAuthErrorMessage(err));
        } finally {
          isProcessingRef.current = false;
          setIsLoading(false);
        }
        return;
      }

      // 3. Password reset code
      if (mode === 'resetPassword' && actionCode) {
        setIsLoading(false);
        return;
      }

      // If user is already authenticated, don't show invalid link screen
      if (auth.currentUser) {
        setIsDone(true);
        setIsLoading(false);
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        return;
      }

      // Unknown or expired action
      setErrorMessage('Invalid or expired authentication link. Please request a new link.');
      setIsLoading(false);
    };

    handleAction();
  }, [mode, actionCode, completeEmailLinkSignIn, navigate, showToast, isDone]);

  const handleConfirmEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await completeEmailLinkSignIn(email.trim(), window.location.href);
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setIsDone(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
    } catch (err: any) {
      if (auth.currentUser) {
        if (typeof window !== 'undefined' && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setIsDone(true);
        setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
        return;
      }
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      isProcessingRef.current = false;
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCode || !newPassword || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      showToast('Your password has been successfully updated!', 'success');
      setIsDone(true);
      setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
    } catch (err) {
      setErrorMessage(getAuthErrorMessage(err));
    } finally {
      isProcessingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Authentication Security"
      subtitle="Verifying and confirming your secure access link."
    >
      {isLoading ? (
        <LoadingSpinner label="Securing session with Firebase..." />
      ) : errorMessage ? (
        <div className="flex flex-col items-center text-center gap-4 py-3">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Verification Issue</h3>
            <p className="text-xs text-rose-300 mt-1 max-w-xs">{errorMessage}</p>
          </div>
          <LiquidButton
            variant="yellow"
            onClick={() => navigate('/auth/login')}
            className="w-full mt-2"
          >
            Back to Sign In
          </LiquidButton>
        </div>
      ) : isDone ? (
        <div className="flex flex-col items-center text-center gap-4 py-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Success!</h3>
            <p className="text-xs text-slate-300 mt-1">
              Your authentication was confirmed. Redirecting...
            </p>
          </div>
        </div>
      ) : needsEmailConfirm ? (
        <form onSubmit={handleConfirmEmailLink} className="flex flex-col gap-4">
          <p className="text-xs text-slate-300">
            Please re-enter your email to confirm this sign-in link:
          </p>
          <GlassInput
            label="Confirmation Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />
          <LiquidButton type="submit" variant="yellow" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Confirm & Complete Sign-In
          </LiquidButton>
        </form>
      ) : mode === 'resetPassword' ? (
        <form onSubmit={handlePasswordResetSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-slate-300">
            Enter your new password below:
          </p>
          <GlassInput
            label="New Password"
            isPassword
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <LiquidButton type="submit" variant="yellow" className="w-full">
            Save New Password
          </LiquidButton>
        </form>
      ) : null}
    </AuthLayout>
  );
};
