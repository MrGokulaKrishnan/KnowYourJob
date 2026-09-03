import { getFunctions, httpsCallable } from 'firebase/functions'
import { doc, getDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/config'
import { db } from '@/lib/firebase/firestore'

const functions = getFunctions(app, 'us-central1')

// ── Type Definitions ──────────────────────────────────────────────────────────

export interface MatchScoreResult {
  overall: number
  skillsScore: number
  experienceScore: number
  educationScore: number
  locationScore: number
  matchedSkills: string[]
  missingSkills: string[]
  reasons: string[]
}

export interface CoverLetterResult {
  coverLetter: string
}

export interface UserCandidateProfile {
  skills: string[]
  experience: string
  displayName?: string
}

// ── User Profile Helper ───────────────────────────────────────────────────────

/**
 * Fetch user skills/experience from Firestore profiles collection.
 * Falls back to a generic AI/dev profile for demo purposes.
 */
export async function getUserCandidateProfile(uid: string): Promise<UserCandidateProfile> {
  try {
    const snap = await getDoc(doc(db, 'profiles', uid))
    if (snap.exists()) {
      const data = snap.data()
      return {
        skills: (data.skills as string[]) || [],
        experience: (data.summary as string) || (data.experience as string) || '',
        displayName: data.displayName as string | undefined,
      }
    }
  } catch {
    // ignore — use fallback
  }

  // Demo fallback profile
  return {
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Firebase', 'LLMs', 'REST APIs'],
    experience: '3+ years full-stack development with React, TypeScript, and cloud infrastructure.',
  }
}

// ── Cloud Function Callers ────────────────────────────────────────────────────

export const aiService = {
  /**
   * Call the calculateMatch Cloud Function to get AI-powered job-candidate match scores.
   */
  async calculateMatch(params: {
    candidateSkills: string[]
    candidateExperience: string
    jobTitle: string
    jobRequirements: string[]
    jobSkills: string[]
  }): Promise<MatchScoreResult> {
    const fn = httpsCallable<typeof params, MatchScoreResult>(functions, 'calculateMatch')
    const result = await fn(params)
    return result.data
  },

  /**
   * Call the generateCoverLetter Cloud Function.
   */
  async generateCoverLetter(params: {
    candidateProfile: Record<string, unknown>
    jobDetails: Record<string, unknown>
    tone?: string
  }): Promise<CoverLetterResult> {
    const fn = httpsCallable<typeof params, CoverLetterResult>(functions, 'generateCoverLetter')
    const result = await fn(params)
    return result.data
  },

  /**
   * Call the answerApplicationQuestion Cloud Function.
   */
  async answerApplicationQuestion(params: {
    question: string
    candidateProfile: Record<string, unknown>
  }): Promise<{ canAnswer: boolean; suggestedAnswer: string; confidence: string; reasoning: string }> {
    const fn = httpsCallable<typeof params, { canAnswer: boolean; suggestedAnswer: string; confidence: string; reasoning: string }>(
      functions,
      'answerApplicationQuestion'
    )
    const result = await fn(params)
    return result.data
  },
}

export default aiService
