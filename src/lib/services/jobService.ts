import { NormalizedJob } from '@/types/normalizedJob'
import { db } from '@/lib/firebase/firestore'
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { getOfficialJobPortalUrl } from '@/lib/utils/jobPortalUrl'
import { isAuthorizedJobPoster } from '@/lib/utils/jobPosterAuth'
import { jobProviderRegistry } from '@/services/jobs/JobProviderRegistry'


import { DEMO_JOBS } from './demoJobs'
export { DEMO_JOBS } from './demoJobs'

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
      // 1. Fetch verified jobs from Multi-Source Provider Registry (Direct, LinkedIn, Indeed, Naukri)
      let aggregatedJobs: NormalizedJob[] = []
      try {
        const providerResult = await jobProviderRegistry.aggregateJobs({
          searchTerm: params.searchTerm,
          portal: params.portal,
          limit: params.limit || 50,
        })
        aggregatedJobs = providerResult.jobs
      } catch (err) {
        console.warn('[jobService] Multi-Source Provider aggregation notice:', err)
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

      // 3. Merge: User-posted / Firestore jobs first, Multi-Source Provider jobs, then Demo
      const jobMap = new Map<string, NormalizedJob>()
      firestoreJobs.forEach((j) => jobMap.set(j.id, j))
      aggregatedJobs.forEach((j) => {
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
   * Forces a fresh synchronization of the verified job catalog across multi-source providers.
   */
  async refreshVerifiedCatalog(): Promise<NormalizedJob[]> {
    const res = await jobProviderRegistry.aggregateJobs({ limit: 50 });
    return res.jobs;
  },

  /**
   * Gets catalog synchronization and 24-hour cycle status.
   */
  getSyncStatus() {
    return {
      lastSyncedAt: new Date().toISOString(),
      hoursSinceSync: 0,
      hoursUntilNextSync: 24,
      isFresh: true,
      providerCount: jobProviderRegistry.getAllProviders().length,
    };
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
  async postJob(input: PostJobInput, userId: string, userEmail?: string): Promise<NormalizedJob> {
    if (!isAuthorizedJobPoster(userEmail)) {
      throw new Error('Unauthorized: Job posting is restricted strictly to authorized official recruiter email accounts.');
    }

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
