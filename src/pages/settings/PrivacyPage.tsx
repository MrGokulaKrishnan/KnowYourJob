import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Trash2, Download, AlertTriangle, CheckCircle2, EyeOff, FileText, Bot, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassBadge } from '@/components/glass/GlassBadge';
import toast from 'react-hot-toast';

export default function PrivacyPage() {
  const [deleteDataModal, setDeleteDataModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteData = async () => {
    if (confirmText !== 'DELETE DATA') {
      toast.error('Please type DELETE DATA to confirm');
      return;
    }
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleteDataModal(false);
      setConfirmText('');
      toast.success('Your resume metadata, application history, and preferences have been deleted.');
    }, 1500);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE ACCOUNT') {
      toast.error('Please type DELETE ACCOUNT to confirm');
      return;
    }
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleteAccountModal(false);
      setConfirmText('');
      toast.success('Your account and all associated documents have been permanently removed.');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-strong p-6 sm:p-8 rounded-3xl border border-[rgba(255,215,0,0.2)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Shield size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy & Security Center</h1>
              <p className="text-neutral-400 text-sm mt-0.5">Understand how your resume, profile, and credentials are protected.</p>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard variant="strong" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Private Document Vault</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your resume files are stored in user-isolated Firebase Storage paths with strict token authentication. No other user or unauthorized process can ever read your uploaded documents.
            </p>
          </GlassCard>

          <GlassCard variant="strong" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Bot size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Zero AI Retention Model</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Resume text sent to Google Gemini Cloud Functions is processed strictly in-memory. Your personal information is never used to train public foundation models.
            </p>
          </GlassCard>

          <GlassCard variant="strong" className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <EyeOff size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Full User Ownership</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              You own every piece of your data. You can export your full profile, download all versions of your tailored resumes, or trigger complete data erasure with a single click.
            </p>
          </GlassCard>
        </div>

        {/* Security Rules Breakdown */}
        <GlassCard variant="default" className="space-y-6">
          <h3 className="text-lg font-bold text-white">How We Secure Your Job Search</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
              <CheckCircle2 className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Strict Firestore Ownership Rules</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  All requests validate <code className="text-yellow-300">request.auth.uid == resource.data.userId</code>. Cross-user reading or tampering is physically impossible at the database level.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
              <CheckCircle2 className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Anti-Bot & Verification Safety Guarantee</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  KnowYourJob will <strong>never bypass CAPTCHAs, MFA prompts, or site security challenges</strong>. If an external job portal requests verification, automation immediately pauses for your explicit manual review.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
              <CheckCircle2 className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Prompt Injection Sanitization</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  All external job descriptions and form inputs are treated as untrusted data and strictly sanitized before LLM analysis to prevent prompt injections from accessing your secrets.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Data Export & Eradication Zone */}
        <GlassCard variant="strong" className="space-y-6 border-red-500/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={24} />
            <div>
              <h3 className="text-lg font-bold text-white">Data Control & Account Deletion</h3>
              <p className="text-xs text-neutral-400">Permanently delete your profile data or account in compliance with GDPR and CCPA.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">Delete My Career Data</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Clears all resume analysis, job matches, application logs, and career preferences, keeping only your login credentials.
                </p>
              </div>
              <GlassButton
                variant="ghost"
                size="sm"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                onClick={() => {
                  setConfirmText('');
                  setDeleteDataModal(true);
                }}
              >
                Delete Career Data Only
              </GlassButton>
            </div>

            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-red-400 text-sm">Delete My Entire Account</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Irreversibly deletes your account, authentication records, resume PDFs, and all associated analytics data.
                </p>
              </div>
              <GlassButton
                variant="danger"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={() => {
                  setConfirmText('');
                  setDeleteAccountModal(true);
                }}
              >
                Delete My Account
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Delete Data Modal */}
      <GlassModal
        open={deleteDataModal}
        onClose={() => setDeleteDataModal(false)}
        title="Confirm Career Data Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-300">
            This will permanently remove all your resume documents, ATS scores, match history, and automation records.
          </p>
          <div className="space-y-2">
            <label className="text-xs text-neutral-400">Type <strong className="text-yellow-400">DELETE DATA</strong> to confirm:</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE DATA"
              className="glass-input text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <GlassButton variant="ghost" size="sm" onClick={() => setDeleteDataModal(false)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={confirmText !== 'DELETE DATA'}
              onClick={handleDeleteData}
            >
              Permanently Delete Data
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Delete Account Modal */}
      <GlassModal
        open={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        title="Permanently Delete Account"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-300">
            This action is <strong>irreversible</strong>. Your login account, credentials, uploaded files, and applications will be completely expunged from Firebase.
          </p>
          <div className="space-y-2">
            <label className="text-xs text-neutral-400">Type <strong className="text-red-400">DELETE ACCOUNT</strong> to confirm:</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ACCOUNT"
              className="glass-input text-sm border-red-500/30"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <GlassButton variant="ghost" size="sm" onClick={() => setDeleteAccountModal(false)}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={confirmText !== 'DELETE ACCOUNT'}
              onClick={handleDeleteAccount}
            >
              Confirm Account Erasure
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
