import { Timestamp, FieldValue } from 'firebase/firestore';

export type ApplicationStatus = 
  | 'saved'
  | 'prepared'
  | 'pending_review'
  | 'applied'
  | 'viewed'
  | 'recruiter_contacted'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'failed';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  company: string;
  jobTitle: string;
  location?: string;
  source: string;
  sourceUrl: string;
  matchScore: number;
  status: ApplicationStatus;
  resumeId?: string;
  coverLetterId?: string;
  automationMode: 'manual' | 'assisted' | 'automated';
  appliedAt?: Timestamp | FieldValue | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  notes?: string;
}
