import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useAuth } from '../../hooks/useAuth';
import { emailLinkSchema } from '../../utils/validation';

export const EmailLinkSentPage: React.FC = () => {
  const { sendEmailLink } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    const result = emailLinkSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message);
      return;
    }

    setIsLoading(true);
    try {
      await sendEmailLink(email);
      setIsSent(true);
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Passwordless Sign-In"
      subtitle="Enter your email to receive a secure password-free authentication link."
    >
      {isSent ? (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Check your email</h3>
            <p className="text-xs text-slate-300 mt-1">
              We sent a secure sign-in link to:
            </p>
            <p className="text-sm font-semibold text-amber-300 mt-0.5">{email}</p>
            <p className="text-xs text-slate-400 mt-2">
              Click the link in your email to authenticate and continue to your dashboard.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 mt-2">
            <button
              onClick={() => setIsSent(false)}
              className="text-xs text-amber-400 hover:text-amber-300 transition py-1"
            >
              Use another email address
            </button>
            <Link to="/auth/login" className="w-full">
              <LiquidButton variant="glass" className="w-full">
                Back to Sign In
              </LiquidButton>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendLink} className="flex flex-col gap-4">
          <GlassInput
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            disabled={isLoading}
          />

          <LiquidButton
            type="submit"
            variant="yellow"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send Sign-In Link
          </LiquidButton>

          <div className="text-center mt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Password Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
