import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Cookie, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  FileCode, 
  HeartHandshake, 
  Scale, 
  UserCheck,
  ChevronRight,
  Printer
} from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';

export type LegalDocType = 
  | 'privacy' 
  | 'terms' 
  | 'cookies' 
  | 'refund-policy' 
  | 'cancellation-policy' 
  | 'disclaimer' 
  | 'accessibility' 
  | 'dpa' 
  | 'acceptable-use' 
  | 'security-policy' 
  | 'responsible-disclosure' 
  | 'community-guidelines';

interface LegalDoc {
  id: LegalDocType;
  title: string;
  category: 'Privacy & Security' | 'Terms & Commerce' | 'Compliance & Standards';
  icon: any;
  lastUpdated: string;
  content: React.ReactNode;
}

export const LegalPage: React.FC<{ defaultDoc?: LegalDocType }> = ({ defaultDoc }) => {
  const { doc: paramDoc } = useParams<{ doc?: string }>();
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(defaultDoc || (paramDoc as LegalDocType) || 'privacy');

  useEffect(() => {
    if (paramDoc) {
      setActiveDoc(paramDoc as LegalDocType);
    } else if (defaultDoc) {
      setActiveDoc(defaultDoc);
    }
  }, [paramDoc, defaultDoc]);

  const docs: LegalDoc[] = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      category: 'Privacy & Security',
      icon: ShieldCheck,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            At <strong>KnowYourJob</strong> ("we", "our", or "us"), protecting candidate privacy and confidential career data is our primary foundational principle. This Privacy Policy details how we collect, store, process, and protect your personal information in compliance with the Digital Personal Data Protection (DPDP) Act 2023 (India), the General Data Protection Regulation (GDPR), and international privacy frameworks.
          </p>

          <h3 className="text-base font-bold text-white mt-4">1. Data We Collect</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong>Account Identity:</strong> Email address, full name, authentication provider tokens (Google OAuth), and profile avatars.</li>
            <li><strong>Career Assets:</strong> Resumes uploaded in PDF/DOCX format, text extracts, extracted skill tags, verified work history, and target salary ranges.</li>
            <li><strong>Application Telemetry:</strong> Tracked job applications, match scores, submission logs, and user-configured automation parameters.</li>
            <li><strong>Technical Diagnostics:</strong> IP address, browser user-agent, session timestamps, and operational telemetry.</li>
          </ul>

          <h3 className="text-base font-bold text-white mt-4">2. Processing of AI Resumes & Gemini Integration</h3>
          <p>
            When you upload a resume for automated profile generation or ATS diagnostic scoring, your document text is parsed locally within your authenticated session. Text fragments sent to Google Gemini APIs are processed ephemerally under Google Cloud enterprise terms and are <strong>never used to train public foundation models</strong>.
          </p>

          <h3 className="text-base font-bold text-white mt-4">3. Cloud Isolation & Firestore Security</h3>
          <p>
            All candidate resumes and application histories are isolated strictly per-user via Firebase Authentication UID boundaries and verified by Firestore Security Rules. No candidate record is accessible to third parties or other registered job seekers.
          </p>

          <h3 className="text-base font-bold text-white mt-4">4. Your Data Rights & Deletion</h3>
          <p>
            You have the absolute right to inspect, export, or permanently delete your account, resume files, and telemetry at any time via your Account Settings or by contacting privacy@knowyourjob.web.app.
          </p>
        </div>
      )
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      category: 'Terms & Commerce',
      icon: Scale,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            By accessing or using the KnowYourJob web application, API adapters, or career automation services, you agree to be bound by these Terms of Service.
          </p>
          <h3 className="text-base font-bold text-white mt-4">1. Authorized Platform Use</h3>
          <p>
            KnowYourJob provides candidates with AI-powered discovery, ATS resume evaluation, and workflow tracking tools. You agree not to upload fraudulent credentials, falsify employment records, or abuse automated request limits.
          </p>
          <h3 className="text-base font-bold text-white mt-4">2. Intellectual Property</h3>
          <p>
            Your uploaded resumes, cover letters, and career assets remain exclusively your property. KnowYourJob claims no ownership over candidate documents.
          </p>
          <h3 className="text-base font-bold text-white mt-4">3. Third-Party Job Portal Aggregation</h3>
          <p>
            KnowYourJob references verified job listings through approved partner APIs, official RSS/ATS feeds, and employer direct postings. We are not an employment agency and do not guarantee interview placement or hiring outcomes.
          </p>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookie Policy & Consent',
      category: 'Privacy & Security',
      icon: Cookie,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            KnowYourJob uses minimal, essential cookies and browser storage mechanisms to maintain secure user sessions and preserve client-side filter preferences.
          </p>
          <h3 className="text-base font-bold text-white mt-4">1. Strictly Necessary Cookies</h3>
          <p>
            Firebase Authentication tokens stored in IndexedDB and temporary session keys required to authenticate API requests and prevent cross-site request forgery.
          </p>
          <h3 className="text-base font-bold text-white mt-4">2. Performance & Diagnostics</h3>
          <p>
            Anonymous telemetry used to diagnose slow route transitions, Core Web Vitals, and application error rates.
          </p>
        </div>
      )
    },
    {
      id: 'refund-policy',
      title: 'Refund Policy',
      category: 'Terms & Commerce',
      icon: RotateCcw,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            We stand behind the quality of KnowYourJob Pro and Enterprise subscription tiers.
          </p>
          <h3 className="text-base font-bold text-white mt-4">1. 7-Day Money-Back Guarantee</h3>
          <p>
            If you are not fully satisfied with our AI career intelligence features or automated tracking workflows, you may request a 100% full refund within 7 days of initial subscription activation.
          </p>
          <h3 className="text-base font-bold text-white mt-4">2. Processing Time</h3>
          <p>
            Refunds are credited directly back to the original payment method (Credit Card, Net Banking, UPI) within 5 to 7 business days.
          </p>
        </div>
      )
    },
    {
      id: 'cancellation-policy',
      title: 'Cancellation Policy',
      category: 'Terms & Commerce',
      icon: FileText,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Subscriptions can be cancelled at any time directly through your Billing Dashboard without cancellation fees or customer support friction.
          </p>
          <p>
            Upon cancellation, your Pro benefits remain active until the end of your current billing period, after which your account reverts safely to the Free tier.
          </p>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: 'Legal Disclaimer',
      category: 'Compliance & Standards',
      icon: AlertTriangle,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            The job recommendations, ATS match scores, salary benchmarks, and AI suggestions provided by KnowYourJob are generated using probabilistic machine learning models and aggregate market data. They are provided for informational and career guidance purposes only.
          </p>
          <p>
            KnowYourJob does not guarantee job placement, interview offers, or hiring decisions, which remain solely at the discretion of prospective employers.
          </p>
        </div>
      )
    },
    {
      id: 'accessibility',
      title: 'Accessibility Statement',
      category: 'Compliance & Standards',
      icon: UserCheck,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            KnowYourJob is committed to digital accessibility for all users, including individuals with visual, auditory, cognitive, or physical impairments.
          </p>
          <h3 className="text-base font-bold text-white mt-4">Conformance Status</h3>
          <p>
            We target conformance with <strong>WCAG 2.1 Level AA</strong> standards across our liquid-glass user interface, including high-contrast color pairings, ARIA screen-reader labels, logical keyboard tab stops, and zoom compatibility up to 200%.
          </p>
        </div>
      )
    },
    {
      id: 'dpa',
      title: 'Data Processing Agreement (DPA)',
      category: 'Privacy & Security',
      icon: Lock,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            This Data Processing Agreement governs the processing of candidate and enterprise personal data in connection with the KnowYourJob career platform.
          </p>
          <h3 className="text-base font-bold text-white mt-4">Sub-processors</h3>
          <p>
            Our infrastructure sub-processors include Google Cloud / Firebase (Authentication, Cloud Firestore, Firebase Hosting), Google Cloud AI (Gemini Flash APIs), and Fastly Edge CDN.
          </p>
        </div>
      )
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use Policy',
      category: 'Compliance & Standards',
      icon: FileCode,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            All users must respect the operational integrity of KnowYourJob. Prohibited actions include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Attempting unauthorized access to another user's candidate profile or resume storage.</li>
            <li>Circumventing API rate limits or automated security rules.</li>
            <li>Uploading malicious documents containing embedded macros or executable code.</li>
            <li>Submitting prompt injection attacks designed to extract underlying system prompts.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'security-policy',
      title: 'Security Policy',
      category: 'Privacy & Security',
      icon: ShieldCheck,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            KnowYourJob maintains a defense-in-depth security architecture protecting cloud data, API tokens, and candidate documents.
          </p>
          <h3 className="text-base font-bold text-white mt-4">Transport & Perimeter Security</h3>
          <p>
            All network communication requires TLS 1.3 encryption. HTTP response headers enforce strict Content-Security-Policy (CSP), HSTS preload, X-Frame-Options: DENY, and Permissions-Policy.
          </p>
          <h3 className="text-base font-bold text-white mt-4">Storage Security</h3>
          <p>
            Uploaded resume assets are restricted to PDF and DOCX formats under 10MB and locked to user-specific private paths validated by Cloud Storage security rules.
          </p>
        </div>
      )
    },
    {
      id: 'responsible-disclosure',
      title: 'Responsible Disclosure & Vulnerability Reporting',
      category: 'Compliance & Standards',
      icon: CheckCircle,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            We welcome responsible security disclosures from ethical researchers and developers. If you discover a security vulnerability in our web application or infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Email details to <strong>security@knowyourjob.web.app</strong> with reproduction steps.</li>
            <li>Allow us reasonable time to remediate before public disclosure.</li>
            <li>Never attempt destructive actions, data exfiltration, or denial-of-service attacks.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'community-guidelines',
      title: 'Community Guidelines',
      category: 'Compliance & Standards',
      icon: HeartHandshake,
      lastUpdated: 'September 2026',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            KnowYourJob fosters a fair, respectful, and supportive community for technology professionals and hiring teams worldwide.
          </p>
          <p>
            Hate speech, harassment, fraudulent job listings, and recruiter spam are strictly prohibited and result in immediate account termination.
          </p>
        </div>
      )
    }
  ];

  const currentDoc = docs.find((d) => d.id === activeDoc) || docs[0];

  useEffect(() => {
    document.title = `${currentDoc.title} — KnowYourJob`;
  }, [currentDoc]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#090d14]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2 mb-6">
          <Link to="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-400">Legal & Compliance</span>
          <ChevronRight size={12} />
          <span className="text-amber-400 font-medium">{currentDoc.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <div className="liquid-glass-elevated p-4 rounded-2xl border border-white/5 sticky top-24">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 px-2">
                Legal & Governance
              </h3>
              <div className="space-y-1">
                {docs.map((d) => {
                  const Icon = d.icon;
                  const isActive = d.id === activeDoc;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDoc(d.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                      <span className="truncate">{d.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Note on Shipping / Returns (Section 8 PDF compliance) */}
              <div className="mt-6 pt-4 border-t border-white/5 px-2 text-[11px] text-slate-500">
                <p><strong>Commerce Notice:</strong> KnowYourJob provides digital SaaS software and AI career tools. Physical Shipping and Product Return/Exchange policies are non-applicable.</p>
              </div>
            </div>
          </div>

          {/* Main Document Content */}
          <div className="lg:col-span-3">
            <div className="liquid-glass-elevated p-8 sm:p-10 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                    {currentDoc.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentDoc.title}
                  </h1>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Last Revised: {currentDoc.lastUpdated}
                  </span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
              </div>

              {/* Document Text Body */}
              <div className="prose prose-invert max-w-none">
                {currentDoc.content}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-xs text-slate-500 text-center">
        <p>© {new Date().getFullYear()} KnowYourJob. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LegalPage;
