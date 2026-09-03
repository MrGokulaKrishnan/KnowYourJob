import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { getAuthErrorMessage } from '../../utils/authErrorMapper';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validation';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { signInWithEmailPassword, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailPassword(email, password);
      navigate(redirectUrl, { replace: true });
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate(redirectUrl, { replace: true });
    } catch {
      // Handled by AuthContext toast
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Continue your AI-powered career hunt."
    >
      <div className="flex flex-col gap-4">
        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0e131d] px-3 text-slate-400 font-mono tracking-wider">
              Or with email
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <GlassInput
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            disabled={isLoading || isGoogleLoading}
          />

          <div>
            <GlassInput
              label="Password"
              isPassword
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              disabled={isLoading || isGoogleLoading}
            />
            <div className="flex justify-end mt-1.5">
              <Link
                to="/auth/forgot-password"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <LiquidButton
            type="submit"
            variant="yellow"
            isLoading={isLoading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </LiquidButton>
        </form>

        {/* Alternative: Passwordless email link */}
        <div className="mt-2 pt-3 border-t border-white/5 text-center">
          <Link
            to="/auth/email-link-sent"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 transition"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign in with Email Link (Passwordless)</span>
          </Link>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 mt-2">
          Don't have an account?{' '}
          <Link
            to={`/auth/register${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

