import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bug,
  AlertTriangle,
  Mail,
  Copy,
  CheckCircle2,
  Send,
  MessageSquareWarning,
  MonitorSmartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEVELOPER_EMAIL = 'gokulakrishnan.k.cseacet@gmail.com';

export const ReportBugModal: React.FC<ReportBugModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [category, setCategory] = useState('UI/UX Defect');
  const [priority, setPriority] = useState('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');

  const [telemetry, setTelemetry] = useState({
    url: '',
    userAgent: '',
    os: '',
    browser: '',
    screen: '',
    pixelRatio: 1,
    timestamp: ''
  });

  useEffect(() => {
    if (isOpen) {
      setTelemetry({
        url: window.location.href,
        userAgent: navigator.userAgent,
        os: navigator.platform || 'Unknown OS',
        browser: getBrowserName(navigator.userAgent),
        screen: `${window.innerWidth}x${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio || 1,
        timestamp: new Date().toISOString()
      });
    }
  }, [isOpen]);

  const getBrowserName = (ua: string) => {
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Trident')) return 'Internet Explorer';
    if (ua.includes('Edge') || ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  };

  const constructEmailBody = () => {
    return `
--- BUG REPORT / SUPPORT REQUEST ---

[USER INFORMATION]
Name: ${user?.displayName || 'Not Provided'}
Email: ${user?.email || 'Not Provided'}

[ISSUE DETAILS]
Category: ${category}
Priority: ${priority}
Title: ${title}

Description:
${description || 'No description provided.'}

Steps to Reproduce:
${steps || 'N/A'}

Expected Behavior:
${expected || 'N/A'}

Actual Behavior:
${actual || 'N/A'}

[TECHNICAL TELEMETRY (Auto-Collected)]
URL: ${telemetry.url}
Browser: ${telemetry.browser}
OS: ${telemetry.os}
Screen Resolution: ${telemetry.screen}
Device Pixel Ratio: ${telemetry.pixelRatio}
User Agent: ${telemetry.userAgent}
Timestamp: ${telemetry.timestamp}

------------------------------------
Please do not edit the telemetry section above as it helps the developer diagnose the issue quickly.
    `.trim();
  };

  const handleSendEmail = () => {
    if (!title.trim() || !description.trim()) {
      showToast('Please provide at least a Title and Description.', 'error');
      return;
    }

    const subject = encodeURIComponent(`[${category}] ${title} - ${priority} Priority`);
    const body = encodeURIComponent(constructEmailBody());
    const mailtoUrl = `mailto:${DEVELOPER_EMAIL}?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
      showToast('Opening your default email client...', 'success');
      onClose();
    } catch (err) {
      showToast('Failed to open email client. Try copying the email instead.', 'error');
    }
  };

  const handleCopyEmail = async () => {
    if (!title.trim() || !description.trim()) {
      showToast('Please provide at least a Title and Description.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(constructEmailBody());
      showToast('Bug report copied to clipboard. You can now paste it into an email to ' + DEVELOPER_EMAIL, 'success');
    } catch (err) {
      showToast('Failed to copy to clipboard.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto liquid-glass-elevated rounded-2xl border border-rose-500/30 p-6 sm:p-8 bg-[#08080a] shadow-2xl z-10 text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[inset_0_1px_0_rgba(244,63,94,0.2)]">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Report a Bug / Issue
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Direct to Developer
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Your telemetry data is auto-collected to help us fix the issue faster.</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Form */}
              <div className="md:col-span-2 space-y-4 text-sm">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-rose-400 transition"
                    >
                      <option value="UI/UX Defect">UI/UX Defect</option>
                      <option value="Functional Error">Functional Error</option>
                      <option value="Performance Issue">Performance Issue</option>
                      <option value="Security Vulnerability">Security Vulnerability</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-rose-400 transition"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Issue Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly summarize the issue (e.g., 'Submit button unresponsive on mobile')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a detailed description of what happened..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Steps to Reproduce (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="1. Go to page X...&#10;2. Click on Y...&#10;3. Observe Z..."
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs transition font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expected Behavior</label>
                    <textarea
                      rows={2}
                      placeholder="What should have happened?"
                      value={expected}
                      onChange={(e) => setExpected(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Actual Behavior</label>
                    <textarea
                      rows={2}
                      placeholder="What actually happened?"
                      value={actual}
                      onChange={(e) => setActual(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs transition"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Telemetry & Info */}
              <div className="space-y-4">
                <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/20 p-4">
                  <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-2 mb-3">
                    <MonitorSmartphone className="w-4 h-4" />
                    Auto-Collected Telemetry
                  </h3>
                  <div className="space-y-2 text-[10px] font-mono text-slate-400">
                    <p className="flex flex-col gap-0.5">
                      <span className="text-indigo-400 font-semibold">URL</span>
                      <span className="truncate" title={telemetry.url}>{telemetry.url}</span>
                    </p>
                    <p className="flex flex-col gap-0.5">
                      <span className="text-indigo-400 font-semibold">Browser / OS</span>
                      <span>{telemetry.browser} on {telemetry.os}</span>
                    </p>
                    <p className="flex flex-col gap-0.5">
                      <span className="text-indigo-400 font-semibold">Screen</span>
                      <span>{telemetry.screen} @ {telemetry.pixelRatio}x DPR</span>
                    </p>
                    <p className="flex flex-col gap-0.5">
                      <span className="text-indigo-400 font-semibold">Timestamp</span>
                      <span>{new Date(telemetry.timestamp).toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-500/20 text-[10px] text-indigo-300/80">
                    <AlertTriangle className="w-3 h-3 inline mr-1 mb-0.5" />
                    This data helps the developer reproduce device-specific bugs.
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <h3 className="text-xs font-bold text-slate-300 mb-2">How this works</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This form uses your device's default email client (e.g., Mail, Outlook, Gmail) to send the report directly to the developer at <strong className="text-white">{DEVELOPER_EMAIL}</strong>. No third-party servers handle your submission.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 transition"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard (Fallback)
              </button>
              <button
                onClick={handleSendEmail}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Open Email Client
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
