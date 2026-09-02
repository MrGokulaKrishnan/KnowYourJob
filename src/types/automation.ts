import { Timestamp, FieldValue } from 'firebase/firestore';

export interface AutomationSettings {
  userId: string;
  enabled: boolean;
  mode: 'manual' | 'assisted' | 'automated';
  dailyLimit: number;
  minimumMatchScore: number;
  preferredRoles: string[];
  preferredLocations: string[];
  excludedCompanies: string[];
  updatedAt: Timestamp | FieldValue;
}

export interface AutomationLog {
  id: string;
  userId: string;
  jobId: string;
  applicationId?: string;
  action: 'match_found' | 'resume_tailored' | 'application_drafted' | 'auto_submitted' | 'daily_limit_reached';
  status: 'success' | 'warning' | 'error' | 'skipped';
  message: string;
  timestamp: Timestamp | FieldValue;
}
