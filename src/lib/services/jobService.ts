import { NormalizedJob } from '@/types/normalizedJob'
import { db } from '@/lib/firebase/firestore'
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { getOfficialJobPortalUrl } from '@/lib/utils/jobPortalUrl'
import { apifyJobService } from '@/services/jobs/apifyJobService'

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
]

export interface JobSearchParams {
  searchTerm?: string
  remoteType?: string[] | string
  employmentType?: string[] | string
  minSalary?: number
  minMatchScore?: number
  limit?: number
  page?: number
  portal?: string
  last24HoursOnly?: boolean
  onlyVerified?: boolean
  myPostedJobs?: boolean
  userId?: string
}

export interface PostJobInput {
  title: string
  company: string
  companyLogo?: string
  location: string
  remoteType: 'remote' | 'hybrid' | 'onsite'
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  salary: { min: number; max: number; currency: string; period: 'year' | 'month' | 'hour' }
  description: string
  responsibilities?: string[]
  requirements: string[]
  skills: string[]
  sourceUrl?: string
  portal?: string
}

export const jobService = {
  async searchJobs(params: JobSearchParams = {}): Promise<{ jobs: NormalizedJob[]; total: number }> {
    try {
      // 1. Fetch verified jobs from Apify (with 24-hour auto-refresh cycle)
      let verifiedJobs: NormalizedJob[] = []
      try {
        verifiedJobs = await apifyJobService.getVerifiedJobs()
      } catch (apifyErr) {
        console.warn('[jobService] Apify fetch note:', apifyErr)
        verifiedJobs = apifyJobService.getCachedJobs()
      }

      // 2. Fetch jobs from Firestore (includes user-posted jobs & verified database jobs)
      const jobsRef = collection(db, 'jobs')
      const snap = await getDocs(query(jobsRef, limit(params.limit || 50)))
      
      let firestoreJobs: NormalizedJob[] = []
      if (!snap.empty) {
        snap.forEach((d) => {
          firestoreJobs.push({ id: d.id, ...d.data() } as NormalizedJob)
        })
      }

      // 3. Merge: User-posted / Firestore jobs first, Verified Apify jobs, then Demo
      const jobMap = new Map<string, NormalizedJob>()
      firestoreJobs.forEach((j) => jobMap.set(j.id, j))
      verifiedJobs.forEach((j) => {
        if (!jobMap.has(j.id)) jobMap.set(j.id, j)
      })
      DEMO_JOBS.forEach((j) => {
        if (!jobMap.has(j.id)) jobMap.set(j.id, j)
      })

      // Normalize all external URLs through official portal redirect utility
      let allJobs = Array.from(jobMap.values()).map((j) => ({
        ...j,
        sourceUrl: getOfficialJobPortalUrl(j),
      }))

      // 4. Filter in memory for instantaneous responsive UI
      let filtered = allJobs

      // My Posted Jobs filter
      if (params.myPostedJobs && params.userId) {
        filtered = filtered.filter((j) => j.postedBy === params.userId)
      }

      // Portal source filter (LinkedIn, Naukri, Indeed, Direct Employer, All)
      if (params.portal && params.portal !== 'all' && params.portal !== 'All') {
        const pLower = params.portal.toLowerCase()
        filtered = filtered.filter((j) => (j.portal || j.source || '').toLowerCase().includes(pLower))
      }

      // Last 24 Hours filter
      if (params.last24HoursOnly) {
        const twentyFourHoursAgo = Date.now() - 24 * 3600 * 1000
        filtered = filtered.filter((j) => {
          const postedMs = new Date(j.postedAt).getTime()
          return !isNaN(postedMs) && postedMs >= twentyFourHoursAgo
        })
      }

      // Only Verified filter
      if (params.onlyVerified) {
        filtered = filtered.filter((j) => j.isVerified === true)
      }

      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(term) ||
            j.company.toLowerCase().includes(term) ||
            (j.location && j.location.toLowerCase().includes(term)) ||
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
      console.warn('[jobService] Falling back to offline jobs catalog:', e)
      const sanitizedDemo = DEMO_JOBS.map((j) => ({ ...j, sourceUrl: getOfficialJobPortalUrl(j) }))
      return { jobs: sanitizedDemo.slice(0, params.limit || 10), total: sanitizedDemo.length }
    }
  },

  /**
   * Forces a fresh scrape/sync of the verified job catalog via Apify.
   */
  async refreshVerifiedCatalog(): Promise<NormalizedJob[]> {
    return apifyJobService.extractVerifiedJobs({ last24HoursOnly: true })
  },

  /**
   * Gets Apify catalog synchronization and 24-hour cycle status.
   */
  getSyncStatus() {
    return apifyJobService.getSyncStatus()
  },

  async getJob(id: string): Promise<NormalizedJob | null> {
    try {
      const docRef = doc(db, 'jobs', id)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        const job = { id: snap.id, ...snap.data() } as NormalizedJob
        return { ...job, sourceUrl: getOfficialJobPortalUrl(job) }
      }
    } catch (e) {
      console.warn('[jobService] Firestore fetch error, checking demo jobs:', e)
    }
    const demo = DEMO_JOBS.find((j) => j.id === id) || DEMO_JOBS[0]
    return demo ? { ...demo, sourceUrl: getOfficialJobPortalUrl(demo) } : null
  },

  async getJobById(id: string): Promise<NormalizedJob | null> {
    return this.getJob(id)
  },

  async getSimilarJobs(jobId: string, skills: string[] = [], limitCount = 3): Promise<NormalizedJob[]> {
    try {
      const { jobs } = await this.searchJobs({ limit: 12 });
      const others = jobs.filter((j) => j.id !== jobId);
      if (!skills.length) return others.slice(0, limitCount);

      const scored = others.map((j) => {
        const overlap = j.skills.filter((s) =>
          skills.some((target) => target.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(target.toLowerCase()))
        ).length;
        return { job: j, overlap };
      });

      scored.sort((a, b) => b.overlap - a.overlap);
      return scored.slice(0, limitCount).map((s) => s.job);
    } catch {
      return DEMO_JOBS.filter((j) => j.id !== jobId).slice(0, limitCount);
    }
  },

  /**
   * Creates and publishes a new job listing to Firestore jobs collection.
   * Enables employers and users to post verified opportunities with real application links.
   */
  async postJob(input: PostJobInput, userId: string): Promise<NormalizedJob> {
    const newId = `direct-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const nowIso = new Date().toISOString()

    const officialUrl = input.sourceUrl && input.sourceUrl.startsWith('http') && !input.sourceUrl.includes('knowyourjob.ai')
      ? input.sourceUrl
      : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(input.title + ' ' + input.company)}`

    const newJob: NormalizedJob = {
      id: newId,
      title: input.title.trim(),
      company: input.company.trim(),
      companyLogo: input.companyLogo || undefined,
      location: input.location.trim(),
      remoteType: input.remoteType,
      employmentType: input.employmentType,
      salary: input.salary,
      description: input.description.trim(),
      responsibilities: input.responsibilities?.length ? input.responsibilities : [
        `Lead core technical initiatives and feature delivery for ${input.company}.`,
        'Collaborate across product and engineering teams to solve high-impact challenges.',
        'Champion quality, performance, and best engineering standards.'
      ],
      requirements: input.requirements?.length ? input.requirements : [
        `Hands-on proficiency with ${input.skills.slice(0, 3).join(', ')}.`,
        'Strong problem-solving capability and clear communication.',
        'Relevant industry experience or equivalent project portfolio.'
      ],
      skills: input.skills.length ? input.skills : ['Software Engineering', 'Problem Solving'],
      matchScore: 92,
      source: 'Direct Employer',
      portal: input.portal || 'Direct Employer',
      sourceUrl: officialUrl,
      postedAt: nowIso,
      isVerified: true,
      isDemo: false,
      postedBy: userId,
    }

    try {
      const docRef = doc(db, 'jobs', newId)
      await setDoc(docRef, {
        ...newJob,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.warn('[jobService] Could not persist job to Firestore, continuing with local state:', err)
    }

    return newJob
  },

  /**
   * Deletes a user-posted job.
   */
  async deletePostedJob(jobId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'jobs', jobId)
    await deleteDoc(docRef)
  },

  /**
   * Retrieves all jobs posted by the specified user.
   */
  async getUserPostedJobs(userId: string): Promise<NormalizedJob[]> {
    try {
      const jobsRef = collection(db, 'jobs')
      const q = query(jobsRef, where('postedBy', '==', userId), limit(30))
      const snap = await getDocs(q)
      const list: NormalizedJob[] = []
      snap.forEach((d) => {
        const item = { id: d.id, ...d.data() } as NormalizedJob
        list.push({ ...item, sourceUrl: getOfficialJobPortalUrl(item) })
      })
      return list
    } catch (e) {
      console.warn('[jobService] Failed to load user posted jobs:', e)
      return []
    }
  },

  async seedInitialJobsIfEmpty(): Promise<void> {
    // Seed initial demo jobs with genuine LinkedIn/Naukri URLs
    try {
      const jobsRef = collection(db, 'jobs')
      const snap = await getDocs(query(jobsRef, limit(1)))
      if (snap.empty) {
        for (const job of DEMO_JOBS) {
          const { id, ...data } = job
          await setDoc(doc(jobsRef, id), {
            ...data,
            sourceUrl: getOfficialJobPortalUrl(job),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      }
    } catch (e) {
      console.warn('[jobService] Seed error:', e)
    }
  }
}
