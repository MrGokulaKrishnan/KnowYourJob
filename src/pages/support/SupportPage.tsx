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
  Send
} from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';
import { useToast } from '@/context/ToastContext';

export const SupportPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#040404]/85 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <KYJLogo size={32} glow />
            <span className="text-lg font-bold text-white">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/jobs" className="text-xs text-slate-300 hover:text-amber-400 transition">
              Find Jobs
            </Link>
            <Link to="/auth/login" className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium hover:bg-white/5 transition">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="px-6 pt-16 pb-12 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4">
          <HelpCircle size={14} />
          <span>HELP CENTER & TECHNICAL SUPPORT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How can we help you today?
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-400">
          Search candidate guides, technical documentation, or submit a direct inquiry to our engineering team.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, ATS scoring, billing, automation..."
            className="w-full pl-12 pr-4 py-3.5 bg-black/60 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </section>

      {/* Knowledge Base Articles */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic, i) => (
            <div key={i} className="liquid-glass-elevated p-6 rounded-2xl border border-white/5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-400" />
                <span>{topic.title}</span>
              </h3>
              <ul className="space-y-2.5">
                {topic.articles.map((art, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => showToast(`Article: "${art}"`, 'info')}
                      className="text-xs text-slate-400 hover:text-amber-300 transition flex items-center justify-between w-full text-left group"
                    >
                      <span className="truncate">{art}</span>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact & Ticket Form */}
      <section className="max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="liquid-glass-elevated p-8 rounded-2xl border border-white/10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Can't find what you're looking for?</h2>
            <p className="text-xs text-slate-400 mt-1">
              Submit a support ticket and our developer team will get back to you promptly.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Ticket Submitted Successfully</h3>
              <p className="text-xs text-slate-400 mt-1">
                We have received your message and sent a confirmation to {ticketEmail}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Issue with resume parsing, billing question"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Message Details</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please describe what you experienced, including any error messages..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto py-8 px-6 text-xs text-slate-500 text-center">
        <p>© {new Date().getFullYear()} KnowYourJob Support & Help Center. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SupportPage;
