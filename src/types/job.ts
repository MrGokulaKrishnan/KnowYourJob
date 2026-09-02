export * from './normalizedJob';
import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remoteType: 'Remote' | 'Hybrid' | 'Onsite';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'year' | 'hour' | 'month';
  };
  description: string;
  requirements: string[];
  skills: string[];
  source: string;
  sourceUrl: string;
  postedAt: Timestamp | FieldValue | string;
  createdAt: Timestamp | FieldValue;
}

export interface JobMatch {
  id: string;
  userId: string;
  jobId: string;
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  recommendedAt: Timestamp | FieldValue;
}

export interface JobFilterParams {
  searchTerm?: string;
  remoteType?: string;
  minSalary?: number;
  skills?: string[];
  limitCount?: number;
}
