// NormalizedJob
export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'year' | 'month' | 'hour';
  };
  salaryRange?: {
    min: number;
    max: number;
    currency?: string;
  };
  description: string;
  responsibilities?: string[];
  requirements: string[];
  skills: string[];
  benefits?: string[];
  matchScore: number;
  source: string;
  sourceUrl: string;
  postedAt: string;
  isDemo?: boolean;
  portal?: 'LinkedIn' | 'Naukri' | 'Indeed' | 'Direct' | string;
  isVerified?: boolean;
  scrapedAt?: string;
  applyUrl?: string;
  metadata?: Record<string, unknown>;
}

import { Timestamp, FieldValue } from 'firebase/firestore';

export interface JobPreferences {
  userId: string;
  roles: string[];
  locations: string[];
  remoteType: 'remote' | 'hybrid' | 'onsite' | 'any';
  minSalary: number | null;
  maxSalary: number | null;
  employmentTypes: ('full-time' | 'contract' | 'part-time' | 'internship')[];
  excludedCompanies: string[];
  skills: string[];
  updatedAt: Timestamp | FieldValue;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  downloadUrl?: string;
  isPrimary: boolean;
  analysisStatus: 'pending' | 'analyzed' | 'failed';
  atsScore?: number;
  uploadedAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface ResumeSuggestion {
  type: 'improvement' | 'addition' | 'removal' | 'rewrite';
  section: string;
  original?: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ResumeAnalysis {
  atsScore: number;
  readabilityScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: ResumeSuggestion[];
  summary: string;
}

export interface MatchScore {
  overall: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  locationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export interface CoverLetterRequest {
  tone: 'professional' | 'enthusiastic' | 'concise';
  emphasis?: string;
  wordLimit?: number;
}
