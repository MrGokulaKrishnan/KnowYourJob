import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Trash2, 
  KeyRound, 
  AlertTriangle,
  User,
  CheckCircle2,
  X,
  Plug,
  Layers,
  Bug
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { UserAvatar, isGoogleUser, GoogleIcon } from '../../components/ui/UserAvatar';
import { ReportBugModal } from '../../components/support/ReportBugModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { deleteUserData } from '../../services/firebase/userService';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userDoc, deleteAccount, sendPasswordReset } = useAuth();
  const { showToast } = useToast();
  const isGoogle = isGoogleUser(user, userDoc);

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isPasswordProvider = user?.providerData.some((p) => p.providerId === 'password');

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordReset(user.email);
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // 1. Clean up user Firestore docs
      await deleteUserData(user.uid);
      // 2. Delete Firebase Auth user
      await deleteAccount(deletePassword || undefined);
      navigate('/auth/login', { replace: true });
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Account & Security"
      pageSubtitle="Manage identity, authentication security, credentials, and data residency."
    >
      <div className="flex flex-col gap-6 max-w-3xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass border border-white/5 w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_15px_rgba(255,208,0,0.1)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_15px_rgba(255,208,0,0.1)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security & Data</span>
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6">
            {/* Account Profile Header with Google Avatar in Square Rounded Corners */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
              <UserAvatar
                user={user}
                userDoc={userDoc}
                size="2xl"
                showGoogleBadge={true}
                border={true}
                className="shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight truncate">
                    {userDoc?.displayName || user?.displayName || 'User Profile'}
                  </h3>

                  {isGoogle ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-white/[0.06] border border-white/12 text-xs font-semibold text-white">
                      <GoogleIcon size={13} />
                      <span>Google Account</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-300">
                      <span>Standard Account</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 truncate">
                  {user?.email || 'No email registered'}
                </p>

                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                  {isGoogle ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Google account profile picture synced in square rounded corners.</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>Account avatar displayed in square rounded corners.</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>Account Profile</span>
              </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
              <span className="text-white font-medium">{user?.email || 'N/A'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 uppercase tracking-wider block mb-1">Auth Provider</span>
              <span className="text-amber-400 font-mono font-medium uppercase">
                {userDoc?.provider || user?.providerData[0]?.providerId || 'Unknown'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 uppercase tracking-wider block mb-1">Email Verification</span>
              <div className="flex items-center gap-1.5 font-medium">
                {user?.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Verified</span>
                  </>
                ) : (
                  <span className="text-amber-400">Pending Verification</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-400 uppercase tracking-wider block mb-1">Account Status</span>
              <span className="text-emerald-400 font-mono uppercase">{userDoc?.accountStatus || 'active'}</span>
            </div>
          </div>
        </div>

        {/* Contact Support & Report Bug Card */}
        <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-400" />
            <span>Support & Developer Contact</span>
          </h3>

          <p className="text-xs text-slate-400">
            Encountered a bug, UI defect, or have a feature request? Let us know! Your system diagnostics will be attached to help resolve it quickly.
          </p>

          <div className="flex justify-start">
            <LiquidButton
              variant="danger"
              onClick={() => setIsBugModalOpen(true)}
              className="!bg-rose-500 hover:!bg-rose-400 !text-white !border-rose-400/50"
              leftIcon={<Bug className="w-4 h-4" />}
            >
              Report a Bug
            </LiquidButton>
          </div>
        </div>
      </div>
    )}

    {/* Tab 3: Security & Danger Zone */}
    {activeTab === 'security' && (
      <div className="flex flex-col gap-6">
        {/* Security & Password Reset */}
        <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>Password & Authentication Security</span>
          </h3>

          <p className="text-xs text-slate-400">
            Request a secure password reset link dispatched to your verified email address.
          </p>

          <div className="flex items-center justify-between pt-2">
            <LiquidButton
              variant="glass"
              onClick={handlePasswordReset}
              className="text-xs"
            >
              Send Password Reset Email
            </LiquidButton>
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone: Permanent Account Removal</span>
          </div>

          <p className="text-xs text-slate-400">
            Permanently deletes your candidate profile, tracked applications, resume documents in Firebase Storage, and terminates your Firebase Authentication identity. This action cannot be undone.
          </p>

          <div className="flex justify-start">
            <LiquidButton
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete KnowYourJob Account
            </LiquidButton>
          </div>
        </div>
      </div>
    )}
  </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="liquid-glass-elevated max-w-md w-full rounded-2xl p-6 border border-rose-500/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Confirm Deletion</span>
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete your account? All Firestore data and uploaded files will be completely purged.
            </p>

            {isPasswordProvider && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Confirm Current Password for Reauthentication:</label>
                <GlassInput
                  isPassword
                  placeholder="Your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <LiquidButton variant="glass" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </LiquidButton>
              <LiquidButton
                variant="danger"
                onClick={handleDeleteAccount}
                isLoading={isDeleting}
              >
                Confirm & Permanently Delete
              </LiquidButton>
            </div>
          </div>
        </div>
      )}

      <ReportBugModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
    </DashboardLayout>
  );
};
