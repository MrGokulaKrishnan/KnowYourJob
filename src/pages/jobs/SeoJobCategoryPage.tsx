import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Briefcase,
  Layers,
  HelpCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { DEMO_JOBS } from '@/lib/services/jobService';
import { NormalizedJob } from '@/types/normalizedJob';
import { JobCard } from '@/components/jobs/JobCard';
import { KYJLogo } from '@/components/ui/KYJLogo';

interface CategoryConfig {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  filterKeywords: string[];
  salaryBenchmarkINR: string;
  experienceLevel: string;
  topSkills: string[];
  summary: string;
  faqs: { q: string; a: string }[];
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'ai': {
    title: 'Artificial Intelligence (AI) Jobs in India & Remote',
    metaTitle: 'AI Jobs — Artificial Intelligence Careers & Openings | KnowYourJob',
    metaDescription: 'Explore top Artificial Intelligence (AI) engineering and research roles across Bangalore, Hyderabad, Pune, Mumbai, and Remote. Precision ATS matching.',
    keywords: ['AI', 'Artificial Intelligence', 'LLMs', 'Deep Learning', 'Neural Networks'],
    filterKeywords: ['ai', 'artificial intelligence', 'machine learning', 'llm'],
    salaryBenchmarkINR: '₹18,00,000 – ₹45,00,000 PA',
    experienceLevel: '2 – 8+ Years',
    topSkills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Docker', 'FastAPI'],
    summary: 'Discover verified Artificial Intelligence roles spanning autonomous agents, computer vision, natural language understanding, and foundation model infrastructure.',
    faqs: [
      {
        q: 'What is the average salary for an AI Engineer in India?',
        a: 'The average salary for AI Engineers in India ranges from ₹18,00,000 to ₹45,00,000 per annum depending on experience with LLMs, PyTorch, and distributed training systems.'
      },
      {
        q: 'Can I find remote AI jobs on KnowYourJob?',
        a: 'Yes, KnowYourJob curates remote and hybrid AI engineering roles across top Indian tech hubs and global enterprises hiring Indian talent.'
      }
    ]
  },
  'artificial-intelligence': {
    title: 'Artificial Intelligence Engineering Careers',
    metaTitle: 'Artificial Intelligence Jobs — Careers & Openings | KnowYourJob',
    metaDescription: 'Search verified Artificial Intelligence opportunities. ATS-scored applications, salary benchmarks in INR, and instant role alignment.',
    keywords: ['Artificial Intelligence', 'AI Systems', 'AI Research', 'Applied AI'],
    filterKeywords: ['artificial intelligence', 'ai', 'research'],
    salaryBenchmarkINR: '₹20,00,000 – ₹48,00,000 PA',
    experienceLevel: '3 – 9 Years',
    topSkills: ['Python', 'Mathematics', 'Transformers', 'FastAPI', 'Cloud AI'],
    summary: 'Explore full-stack and research-grade Artificial Intelligence positions architecting foundation models and enterprise agent swarms.',
    faqs: [
      {
        q: 'What qualifications are expected for Artificial Intelligence engineers?',
        a: 'Most roles require strong computer science fundamentals, mathematical intuition in linear algebra and probability, and hands-on proficiency with Python, PyTorch, and REST/gRPC API architectures.'
      }
    ]
  },
  'generative-ai': {
    title: 'Generative AI (GenAI) Engineer Jobs',
    metaTitle: 'Generative AI Jobs — GenAI Engineers & RAG Architects | KnowYourJob',
    metaDescription: 'Find high-paying Generative AI Engineer roles. Work with LLMs, RAG pipelines, LangChain, Claude, and Gemini foundation models.',
    keywords: ['Generative AI', 'GenAI', 'RAG', 'Prompt Engineering', 'LangChain'],
    filterKeywords: ['generative ai', 'genai', 'rag', 'langchain', 'llm'],
    salaryBenchmarkINR: '₹24,00,000 – ₹50,00,000 PA',
    experienceLevel: '2 – 7 Years',
    topSkills: ['Python', 'LangChain', 'LlamaIndex', 'Vector DBs', 'RAG', 'Claude API', 'Gemini'],
    summary: 'Generative AI represents the fastest-growing technology sector. Opportunities focus on building robust RAG pipelines, tool-calling agents, and fine-tuning open-weights.',
    faqs: [
      {
        q: 'What does a Generative AI Engineer do day-to-day?',
        a: 'Generative AI Engineers design retrieval-augmented generation (RAG) pipelines, optimize context windows, construct autonomous agent workflows, evaluate hallucination rates, and integrate vector databases.'
      }
    ]
  },
  'machine-learning': {
    title: 'Machine Learning (ML) Engineer Jobs',
    metaTitle: 'Machine Learning Jobs — ML Engineers & Data Scientists | KnowYourJob',
    metaDescription: 'Discover Machine Learning Engineer openings across top tech companies in India and remote. Algorithmic systems, predictive modeling, and MLOps.',
    keywords: ['Machine Learning', 'ML', 'Scikit-Learn', 'PyTorch', 'Algorithms'],
    filterKeywords: ['machine learning', 'ml', 'scikit', 'pytorch', 'deep learning'],
    salaryBenchmarkINR: '₹16,00,000 – ₹38,00,000 PA',
    experienceLevel: '2 – 8 Years',
    topSkills: ['Python', 'PyTorch', 'Scikit-learn', 'Pandas', 'SQL', 'Kubernetes'],
    summary: 'Accelerate your career in predictive modeling, statistical learning, neural network design, and high-throughput production inference pipelines.',
    faqs: [
      {
        q: 'How does ML differ from GenAI in job requirements?',
        a: 'Machine Learning often emphasizes statistical modeling, classification, regression, and data feature engineering, whereas GenAI focuses more heavily on foundation model prompting, RAG, and agentic workflows.'
      }
    ]
  },
  'llm': {
    title: 'LLM (Large Language Model) Engineer Jobs',
    metaTitle: 'LLM Engineer Jobs — Foundation Model & Agent Developers | KnowYourJob',
    metaDescription: 'Search dedicated LLM Engineer positions. Build reasoning agents, fine-tune models with LoRA/QLoRA, and architect production LLM platforms.',
    keywords: ['LLM', 'Large Language Models', 'Fine-tuning', 'LoRA', 'HuggingFace'],
    filterKeywords: ['llm', 'large language model', 'transformer', 'prompt'],
    salaryBenchmarkINR: '₹25,00,000 – ₹55,00,000 PA',
    experienceLevel: '3 – 8 Years',
    topSkills: ['PyTorch', 'HuggingFace', 'LoRA', 'vLLM', 'Triton', 'Vector Search'],
    summary: 'Lead foundation model adaptation, latency optimization with quantization, and high-performance inference serving with vLLM and TensorRT-LLM.',
    faqs: [
      {
        q: 'What skills are in highest demand for LLM Engineers?',
        a: 'Quantization, parameter-efficient fine-tuning (PEFT/LoRA), vLLM deployment, synthetic data generation, and guardrail enforcement.'
      }
    ]
  },
  'nlp': {
    title: 'Natural Language Processing (NLP) Jobs',
    metaTitle: 'NLP Engineer Jobs — Text Analytics & Conversational AI | KnowYourJob',
    metaDescription: 'Explore Natural Language Processing roles. Build semantic search engines, conversational interfaces, and information extraction systems.',
    keywords: ['NLP', 'Natural Language Processing', 'Named Entity Recognition', 'BERT'],
    filterKeywords: ['nlp', 'natural language', 'text', 'bert'],
    salaryBenchmarkINR: '₹18,00,000 – ₹36,00,000 PA',
    experienceLevel: '2 – 7 Years',
    topSkills: ['spaCy', 'NLTK', 'Transformers', 'HuggingFace', 'Elasticsearch'],
    summary: 'Craft intelligent semantic search, entity resolution, multi-lingual translation, and sentiment pipelines for enterprise datasets.',
    faqs: [
      {
        q: 'Is NLP still relevant in the era of LLMs?',
        a: 'Yes, modern NLP blends classical tokenization, syntactic parsing, and evaluation frameworks with modern transformer models for specialized domain tasks.'
      }
    ]
  },
  'computer-vision': {
    title: 'Computer Vision Engineer Jobs',
    metaTitle: 'Computer Vision Jobs — CV Engineers & Image AI | KnowYourJob',
    metaDescription: 'Find Computer Vision Engineer roles in India and remote. Object detection, diffusion models, OpenCV, and edge device inference.',
    keywords: ['Computer Vision', 'CV', 'OpenCV', 'YOLO', 'Image Processing'],
    filterKeywords: ['computer vision', 'vision', 'opencv', 'image', 'yolo'],
    salaryBenchmarkINR: '₹18,00,000 – ₹40,00,000 PA',
    experienceLevel: '2 – 8 Years',
    topSkills: ['OpenCV', 'PyTorch', 'YOLO', 'CUDA', 'TensorRT', 'Diffusion Models'],
    summary: 'Build visual perception systems for autonomous vehicles, industrial robotics, medical diagnostics, and generative media synthesis.',
    faqs: [
      {
        q: 'What edge deployment skills are valuable for CV Engineers?',
        a: 'TensorRT, ONNX Runtime, and Qualcomm/NVIDIA embedded platforms for sub-30ms real-time video stream processing.'
      }
    ]
  },
  'mlops': {
    title: 'MLOps & AI Infrastructure Engineer Jobs',
    metaTitle: 'MLOps Jobs — AI Platform & Pipeline Engineers | KnowYourJob',
    metaDescription: 'Browse top MLOps Engineer openings. CI/CD for machine learning, model registries, feature stores, and scalable Kubernetes clusters.',
    keywords: ['MLOps', 'Kubeflow', 'MLflow', 'Docker', 'Model Monitoring'],
    filterKeywords: ['mlops', 'devops', 'kubernetes', 'infrastructure'],
    salaryBenchmarkINR: '₹22,00,000 – ₹45,00,000 PA',
    experienceLevel: '3 – 8 Years',
    topSkills: ['Kubernetes', 'Docker', 'MLflow', 'Kubeflow', 'Terraform', 'Prometheus'],
    summary: 'Automate model training loops, orchestrate distributed compute clusters, and ensure 99.99% reliability for mission-critical AI applications.',
    faqs: [
      {
        q: 'What is the primary difference between DevOps and MLOps?',
        a: 'MLOps manages data drift, model decay, feature stores, and continuous model retraining pipelines in addition to standard software CI/CD infrastructure.'
      }
    ]
  },
  'prompt-engineer': {
    title: 'Prompt Engineer & AI Evaluator Jobs',
    metaTitle: 'Prompt Engineer Jobs — Context Architects & Red Teamers | KnowYourJob',
    metaDescription: 'Discover Prompt Engineering positions. Guide model outputs, design system prompts, construct evaluation benchmarks, and test red-teaming safety.',
    keywords: ['Prompt Engineering', 'AI Evaluator', 'System Prompts', 'Red Teaming'],
    filterKeywords: ['prompt', 'evaluator', 'ai product'],
    salaryBenchmarkINR: '₹14,00,000 – ₹30,00,000 PA',
    experienceLevel: '1 – 5 Years',
    topSkills: ['Few-shot Prompting', 'Chain-of-Thought', 'Evaluation Datasets', 'Python'],
    summary: 'Shape user experiences, minimize hallucinations, design structured JSON schemas, and stress-test foundation models against adversarial prompt injections.',
    faqs: [
      {
        q: 'Do Prompt Engineers need software development skills?',
        a: 'High-paying Prompt Engineering roles require Python scripting to construct automated evaluation pipelines and benchmark prompt variants systematically.'
      }
    ]
  },
  'remote-ai': {
    title: 'Remote AI Jobs — Work from Anywhere',
    metaTitle: 'Remote AI Jobs — Work from Home AI Engineering Roles | KnowYourJob',
    metaDescription: 'Explore fully remote AI, ML, and Data Science jobs. Work with global AI startups and Indian enterprises with complete location flexibility.',
    keywords: ['Remote AI', 'Work from Home', 'Distributed Team', 'Remote ML'],
    filterKeywords: ['remote'],
    salaryBenchmarkINR: '₹20,00,000 – ₹55,00,000 PA',
    experienceLevel: 'All Experience Levels',
    topSkills: ['Asynchronous Communication', 'Python', 'Cloud (AWS/GCP)', 'Git', 'Docker'],
    summary: 'Discover flexible remote positions with high competitive salaries, international exposure, and asynchronous engineering workflows.',
    faqs: [
      {
        q: 'Are remote AI salaries paid in INR or USD?',
        a: 'Indian remote employers pay in INR via direct payroll, while international employers typically pay via Deel/Remote in USD or converted INR.'
      }
    ]
  },
  'india-ai': {
    title: 'AI Jobs Across India — Bangalore, Hyderabad, Pune, Mumbai, Delhi',
    metaTitle: 'AI Jobs in India — Bangalore, Hyderabad, Pune Openings | KnowYourJob',
    metaDescription: 'Find AI and Machine Learning jobs in India top tech hubs: Bangalore, Hyderabad, Pune, Chennai, Mumbai, and Delhi NCR.',
    keywords: ['India AI Jobs', 'Bangalore AI', 'Hyderabad AI', 'Pune Tech'],
    filterKeywords: ['india', 'bangalore', 'hyderabad', 'pune', 'mumbai'],
    salaryBenchmarkINR: '₹15,00,000 – ₹45,00,000 PA',
    experienceLevel: '1 – 10+ Years',
    topSkills: ['Python', 'FastAPI', 'React', 'Cloud Services', 'SQL', 'Deep Learning'],
    summary: 'India is currently one of the global epicenters of AI adoption. Explore thousands of verified openings across top GCCs, startups, and product companies.',
    faqs: [
      {
        q: 'Which Indian city has the most AI job openings?',
        a: 'Bangalore leads in total AI openings, followed closely by Hyderabad and Pune, with major multinational Global Capability Centers (GCCs) expanding rapidly.'
      }
    ]
  }
};

export const SeoJobCategoryPage: React.FC = () => {
  const { category = 'ai' } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  const config = CATEGORY_CONFIGS[category.toLowerCase()] || CATEGORY_CONFIGS['ai'];

  // Match jobs matching this category's filter keywords
  const matchedJobs = useMemo(() => {
    return DEMO_JOBS.filter((job) => {
      const combined = `${job.title} ${job.description} ${(job.skills || []).join(' ')} ${job.location}`.toLowerCase();
      const matchesCategory = config.filterKeywords.some((kw) => combined.includes(kw));
      if (!matchesCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return combined.includes(q);
      }
      return true;
    });
  }, [category, config, searchTerm]);

  // Update document title and structured data
  useEffect(() => {
    document.title = `${config.metaTitle}`;
  }, [config]);

  // Generate FAQ JSON-LD Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://knowyourjob.web.app/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: 'https://knowyourjob.web.app/jobs'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.title,
        item: `https://knowyourjob.web.app/jobs/${category}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Dynamic Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#090d14]/70 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <KYJLogo size={32} glow />
            <span className="text-lg font-bold text-white">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/jobs" className="text-xs text-slate-300 hover:text-amber-400 transition">
              All Jobs
            </Link>
            <Link to="/auth/login" className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium hover:bg-white/5 transition">
              Sign In
            </Link>
            <Link to="/auth/register" className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-6 w-full text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-amber-400 transition">Home</Link>
        <ChevronRight size={12} />
        <Link to="/jobs" className="hover:text-amber-400 transition">Jobs</Link>
        <ChevronRight size={12} />
        <span className="text-amber-400 font-medium truncate">{config.title}</span>
      </nav>

      {/* Hero Category Overview */}
      <section className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4">
              <Sparkles size={12} />
              <span>VERIFIED AI JOB PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {config.title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              {config.summary}
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" />
                <span>Benchmark: <strong className="text-white">{config.salaryBenchmarkINR}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-amber-400" />
                <span>Exp: <strong className="text-white">{config.experienceLevel}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Active Roles: <strong className="text-white">{matchedJobs.length} Available</strong></span>
              </div>
            </div>
          </div>

          {/* Search within category */}
          <div className="w-full lg:w-96 liquid-glass-elevated p-5 rounded-2xl border border-white/10">
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Filter Within Category
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills, companies, keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Top Skills Tags */}
            <div className="mt-4">
              <span className="text-[11px] text-slate-500 block mb-2 font-mono uppercase">Top Category Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {config.topSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSearchTerm(skill)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 text-slate-300 border border-white/5 transition"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Grid */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Openings ({matchedJobs.length})</span>
          </h2>
          <Link to="/jobs" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            Browse All Jobs <ArrowRight size={12} />
          </Link>
        </div>

        {matchedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job as any}
                matchScore={job.matchScore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 liquid-glass-elevated rounded-2xl border border-white/5">
            <Layers className="mx-auto w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-white">No matching roles found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try clearing your search keyword or explore other AI categories.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </section>

      {/* Related AI Categories (Cross-linking for SEO Crawler Equity) */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full border-t border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono mb-4">
          Related AI Job Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(CATEGORY_CONFIGS).map(([slug, cat]) => (
            <Link
              key={slug}
              to={`/jobs/${slug}`}
              className={`p-3 rounded-xl border text-xs transition flex flex-col justify-between ${
                slug === category.toLowerCase()
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                  : 'liquid-glass-elevated border-white/5 text-slate-300 hover:border-amber-500/20 hover:text-white'
              }`}
            >
              <span className="truncate">{cat.title.split('—')[0].split('(')[0]}</span>
              <span className="text-[10px] text-slate-500 mt-1">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ Section) */}
      {config.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 w-full border-t border-white/5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2">
              <HelpCircle size={14} />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Insights & Advice: {config.title.split('(')[0]}
            </h3>
            <div className="space-y-4">
              {config.faqs.map((faq, index) => (
                <div key={index} className="liquid-glass-elevated p-5 rounded-2xl border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-2">{faq.q}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto py-8 px-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <KYJLogo size={20} />
            <span className="text-slate-300 font-semibold">KnowYourJob</span>
            <span>— AI Job Discovery Engine</span>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-400 transition">Terms of Service</Link>
            <Link to="/security-policy" className="hover:text-amber-400 transition">Security Policy</Link>
            <Link to="/accessibility" className="hover:text-amber-400 transition">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoJobCategoryPage;
