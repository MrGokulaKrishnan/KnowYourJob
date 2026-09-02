import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryDocumentSnapshot,
  DocumentData,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase/firestore';
import { Job, JobFilterParams } from '../../types/job';

const JOBS_COLLECTION = 'jobs';

export const jobService = {
  async getJobs(params: JobFilterParams = {}, lastVisibleDoc?: QueryDocumentSnapshot<DocumentData>) {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const constraints: any[] = [];

    if (params.remoteType && params.remoteType !== 'All') {
      constraints.push(where('remoteType', '==', params.remoteType));
    }

    constraints.push(orderBy('postedAt', 'desc'));

    if (lastVisibleDoc) {
      constraints.push(startAfter(lastVisibleDoc));
    }

    const pageSize = params.limitCount || 10;
    constraints.push(limit(pageSize));

    const q = query(jobsRef, ...constraints);
    const snapshot = await getDocs(q);

    const jobs: Job[] = [];
    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { jobs, lastDoc, hasMore: jobs.length === pageSize };
  },

  async getJobById(jobId: string): Promise<Job | null> {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const snap = await getDoc(jobRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Job;
  },

  // Seed default demonstration jobs if collection is completely fresh
  async seedInitialJobsIfEmpty(): Promise<void> {
    try {
      const jobsRef = collection(db, JOBS_COLLECTION);
      const q = query(jobsRef, limit(1));
      const snap = await getDocs(q);
      if (snap.empty) {
        const demoJobs: Omit<Job, 'id'>[] = [
          {
            title: 'Senior Full-Stack AI Engineer',
            company: 'Anthropic & Cohere Ecosystems',
            location: 'San Francisco, CA',
            remoteType: 'Remote',
            employmentType: 'Full-time',
            salary: { min: 180000, max: 240000, currency: 'USD', period: 'year' },
            description: 'Lead modern AI interface and agentic workflow application architecture utilizing React, Next.js, and LLM backends.',
            requirements: ['5+ years React & TypeScript', 'Experience integrating LLMs', 'Deep knowledge of distributed systems'],
            skills: ['React', 'TypeScript', 'Firebase', 'Python', 'LLM Agents'],
            source: 'Direct Platform',
            sourceUrl: 'https://knowyourjob.ai/jobs/demo-1',
            postedAt: new Date().toISOString(),
            createdAt: serverTimestamp(),
          },
          {
            title: 'Lead Frontend Systems Architect',
            company: 'Vercel / Next Technologies',
            location: 'New York, NY',
            remoteType: 'Hybrid',
            employmentType: 'Full-time',
            salary: { min: 170000, max: 215000, currency: 'USD', period: 'year' },
            description: 'Spearhead liquid glass design systems, performance monitoring, and real-time state synchronization.',
            requirements: ['Expert in CSS modern glassmorphism', 'Deep React 19 architecture knowledge', 'State caching and offline engines'],
            skills: ['React 19', 'Tailwind CSS', 'Vite', 'UI/UX Architecture'],
            source: 'Direct Platform',
            sourceUrl: 'https://knowyourjob.ai/jobs/demo-2',
            postedAt: new Date().toISOString(),
            createdAt: serverTimestamp(),
          },
          {
            title: 'Autonomous Workflow & DevOps Engineer',
            company: 'CloudFlow Autonomous Tech',
            location: 'Austin, TX',
            remoteType: 'Remote',
            employmentType: 'Full-time',
            salary: { min: 160000, max: 195000, currency: 'USD', period: 'year' },
            description: 'Build robust background job orchestrators, headless automation runners, and event-driven architectures.',
            requirements: ['Experience with cloud task runners', 'Strong TypeScript and Node skills', 'Security rule authoring'],
            skills: ['Node.js', 'Docker', 'Firebase Cloud Functions', 'TypeScript'],
            source: 'Direct Platform',
            sourceUrl: 'https://knowyourjob.ai/jobs/demo-3',
            postedAt: new Date().toISOString(),
            createdAt: serverTimestamp(),
          }
        ];

        for (let i = 0; i < demoJobs.length; i++) {
          await setDoc(doc(jobsRef, `demo-job-${i + 1}`), demoJobs[i]);
        }
      }
    } catch (e) {
      console.warn('Initial jobs seeding skipped (rules or network):', e);
    }
  }
};
