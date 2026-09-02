import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, RotateCw, LogOut } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, sendEmailVerification, reloadUser, signOut } = useAuth();
  const { showToast } = useToast();

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      await sendEmailVerification();
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      await reloadUser();
      if (user?.emailVerified) {
        showToast('Email verified successfully! Welcome to KnowYourJob.', 'success');
        navigate('/onboarding', { replace: true });
      } else {
        showToast('Your email is not verified yet. Please check your inbox and click the verification link.', 'warning');
      }
    } catch (err) {
      showToast('Could not refresh status. Please try again.', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login', { replace: true });
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a verification link to your registered inbox."
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Mail className="w-7 h-7" />
        </div>

        <div>
          <p className="text-sm text-slate-300">
            A confirmation link was dispatched to:
          </p>
          <p className="text-base font-semibold text-amber-300 mt-0.5">
            {user?.email || 'your email'}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Please verify your email before continuing to your personalized dashboard.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-3">
          <LiquidButton
            type="button"
            variant="yellow"
            onClick={handleCheckVerification}
            isLoading={isChecking}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="w-full"
          >
            I've Verified My Email
          </LiquidButton>

          <LiquidButton
            type="button"
            variant="glass"
            onClick={handleResend}
            disabled={cooldown > 0}
            isLoading={isResending}
            leftIcon={<RotateCw className="w-4 h-4" />}
            className="w-full"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </LiquidButton>
        </div>

        <div className="pt-3 border-t border-white/5 w-full flex justify-center">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out / Use different account</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
