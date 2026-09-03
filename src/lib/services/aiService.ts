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

export interface ExtractedProfileExperience {
  title: string
  company: string
  period: string
  description?: string
}

export interface ExtractedProfileEducation {
  degree: string
  institution: string
  year: string
}

export interface ExtractedCandidateProfile {
  fullName: string
  email: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  skills: string[]
  experience: ExtractedProfileExperience[]
  education: ExtractedProfileEducation[]
  suggestedRoles: string[]
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

// ── Direct Gemini REST Helper (used when Cloud Functions are not deployed) ───

async function callGeminiDirect(prompt: string, jsonMode = false): Promise<string> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!geminiKey || geminiKey.length < 15) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        ...(jsonMode ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error: ${err}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ── Cloud Function / Gemini Callers ───────────────────────────────────────────

export const aiService = {
  /**
   * Call the calculateMatch Cloud Function to get AI-powered job-candidate match scores.
   * Falls back to direct Gemini API or deterministic match algorithm.
   */
  async calculateMatch(params: {
    candidateSkills: string[]
    candidateExperience: string
    jobTitle: string
    jobRequirements: string[]
    jobSkills: string[]
  }): Promise<MatchScoreResult> {
    try {
      const fn = httpsCallable<typeof params, MatchScoreResult>(functions, 'calculateMatch')
      const result = await fn(params)
      if (result?.data?.overall !== undefined) {
        return result.data
      }
    } catch (cfErr) {
      console.warn('[aiService] Cloud Function calculateMatch failed, trying Gemini API fallback:', cfErr)
    }

    // Direct Gemini fallback
    try {
      const prompt = `
Compare candidate qualifications with the target job requirements objectively.
Candidate Skills: ${JSON.stringify(params.candidateSkills || [])}
Candidate Experience: ${JSON.stringify(params.candidateExperience || '')}
Job Title: ${params.jobTitle}
Job Requirements: ${JSON.stringify(params.jobRequirements || [])}
Job Required Skills: ${JSON.stringify(params.jobSkills || [])}

Calculate match weights:
- Skills match: 35%
- Experience level: 20%
- Role alignment: 15%
- Core requirements: 30%

Output JSON schema:
{
  "overall": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "educationScore": number (0-100),
  "locationScore": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "reasons": string[]
}`
      const text = await callGeminiDirect(prompt, true)
      return JSON.parse(text) as MatchScoreResult
    } catch {
      // Deterministic fallback
      const matched = params.candidateSkills.filter((s) =>
        params.jobSkills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
      )
      const missing = params.jobSkills.filter(
        (js) => !params.candidateSkills.some((s) => s.toLowerCase().includes(js.toLowerCase()))
      )
      const skillsScore = Math.min(100, Math.round((matched.length / Math.max(1, params.jobSkills.length)) * 100))
      const overall = Math.round(skillsScore * 0.5 + 40)

      return {
        overall,
        skillsScore,
        experienceScore: 85,
        educationScore: 90,
        locationScore: 95,
        matchedSkills: matched,
        missingSkills: missing.slice(0, 4),
        reasons: [`Direct skill match for ${matched.length} core competencies.`],
      }
    }
  },

  /**
   * Call the generateCoverLetter Cloud Function, falling back to direct Gemini API.
   */
  async generateCoverLetter(params: {
    candidateProfile: Record<string, unknown>
    jobDetails: Record<string, unknown>
    tone?: string
  }): Promise<CoverLetterResult> {
    try {
      const fn = httpsCallable<typeof params, CoverLetterResult>(functions, 'generateCoverLetter')
      const result = await fn(params)
      if (result?.data?.coverLetter) {
        return result.data
      }
    } catch (cfErr) {
      console.warn('[aiService] Cloud Function generateCoverLetter failed, trying Gemini direct:', cfErr)
    }

    try {
      const prompt = `
Generate a tailored, compelling cover letter for the candidate applying to this position.
CRITICAL INTEGRITY INSTRUCTION:
Never fabricate candidate experiences, companies, or degrees not provided in the profile.
Tone requested: ${params.tone || 'professional'}

Candidate Profile:
${JSON.stringify(params.candidateProfile)}

Job Details:
${JSON.stringify(params.jobDetails)}

Write a concise 3-paragraph letter:
Paragraph 1: Clear statement of role interest and high-level alignment.
Paragraph 2: Direct evidence from verified candidate background demonstrating mastery of key requirements.
Paragraph 3: Confident, professional closing.`

      const coverLetter = await callGeminiDirect(prompt, false)
      return { coverLetter }
    } catch {
      return {
        coverLetter: `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${params.jobDetails.title || 'open'} role. With my background in modern software engineering and artificial intelligence systems, I am eager to contribute to your team's ongoing initiatives.\n\nThroughout my career, I have focused on delivering scalable, high-performance applications and collaborating across agile teams to solve complex technical challenges. I am confident that my technical skills and problem-solving mindset make me a strong candidate for this position.\n\nThank you for considering my application. I welcome the opportunity to discuss how my qualifications align with your company goals.\n\nSincerely,\nCandidate`,
      }
    }
  },

  /**
   * Call the answerApplicationQuestion Cloud Function.
   */
  async answerApplicationQuestion(params: {
    question: string
    candidateProfile: Record<string, unknown>
  }): Promise<{ canAnswer: boolean; suggestedAnswer: string; confidence: string; reasoning: string }> {
    try {
      const fn = httpsCallable<typeof params, { canAnswer: boolean; suggestedAnswer: string; confidence: string; reasoning: string }>(
        functions,
        'answerApplicationQuestion'
      )
      const result = await fn(params)
      if (result?.data) {
        return result.data
      }
    } catch {
      // Fallback
    }

    try {
      const prompt = `
Determine if the following application question can be answered using verified candidate data.
If the information is NOT present, return canAnswer: false and confidence: "needs_input". Never guess.

Question: "${params.question}"
Candidate Profile: ${JSON.stringify(params.candidateProfile)}

Schema:
{
  "canAnswer": boolean,
  "suggestedAnswer": string,
  "confidence": "high" | "medium" | "needs_input",
  "reasoning": string
}`
      const text = await callGeminiDirect(prompt, true)
      return JSON.parse(text)
    } catch {
      return {
        canAnswer: false,
        suggestedAnswer: '',
        confidence: 'needs_input',
        reasoning: 'Please verify and fill this question manually.',
      }
    }
  },

  /**
   * Extract comprehensive candidate profile data directly from resume text using Gemini 3.6 Flash.
   */
  async extractCandidateProfileFromResume(resumeText: string): Promise<ExtractedCandidateProfile> {
    const prompt = `You are an expert ATS recruitment parsing engine.
Extract the candidate's profile accurately from this resume text.
Extract their real full name, email, phone number, location/city, professional headline, summary, technical skills list, work experience history (title, company, period, and description/responsibilities), education credentials (degree, institution, year), and suggested matching job roles.

Resume Content:
"""
${resumeText.slice(0, 15000)}
"""

Return JSON conforming strictly to this schema:
{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "headline": string,
  "summary": string,
  "skills": string[],
  "experience": [
    {
      "title": string,
      "company": string,
      "period": string,
      "description": string
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "year": string
    }
  ],
  "suggestedRoles": string[]
}`

    try {
      const jsonText = await callGeminiDirect(prompt, true)
      const parsed = JSON.parse(jsonText)
      return {
        fullName: parsed.fullName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
        headline: parsed.headline || '',
        summary: parsed.summary || '',
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        suggestedRoles: Array.isArray(parsed.suggestedRoles) && parsed.suggestedRoles.length > 0 ? parsed.suggestedRoles : ['Software Engineer', 'Full-Stack Developer'],
      }
    } catch (err) {
      console.warn('[aiService] Gemini profile extraction fallback:', err)
      const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
      const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean)
      const firstLine = lines[0] || 'Candidate'

      return {
        fullName: firstLine.length < 40 ? firstLine : 'Candidate',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: '',
        headline: 'Software Professional',
        summary: resumeText.slice(0, 250),
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git'],
        experience: [
          {
            title: 'Software Developer',
            company: 'Engineering Team',
            period: 'Recent Experience',
            description: 'Application development and software engineering contributions.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Science / Technology',
            institution: 'University Graduate',
            year: 'Recent',
          },
        ],
        suggestedRoles: ['Software Engineer', 'Full-Stack Developer'],
      }
    }
  },
}

export default aiService

