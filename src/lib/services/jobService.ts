import { NormalizedJob } from '@/types/normalizedJob'
import { db } from '@/lib/firebase/firestore'
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, setDoc, serverTimestamp } from 'firebase/firestore'

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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-1',
    postedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-2',
    postedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-3',
    postedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-4',
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-5',
    postedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
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
    source: 'KnowYourJob Direct',
    sourceUrl: 'https://knowyourjob.ai/jobs/job-6',
    postedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    isDemo: true
  }
]

export interface JobSearchParams {
  searchTerm?: string
  remoteType?: string[] | string
  employmentType?: string[] | string
  minSalary?: number
  minMatchScore?: number
  limit?: number
  page?: number
}

export const jobService = {
  async searchJobs(params: JobSearchParams = {}): Promise<{ jobs: NormalizedJob[]; total: number }> {
    try {
      // Check if Firestore has real jobs first
      const jobsRef = collection(db, 'jobs')
      const snap = await getDocs(query(jobsRef, limit(params.limit || 20)))
      
      let allJobs: NormalizedJob[] = []
      if (!snap.empty) {
        snap.forEach((d) => {
          allJobs.push({ id: d.id, ...d.data() } as NormalizedJob)
        })
      } else {
        allJobs = [...DEMO_JOBS]
      }

      // Filter in memory for robust responsive UX
      let filtered = allJobs

      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(term) ||
            j.company.toLowerCase().includes(term) ||
            j.skills.some((s) => s.toLowerCase().includes(term))
        )
      }

      if (params.remoteType) {
        const remotes = Array.isArray(params.remoteType) ? params.remoteType : [params.remoteType]
        if (remotes.length > 0 && !remotes.includes('all') && !remotes.includes('All')) {
          filtered = filtered.filter((j) =>
            remotes.some((r) => r.toLowerCase() === j.remoteType.toLowerCase())
          )
        }
      }

      if (params.minMatchScore && params.minMatchScore > 0) {
        filtered = filtered.filter((j) => (j.matchScore || 0) >= params.minMatchScore!)
      }

      if (params.limit && params.limit > 0) {
        filtered = filtered.slice(0, params.limit)
      }

      return { jobs: filtered, total: filtered.length }
    } catch (e) {
      console.warn('[jobService] Falling back to offline demo jobs catalog:', e)
      return { jobs: DEMO_JOBS.slice(0, params.limit || 10), total: DEMO_JOBS.length }
    }
  },

  async getJob(id: string): Promise<NormalizedJob | null> {
    try {
      const docRef = doc(db, 'jobs', id)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as NormalizedJob
      }
    } catch (e) {
      console.warn('[jobService] Firestore fetch error, checking demo jobs:', e)
    }
    const demo = DEMO_JOBS.find((j) => j.id === id)
    return demo || DEMO_JOBS[0] || null
  },

  async getJobById(id: string): Promise<NormalizedJob | null> {
    return this.getJob(id)
  },

  async seedInitialJobsIfEmpty(): Promise<void> {
    try {
      const jobsRef = collection(db, 'jobs')
      const snap = await getDocs(query(jobsRef, limit(1)))
      if (snap.empty) {
        for (const job of DEMO_JOBS) {
          const { id, ...rest } = job
          await setDoc(doc(jobsRef, id), { ...rest, createdAt: serverTimestamp() })
        }
      }
    } catch (e) {
      console.warn('[jobService] Seeding skipped (offline/security):', e)
    }
  },

  /**
   * Returns up to `count` jobs that share skills with the given job,
   * sorted by number of overlapping skills (highest first).
   */
  async getSimilarJobs(currentJobId: string, skills: string[], count = 3): Promise<NormalizedJob[]> {
    try {
      const { jobs } = await this.searchJobs({})
      const lowerSkills = skills.map((s) => s.toLowerCase())
      return jobs
        .filter((j) => j.id !== currentJobId)
        .map((j) => ({
          job: j,
          overlap: j.skills.filter((s) => lowerSkills.includes(s.toLowerCase())).length,
        }))
        .filter(({ overlap }) => overlap > 0)
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, count)
        .map(({ job }) => job)
    } catch {
      return []
    }
  },
}

export default jobService

