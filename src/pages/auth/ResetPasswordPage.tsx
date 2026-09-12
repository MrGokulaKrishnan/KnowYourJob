import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { KYJLogo } from '@/components/ui/KYJLogo';
import { useToast } from '@/context/ToastContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const oobCode = searchParams.get('oobCode') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!oobCode) {
      setIsVerifying(false);
      setError('Missing or invalid password reset authorization code. Please request a new link.');
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((userEmail) => {
        setEmail(userEmail);
        setIsVerifying(false);
      })
      .catch((err) => {
        setIsVerifying(false);
        setError(err.message || 'This password reset link has expired or has already been used.');
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccess(true);
      showToast('Your password has been reset successfully!', 'success', 'Password Updated');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please request a new link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-4 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <KYJLogo size={36} glow />
            <span className="text-xl font-bold text-white">KnowYourJob</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          {email && <p className="text-xs text-slate-400 mt-1">For account: {email}</p>}
        </div>

        <div className="liquid-glass-elevated p-8 rounded-2xl border border-white/10 shadow-2xl">
          {isVerifying ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Verifying reset token...
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 size={44} className="text-emerald-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-white">Password Updated!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your password has been changed. Redirecting to login...
              </p>
              <Link
                to="/auth/login"
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition"
              >
                Sign In Now <ArrowRight size={14} />
              </Link>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle size={44} className="text-rose-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-white">Reset Link Invalid</h2>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
              <Link
                to="/auth/forgot-password"
                className="mt-6 inline-block px-4 py-2 bg-white/10 hover:bg-white/15 text-xs text-white rounded-xl transition"
              >
                Request a New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">New Password (min 8 chars)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
