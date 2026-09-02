import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { KYJLogo } from '@/components/ui/KYJLogo';
import { 
  ChevronDown, CheckCircle, Search, Zap, 
  Shield, Brain, BarChart, Clock, Briefcase,
  FileText, Star, Rocket, Lock, ArrowRight,
  TrendingUp, Users, Target, ShieldCheck,
  Share2 as Twitter, Globe as Linkedin, ExternalLink as Github, LayoutDashboard
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Variants } from 'motion/react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(255,215,0,0.1)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <KYJLogo size={32} />
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-[var(--color-primary)] transition-colors">
          KnowYourJob
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-secondary)]">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="btn-glass text-sm px-5 py-2 hidden sm:block">
          Sign In
        </Link>
        <Link to="/signup" className="btn-primary text-sm px-6 py-2 shadow-[0_0_20px_rgba(255,208,0,0.3)]">
          Start Free
        </Link>
      </div>
    </div>
  </nav>
);

const FloatingCard = ({ children, className, delay = 0, yRange = [15, -15], duration = 4 }: any) => (
  <motion.div
    animate={{ y: yRange }}
    transition={{ repeat: Infinity, repeatType: 'reverse', duration, delay, ease: 'easeInOut' }}
    className={clsx("absolute glass rounded-2xl p-4 shadow-card", className)}
  >
    {children}
  </motion.div>
);

const Hero = () => (
  <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center">
    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[rgba(255,208,0,0.15)] blur-[120px] rounded-full pointer-events-none" />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center lg:text-left"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold leading-[1.1] tracking-tight mb-6">
            <span className="text-gradient block">Find Smarter.</span>
            <span className="text-gradient block">Match Better.</span>
            <span className="text-gradient block">Apply Faster.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-[var(--color-secondary)] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            KnowYourJob uses AI to understand your resume, discover relevant opportunities, analyze your fit, and help you apply faster.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/signup" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,208,0,0.3)] hover:scale-105 transition-transform">
              Start Free <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="btn-glass w-full sm:w-auto px-8 py-4 text-lg font-semibold flex items-center justify-center">
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(255,208,0,0.05)] to-transparent rounded-3xl" />
          
          <FloatingCard className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] z-20 glass-gold border border-[rgba(255,208,0,0.3)] shadow-[0_0_40px_rgba(255,208,0,0.15)]" duration={5}>
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(255,208,0,0.2)] flex items-center justify-center text-[var(--color-primary)]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Generative AI Engineer</h3>
                  <p className="text-sm text-[var(--color-secondary)]">TechCorp</p>
                </div>
              </div>
              <span className="badge-ai">âš¡ 94% Match</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="badge-demo">Python âœ“</span>
                <span className="badge-demo">LLMs âœ“</span>
                <span className="badge-demo">RAG âœ“</span>
                <span className="badge-demo">AWS âœ“</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-secondary)]">Required Skills</span>
                  <span className="text-[var(--color-primary)] font-medium">9/10</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] w-[90%] rounded-full shadow-[0_0_10px_rgba(255,208,0,0.5)]" />
                </div>
              </div>
            </div>
            
            <button className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
              <Zap size={18} /> Apply with AI
            </button>
          </FloatingCard>

          <FloatingCard className="top-[10%] left-0 z-30" delay={0.5} yRange={[10, -10]} duration={4.5}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">+12 New Matches</p>
                <p className="text-xs text-[var(--color-secondary)]">Just now</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="bottom-[10%] right-0 z-30" delay={1} yRange={[-15, 15]}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
                <Star size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Resume Score</p>
                <p className="text-lg font-bold text-gradient">92/100</p>
              </div>
            </div>
          </FloatingCard>
          
          <FloatingCard className="top-[40%] -left-8 z-10" delay={1.5} yRange={[20, -20]} duration={6}>
            <p className="text-xs text-[var(--color-secondary)] uppercase tracking-wider mb-1">Applications</p>
            <p className="text-2xl font-bold text-white">37</p>
          </FloatingCard>
          
          <FloatingCard className="top-[60%] -right-8 z-10" delay={2} yRange={[-20, 20]} duration={5.5}>
            <p className="text-xs text-[var(--color-secondary)] uppercase tracking-wider mb-1">Interview Rate</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">18%</p>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  </section>
);

const Metrics = () => (
  <section className="py-10 border-y border-[rgba(255,215,0,0.1)] bg-white/[0.02]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: Users, value: "50,000+", label: "Candidates" },
          { icon: Search, value: "12M+", label: "Jobs Analyzed" },
          { icon: Target, value: "94%", label: "Match Accuracy" },
          { icon: Zap, value: "3.2x", label: "Faster Applications" }
        ].map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center justify-center text-center p-4"
          >
            <metric.icon className="text-[var(--color-primary)] mb-3 opacity-80" size={24} />
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-[var(--color-secondary)]">{metric.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">How <span className="text-gradient">AI Job Search</span> Works</h2>
        <p className="text-[var(--color-secondary)] text-lg">Stop manually searching and applying. Let our AI handle the heavy lifting while you focus on the interviews.</p>
      </div>

      <div className="relative">
        {/* Connection line */}
        <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[rgba(255,208,0,0.3)] to-transparent -translate-y-1/2" />
        
        <div className="grid lg:grid-cols-4 gap-8">
          {[
            { num: "01", icon: FileText, title: "Upload Resume", desc: "Our AI parses your experience, skills, and achievements instantly." },
            { num: "02", icon: Search, title: "AI Finds Matches", desc: "We scan millions of jobs to find the exact roles you're qualified for." },
            { num: "03", icon: Zap, title: "Prepare App", desc: "Generate tailored cover letters and resume variations for each role." },
            { num: "04", icon: LayoutDashboard, title: "Track Progress", desc: "Manage all your applications and upcoming interviews in one place." }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass p-8 rounded-3xl relative flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="absolute -top-4 -left-4 text-6xl font-black text-white/[0.03] select-none pointer-events-none">
                {step.num}
              </div>
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 text-[var(--color-primary)] shadow-[0_0_20px_rgba(255,208,0,0.1)]">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[var(--color-secondary)] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeatureSection = ({ title, highlight, description, list, reverse, children }: any) => (
  <section className="py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={clsx("grid lg:grid-cols-2 gap-16 items-center", reverse && "lg:flex-row-reverse")}>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={clsx(reverse && "order-2")}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {title} <span className="text-gradient block">{highlight}</span>
          </h2>
          <p className="text-[var(--color-secondary)] text-lg mb-8 leading-relaxed">
            {description}
          </p>
          {list && (
            <ul className="space-y-4">
              {list.map((item: any, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[rgba(255,208,0,0.15)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={clsx("relative", reverse && "order-1")}
        >
          {children}
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <div id="features">
    <FeatureSection
      title="AI Resume"
      highlight="Intelligence"
      description="Don't guess what recruiters want. Our AI analyzes your resume against industry standards and ATS requirements to score your profile."
      list={[
        "Instant ATS compatibility scoring",
        "Keyword gap analysis based on target roles",
        "Actionable formatting recommendations",
        "Impact measurement for bullet points"
      ]}
    >
      <div className="glass-strong p-8 rounded-3xl border border-[rgba(255,208,0,0.2)] shadow-[0_0_50px_rgba(255,208,0,0.1)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,208,0,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm text-[var(--color-secondary)] uppercase tracking-wider mb-1">ATS Score</p>
              <h3 className="text-4xl font-bold text-white">91<span className="text-xl text-[var(--color-secondary)]">/100</span></h3>
            </div>
            <div className="badge-ai text-sm px-3 py-1">Top 5%</div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Keywords", score: 88, color: "bg-[var(--color-primary)]" },
              { label: "Formatting", score: 95, color: "bg-green-500" },
              { label: "Impact", score: 84, color: "bg-blue-500" }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">{item.label}</span>
                  <span className="text-white font-medium">{item.score}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                    className={clsx("h-full rounded-full shadow-[0_0_10px_currentColor]", item.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureSection>

    <FeatureSection
      reverse
      title="Precision AI"
      highlight="Job Matching"
      description="Stop scrolling through irrelevant jobs. KnowYourJob's semantic matching engine understands your experience and finds roles where you have the highest probability of success."
      list={[
        "Semantic skill mapping (beyond keyword matching)",
        "Seniority and level calibration",
        "Company culture and preference alignment",
        "Hidden opportunity discovery"
      ]}
    >
      <div className="glass-strong p-8 rounded-3xl border border-[rgba(255,208,0,0.2)] flex items-center justify-center min-h-[400px]">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="url(#matchGradient)" 
              strokeWidth="8"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              whileInView={{ strokeDashoffset: 283 - (283 * 0.94) }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFAA00" />
                <stop offset="100%" stopColor="#FFD000" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-gradient">94%</span>
            <span className="text-sm text-[var(--color-secondary)] uppercase tracking-wider mt-1">Match</span>
          </div>
          
          <FloatingCard className="absolute -top-4 -right-12 z-20" yRange={[5, -5]} duration={3}>
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <CheckCircle size={12} className="text-green-400" /> Hard Skills Match
            </span>
          </FloatingCard>
          <FloatingCard className="absolute -bottom-4 -left-8 z-20" yRange={[-5, 5]} duration={4}>
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <Star size={12} className="text-[var(--color-primary)]" /> Experience Fit
            </span>
          </FloatingCard>
        </div>
      </div>
    </FeatureSection>

    <FeatureSection
      title="Intelligent"
      highlight="Application Assistant"
      description="Applying to jobs takes time. Our AI assistant speeds up the process by drafting tailored cover letters, answering common application questions, and suggesting resume tweaks for specific roles."
      list={[
        "One-click cover letter generation",
        "Role-specific resume tailoring",
        "Custom application question drafting",
        "Interview prep based on job description"
      ]}
    >
      <div className="glass-strong p-6 rounded-3xl border border-[rgba(255,208,0,0.15)] flex flex-col gap-4">
        <div className="glass p-4 rounded-xl flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0 mt-1">
            <Brain size={16} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white mb-2">Analyzing Job Description...</p>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-[var(--color-primary)] w-full rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        </div>
        
        <div className="glass p-4 rounded-xl ml-8 bg-white/[0.03]">
          <p className="text-sm text-white/80 leading-relaxed">
            <span className="text-gradient font-medium">Generated Cover Letter:</span><br/>
            Dear Hiring Manager,<br/><br/>
            I am writing to express my strong interest in the Generative AI Engineer position at TechCorp. With my 5+ years of experience building RAG systems and working with LLMs...
          </p>
          <div className="mt-4 flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">Edit</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/30 transition-colors">Use this</button>
          </div>
        </div>
      </div>
    </FeatureSection>
  </div>
);

const Security = () => (
  <section className="py-24 relative bg-black/50 border-y border-[rgba(255,215,0,0.05)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ShieldCheck className="w-16 h-16 mx-auto text-[var(--color-primary)] mb-6 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Security & <span className="text-gradient">Privacy First</span></h2>
        <p className="text-[var(--color-secondary)] text-lg">Your career data is sensitive. We treat it with the highest level of security and respect your privacy choices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Lock, title: "Resume Stays Private", desc: "We never share your raw resume data with third parties or employers without your explicit consent." },
          { icon: Brain, title: "AI on Your Terms", desc: "You control how much AI assistance you want. Review everything before it's submitted." },
          { icon: Shield, title: "Delete Anytime", desc: "Complete control over your data. Delete your account and all associated data with one click." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-6 text-white">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-[var(--color-secondary)] text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, <span className="text-gradient">Transparent</span> Pricing</h2>
        <p className="text-[var(--color-secondary)] text-lg">Invest in your career with a plan that fits your job search needs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { 
            name: "FREE", price: "$0", period: "/mo", 
            features: ["Basic AI matching", "10 saved jobs", "Basic resume analysis", "Manual application tracking"],
            btnText: "Get Started", btnClass: "btn-glass"
          },
          { 
            name: "PRO", price: "$19", period: "/mo", popular: true,
            features: ["Everything in Free", "Unlimited matches", "Advanced Resume AI", "AI Cover Letters", "Interview Prep"],
            btnText: "Start Pro", btnClass: "btn-primary shadow-[0_0_20px_rgba(255,208,0,0.3)]"
          },
          { 
            name: "AUTO", price: "$49", period: "/mo", 
            features: ["Everything in Pro", "Auto Apply capabilities", "50 auto-apps/day", "Priority matching", "Dedicated support"],
            btnText: "Go Auto", btnClass: "btn-glass border-[var(--color-primary)] text-[var(--color-primary)]"
          }
        ].map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={clsx(
              "relative p-8 rounded-3xl flex flex-col",
              plan.popular ? "glass-gold border-[rgba(255,208,0,0.4)] md:-translate-y-4 shadow-[0_0_40px_rgba(255,208,0,0.1)]" : "glass border-white/10"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{plan.price}</span>
              <span className="text-[var(--color-secondary)]">{plan.period}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, fi) => (
                <li key={fi} className="flex items-start gap-3">
                  <CheckCircle size={18} className={plan.popular ? "text-[var(--color-primary)]" : "text-white/40"} />
                  <span className="text-sm text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={clsx("w-full py-3 rounded-xl font-semibold transition-all", plan.btnClass)}>
              {plan.btnText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-medium text-white group-hover:text-[var(--color-primary)] transition-colors">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[var(--color-secondary)] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "Is KnowYourJob free to use?", a: "Yes! We offer a generous free tier that includes basic AI matching, resume analysis, and job tracking. You can upgrade to Pro for advanced AI features like cover letter generation." },
    { q: "How does AI matching work?", a: "Our AI doesn't just look at keywords. It semantically understands your experience, maps your skills to industry requirements, and evaluates role seniority to provide a highly accurate match percentage." },
    { q: "Can KnowYourJob apply to jobs automatically?", a: "Yes, our Auto plan allows you to set up automated applications. However, we strictly adhere to platform rules and never bypass security measures like CAPTCHAs or MFA." },
    { q: "Is my resume data secure?", a: "Absolutely. We encrypt your data at rest and in transit. Your resume is only used to provide you with matches and is never sold to third parties." },
    { q: "What job boards does KnowYourJob search?", a: "We aggregate listings from millions of sources including major boards, direct company career pages, and specialized niche platforms to give you comprehensive coverage." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel your Pro or Auto subscription at any time from your account settings. You will retain access to premium features until the end of your billing cycle." }
  ];

  return (
    <section id="faq" className="py-24 relative bg-black/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked <span className="text-gradient">Questions</span></h2>
        </div>
        
        <div className="glass rounded-3xl p-6 sm:p-8">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="py-24 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="glass-strong rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden border border-[rgba(255,208,0,0.3)] shadow-[0_0_80px_rgba(255,208,0,0.15)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,208,0,0.15)_0%,transparent_70%)]" />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
          Ready to find your next <span className="text-gradient">opportunity?</span>
        </h2>
        <p className="text-xl text-[var(--color-secondary)] mb-10">
          Join 50,000+ professionals using AI to transform their job search.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary w-full sm:w-auto px-10 py-5 text-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,208,0,0.4)] hover:scale-105 transition-transform">
            Start Free Now <Rocket size={20} />
          </Link>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[var(--color-secondary)]">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black flex items-center justify-center text-xs text-white">
                <Users size={12} />
              </div>
            ))}
          </div>
          <span>Trusted by thousands of job seekers</span>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 pt-16 pb-8 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <KYJLogo size={28} />
            <span className="text-xl font-bold tracking-tight text-white">KnowYourJob</span>
          </Link>
          <p className="text-[var(--color-secondary)] text-sm mb-6 max-w-sm">
            AI-powered career platform designed to help you find smarter, match better, and apply faster.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"><Github size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-[var(--color-secondary)]">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Resume AI</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Job Matching</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-[var(--color-secondary)]">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-[var(--color-secondary)]">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[var(--color-secondary)] text-sm">
          Â© 2026 KnowYourJob. Find Smarter. Match Better. Apply Faster.
        </p>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white page-enter selection:bg-[var(--color-primary)] selection:text-black font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <HowItWorks />
        <Features />
        <Security />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}


