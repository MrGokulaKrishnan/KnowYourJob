import { NormalizedJob } from '@/types/normalizedJob';

export const DEMO_JOBS: NormalizedJob[] = [
  {
    id: 'job-1',
    title: 'Generative AI Engineer',
    company: 'Anthropic Labs India',
    location: 'Bangalore · Hybrid',
    remoteType: 'hybrid',
    employmentType: 'full-time',
    salary: { min: 2400000, max: 3600000, currency: 'INR', period: 'year' },
    description: 'We are seeking an exceptional Generative AI Engineer to architect and deploy state-of-the-art LLM pipelines, RAG systems, and autonomous agent frameworks powering enterprise workflows.',
    responsibilities: [
      'Design and optimize multi-stage RAG pipelines using vector databases and hybrid search.',
      'Fine-tune open-weight models and orchestrate LLM agents using modern tool-calling paradigms.',
      'Collaborate with product and security teams to implement prompt injection defenses and guardrails.',
      'Benchmark latency, cost efficiency, and accuracy across Claude, Gemini, and local models.'
    ],
    requirements: [
      '3+ years experience developing Python-based AI applications and REST/gRPC microservices.',
      'Hands-on expertise with vector stores (Milvus, Pinecone, Qdrant) and retrieval-augmented generation.',
      'Proven understanding of transformer architectures, attention mechanisms, and token economics.',
      'Strong software engineering fundamentals with TypeScript, Docker, and cloud platforms (GCP/AWS).'
    ],
    skills: ['Python', 'LLMs', 'RAG', 'LangChain', 'FastAPI', 'Vector DBs', 'AWS'],
    matchScore: 94,
    source: 'LinkedIn',
    portal: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Generative+AI+Engineer+Anthropic+India',
    postedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  },
  {
    id: 'job-2',
    title: 'Senior Full-Stack AI Engineer',
    company: 'NeuralCraft Solutions',
    location: 'Remote · India',
    remoteType: 'remote',
    employmentType: 'full-time',
    salary: { min: 2800000, max: 4200000, currency: 'INR', period: 'year' },
    description: 'Lead the frontend and backend engineering for our next-generation AI workspace. You will build liquid-glass real-time interfaces in React 19 alongside robust Node/Python microservices.',
    responsibilities: [
      'Build futuristic, liquid-glass web experiences with sub-second streaming AI responses.',
      'Architect resilient backend services with Firebase, Cloud Functions, and Redis queues.',
      'Implement real-time collaboration features using WebSocket protocols and operational transforms.',
      'Mentor junior engineers and champion clean architecture and automated test coverage.'
    ],
    requirements: [
      '5+ years building production React / TypeScript web applications at scale.',
      'Proficiency with modern animation libraries (Motion/Framer), Tailwind CSS, and CSS token systems.',
      'Solid experience with Node.js, Firebase/Supabase, or PostgreSQL.',
      'Passion for developer experience, accessibility, and high Lighthouse performance benchmarks.'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS', 'Motion', 'Python'],
    matchScore: 91,
    source: 'LinkedIn',
    portal: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Senior+Full+Stack+AI+Engineer+Remote+India',
    postedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  },
  {
    id: 'job-3',
    title: 'Machine Learning Engineer — Agentic Systems',
    company: 'Cognitive Velocity',
    location: 'Hyderabad · Onsite',
    remoteType: 'onsite',
    employmentType: 'full-time',
    salary: { min: 2000000, max: 3200000, currency: 'INR', period: 'year' },
    description: 'Build autonomous agents capable of multi-step planning, tool interaction, and automated code synthesis for Fortune 500 digital transformations.',
    responsibilities: [
      'Design reliable state machines and feedback loops for self-healing AI agents.',
      'Integrate browser automation and API connectors into headless autonomous worker pools.',
      'Evaluate model safety, prevent hallucinations, and establish rigorous offline evaluation metrics.',
      'Partner with DevOps to containerize agents on Kubernetes with horizontal pod autoscaling.'
    ],
    requirements: [
      'Strong mathematical and algorithmic foundation with PyTorch, LangGraph, or CrewAI.',
      'Knowledge of browser automation engines (Playwright/Puppeteer) and headless runners.',
      'Experience with message brokers like Kafka, RabbitMQ, or Google Cloud Pub/Sub.',
      'B.Tech or M.Tech in Computer Science, AI, or related quantitative discipline.'
    ],
    skills: ['Python', 'PyTorch', 'LangGraph', 'Docker', 'Kubernetes', 'Playwright', 'FastAPI'],
    matchScore: 88,
    source: 'Naukri',
    portal: 'Naukri',
    sourceUrl: 'https://www.naukri.com/machine-learning-engineer-agentic-systems-jobs-in-hyderabad',
    postedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  },
  {
    id: 'job-4',
    title: 'Lead Frontend Systems Architect',
    company: 'Veloce AI Platform',
    location: 'Bangalore · Remote',
    remoteType: 'remote',
    employmentType: 'full-time',
    salary: { min: 3500000, max: 5000000, currency: 'INR', period: 'year' },
    description: 'Spearhead the design system, microfrontends, and client-side performance of our AI analytics SaaS platform serving over 2 million career seekers.',
    responsibilities: [
      'Develop modular component systems adhering to WCAG AAA accessibility and liquid glass aesthetics.',
      'Profile and optimize bundle sizes, Core Web Vitals, and client-side state caches.',
      'Guide technical roadmap for Web Workers, offline IndexedDB sync, and PWA capabilities.'
    ],
    requirements: [
      '7+ years in frontend software engineering with React, Next.js, or Vite.',
      'Mastery of modern CSS architecture, design tokens, and fluid layout paradigms.',
      'Deep understanding of browser rendering pipelines and memory optimization.'
    ],
    skills: ['React', 'TypeScript', 'Design Systems', 'Performance', 'PWA', 'Tailwind CSS'],
    matchScore: 86,
    source: 'LinkedIn',
    portal: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/search/?keywords=Lead+Frontend+Systems+Architect+Bangalore',
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  },
  {
    id: 'job-5',
    title: 'AI Product Engineer',
    company: 'CareerPulse Labs',
    location: 'Mumbai · Hybrid',
    remoteType: 'hybrid',
    employmentType: 'full-time',
    salary: { min: 1800000, max: 2600000, currency: 'INR', period: 'year' },
    description: 'Bridge the gap between AI capabilities and delighting end users. Rapidly prototype, validate, and ship resume intelligence and job matching features.',
    responsibilities: [
      'Implement AI resume scoring, ATS compliance diagnostics, and cover letter synthesis tools.',
      'Conduct user testing sessions to iterate on conversational and structured AI interactions.',
      'Track feature adoption, conversion funnels, and retention metrics via Firebase Analytics.'
    ],
    requirements: [
      '3+ years full-stack development experience with React, Node.js, and modern AI SDKs.',
      'Experience crafting intuitive UI/UX workflows with high attention to typography and spacing.',
      'Familiarity with ATS standards, PDF parsing, and prompt engineering techniques.'
    ],
    skills: ['React', 'Node.js', 'LLMs', 'Prompt Engineering', 'Product Design', 'Firebase'],
    matchScore: 83,
    source: 'Naukri',
    portal: 'Naukri',
    sourceUrl: 'https://www.naukri.com/ai-product-engineer-jobs-in-mumbai',
    postedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  },
  {
    id: 'job-6',
    title: 'Autonomous Applications DevOps Engineer',
    company: 'CloudAutomation Hub',
    location: 'Pune · Remote',
    remoteType: 'remote',
    employmentType: 'full-time',
    salary: { min: 2200000, max: 3400000, currency: 'INR', period: 'year' },
    description: 'Manage the infrastructure, security rules, and distributed queues executing verified candidate applications with strict security controls.',
    responsibilities: [
      'Maintain reliable cloud worker pools and rate limiting queues across multi-cloud infrastructure.',
      'Enforce zero-trust security postures, Firebase Security Rules, and KMS secret rotation.',
      'Establish real-time health telemetry, Prometheus metrics, and automated failure alerting.'
    ],
    requirements: [
      '4+ years DevOps / SRE experience managing Kubernetes, Terraform, and cloud functions.',
      'Deep familiarity with security standards, CAPTCHA avoidance policy, and MFA paused states.',
      'Proficiency with TypeScript/Python scripting and CI/CD pipelines (GitHub Actions).'
    ],
    skills: ['DevOps', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker', 'Security', 'GCP'],
    matchScore: 78,
    source: 'Indeed',
    portal: 'Indeed',
    sourceUrl: 'https://www.indeed.com/jobs?q=Autonomous+Applications+DevOps+Engineer&l=Pune',
    postedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    isVerified: true,
    isDemo: true
  }
];
