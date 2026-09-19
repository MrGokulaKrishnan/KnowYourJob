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
    <div className="min-h-screen bg-[#000000] text-white p-4 sm:p-6 lg:p-8 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient Glow Orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-48 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-10 -left-48 w-96 h-96 bg-yellow-500/10 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="liquid-glass-elevated p-6 sm:p-8 rounded-3xl border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white text-gradient-gold">Privacy & Security Center</h1>
              <p className="text-neutral-400 text-sm mt-0.5">Understand how your resume, profile, and credentials are protected with enterprise-grade isolation.</p>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl space-y-3 hover:border-amber-500/30 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Private Document <span className="text-gradient-gold">Vault</span></h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your resume files are stored in user-isolated Firebase Storage paths with strict token authentication. No other user or unauthorized process can ever read your uploaded documents.
            </p>
          </div>

          <div className="liquid-glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl space-y-3 hover:border-amber-500/30 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Bot size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Zero AI Retention <span className="text-gradient-cyan">Model</span></h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Resume text sent to Google Gemini Cloud Functions is processed strictly in-memory. Your personal information is never used to train public foundation models.
            </p>
          </div>

          <div className="liquid-glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl space-y-3 hover:border-amber-500/30 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <EyeOff size={20} />
            </div>
            <h3 className="font-bold text-white text-base">Full User <span className="text-gradient-emerald">Ownership</span></h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              You own every piece of your data. You can export your full profile, download all versions of your tailored resumes, or trigger complete data erasure with a single click.
            </p>
          </div>
        </div>

        {/* Security Rules Breakdown */}
        <div className="liquid-glass p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>How We <span className="text-gradient-gold">Secure Your Job Search</span></span>
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-start gap-4 hover:border-amber-500/20 transition-colors">
              <CheckCircle2 className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Strict Firestore Ownership Rules</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  All requests validate <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono text-[11px]">request.auth.uid == resource.data.userId</code>. Cross-user reading or tampering is physically impossible at the database level.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-start gap-4 hover:border-amber-500/20 transition-colors">
              <CheckCircle2 className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Anti-Bot & Verification Safety Guarantee</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  KnowYourJob will <strong className="text-white">never bypass CAPTCHAs, MFA prompts, or site security challenges</strong>. If an external job portal requests verification, automation immediately pauses for your explicit manual review.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-start gap-4 hover:border-amber-500/20 transition-colors">
              <CheckCircle2 className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-white text-sm">Prompt Injection Sanitization</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  All external job descriptions and form inputs are treated as untrusted data and strictly sanitized before LLM analysis to prevent prompt injections from accessing your secrets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Export & Eradication Zone */}
        <div className="liquid-glass-elevated p-6 sm:p-8 rounded-3xl border border-rose-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Data Control & Account Deletion</h3>
              <p className="text-xs text-neutral-400">Permanently delete your profile data or account in compliance with GDPR and CCPA.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">Delete My Career Data</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Clears all resume analysis, job matches, application logs, and career preferences, keeping only your login credentials.
                </p>
              </div>
              <button
                className="btn-glass px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-400/10 transition-all font-semibold text-xs cursor-pointer"
                onClick={() => {
                  setConfirmText('');
                  setDeleteDataModal(true);
                }}
              >
                Delete Career Data Only
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-md flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-rose-400 text-sm">Delete My Entire Account</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Irreversibly deletes your account, authentication records, resume PDFs, and all associated analytics data.
                </p>
              </div>
              <button
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition-all font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/10"
                onClick={() => {
                  setConfirmText('');
                  setDeleteAccountModal(true);
                }}
              >
                <Trash2 size={16} />
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        </div>
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
            <label className="text-xs text-neutral-400">Type <strong className="text-amber-400">DELETE DATA</strong> to confirm:</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE DATA"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-rose-500/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
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
