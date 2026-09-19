import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  Mail, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Send,
  Bug
} from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';
import { useToast } from '@/context/ToastContext';
import { ReportBugModal } from '@/components/support/ReportBugModal';

export const SupportPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const helpTopics = [
    {
      title: 'Getting Started & Account',
      articles: [
        'How to complete your candidate onboarding',
        'Signing in with Google OAuth vs Magic Links',
        'Updating your email and password',
        'Configuring your candidate profile and avatar'
      ]
    },
    {
      title: 'Resume Intelligence & ATS',
      articles: [
        'How Gemini AI extracts skills from PDF/DOCX files',
        'Improving your ATS match score',
        'Supported resume file formats and 10MB limits',
        'Generating ATS-tailored cover letters'
      ]
    },
    {
      title: 'Job Search & Automation',
      articles: [
        'Setting up automated role discovery rules',
        'Configuring daily application quotas (max 50/day)',
        'Understanding verified LinkedIn and Naukri feeds',
        'Tracking application status in the pipeline Kanban'
      ]
    },
    {
      title: 'Billing & Subscriptions',
      articles: [
        'Upgrading to KnowYourJob Pro tier',
        'Understanding INR pricing and tax invoices',
        'How to cancel your subscription with 1-click',
        'Requesting a refund under our 7-day policy'
      ]
    }
  ];

  const filteredTopics = helpTopics.map((topic) => ({
    ...topic,
    articles: topic.articles.filter((a) =>
      searchQuery ? a.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
  })).filter((t) => t.articles.length > 0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !ticketMessage) {
      showToast('Please fill out your email and message.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Support ticket received! Our engineering team will respond within 24 hours.', 'success', 'Ticket Submitted');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <header className="border-b border-white/10 bg-[#000000]/70 backdrop-blur-2xl sticky top-0 z-30 px-6 py-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <KYJLogo size={32} glow />
            <span className="text-lg font-bold text-white">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              to="/jobs"
              className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Search size={13} className="text-amber-400" />
              <span>All Jobs</span>
            </Link>
            <Link
              to="/auth/login"
              className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="btn-yellow-gradient px-4 py-1.5 rounded-xl text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Get Started</span>
              <ChevronRight size={13} className="stroke-[3]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="px-6 pt-16 pb-12 text-center max-w-4xl mx-auto w-full relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glossy-badge-gold text-xs font-mono mb-4">
          <HelpCircle size={14} />
          <span>HELP CENTER & TECHNICAL SUPPORT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How can we help you today?
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-400">
          Search candidate guides, technical documentation, or submit a direct inquiry to our engineering team.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, ATS scoring, billing, automation..."
            className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 shadow-inner liquid-glass"
          />
        </div>
      </section>

      {/* Knowledge Base Articles */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic, i) => (
            <div key={i} className="liquid-glass-elevated p-6 rounded-3xl border border-white/10 shadow-lg hover:border-amber-500/30 transition">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-400" />
                <span>{topic.title}</span>
              </h3>
              <ul className="space-y-2.5">
                {topic.articles.map((art, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => showToast(`Article: "${art}"`, 'info')}
                      className="text-xs text-neutral-400 hover:text-amber-300 transition flex items-center justify-between w-full text-left group"
                    >
                      <span className="truncate">{art}</span>
                      <ChevronRight size={14} className="text-neutral-600 group-hover:text-amber-400 transition flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Direct Report Card */}
      <section className="max-w-3xl mx-auto px-6 pb-6 w-full relative z-10">
        <div className="liquid-glass-elevated p-8 rounded-3xl border border-rose-500/30 bg-rose-500/5 text-center flex flex-col items-center shadow-[0_10px_35px_rgba(244,63,94,0.15)] relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <Bug size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Found a technical bug?</h2>
          <p className="text-xs text-neutral-400 mt-2 max-w-md leading-relaxed">
            If you've encountered a UI defect, an error, or a security issue, you can send a technical report directly to the developer. Telemetry is auto-attached to help fix it.
          </p>
          <button
            onClick={() => setIsBugModalOpen(true)}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
          >
            <Bug size={16} />
            <span>Report a Bug to Developer</span>
          </button>
        </div>
      </section>

      {/* Direct Contact & Ticket Form */}
      <section className="max-w-3xl mx-auto px-6 py-6 w-full relative z-10">
        <div className="liquid-glass-elevated p-8 rounded-3xl border border-white/10 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Can't find what you're looking for?</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Submit a support ticket and our developer team will get back to you promptly.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Ticket Submitted Successfully</h3>
              <p className="text-xs text-neutral-400 mt-1">
                We have received your message and sent a confirmation to {ticketEmail}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 btn-glass px-5 py-2 rounded-xl text-xs text-white transition font-medium"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-medium">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-medium">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Issue with resume parsing, billing question"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-medium">Message Details</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please describe what you experienced, including any error messages..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl btn-yellow-gradient text-black text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] disabled:opacity-60"
              >
                <Send size={14} className="text-black" />
                <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto py-8 px-6 text-xs text-neutral-500 text-center relative z-10">
        <p>© {new Date().getFullYear()} KnowYourJob Support & Help Center. All rights reserved.</p>
      </footer>

      <ReportBugModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
    </div>
  );
};

export default SupportPage;
