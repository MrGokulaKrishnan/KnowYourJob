import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useAuth } from '../../hooks/useAuth';
import { forgotPasswordSchema } from '../../utils/validation';

export const ForgotPasswordPage: React.FC = () => {
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message);
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setIsSent(true);
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We will send you a secure link to reset your credentials."
    >
      {isSent ? (
        <div className="flex flex-col items-center text-center gap-4 py-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Password reset email sent</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Check your inbox at <span className="text-amber-300 font-medium">{email}</span> for instructions.
            </p>
          </div>
          <Link to="/auth/login" className="w-full mt-2">
            <LiquidButton variant="yellow" className="w-full">
              Back to Sign In
            </LiquidButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          >
            Send Password Reset Link
          </LiquidButton>

          <div className="text-center mt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
