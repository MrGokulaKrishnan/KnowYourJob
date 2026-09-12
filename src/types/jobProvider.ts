import { NormalizedJob } from './normalizedJob';

export type ProviderStatus = 'active' | 'disabled' | 'requires_credentials' | 'rate_limited' | 'degraded';

export interface ProviderHealth {
  providerName: string;
  status: ProviderStatus;
  responseTimeMs: number;
  lastChecked: string;
  eligibilityVerified: boolean;
  message?: string;
  quotaRemaining?: number;
}

export interface ProviderSearchParams {
  searchTerm?: string;
  skills?: string[];
  location?: string;
  remoteType?: string;
  employmentType?: string;
  minSalary?: number;
  limit?: number;
  page?: number;
}

export interface ProviderSearchResult {
  jobs: NormalizedJob[];
  total: number;
  provider: string;
  executionTimeMs: number;
  sourceAttribution: string;
}

export interface JobProvider {
  /** Return human-readable provider name */
  getProviderName(): string;

  /** Health check including API availability and quota checks */
  healthCheck(): Promise<ProviderHealth>;

  /** Whether the provider has authorized credentials or partner access */
  isEligible(): boolean;

  /** Search jobs from this provider */
  searchJobs(params: ProviderSearchParams): Promise<ProviderSearchResult>;

  /** Fetch single job details */
  getJob(sourceJobId: string): Promise<NormalizedJob | null>;

  /** Normalize raw provider payload into unified NormalizedJob format */
  normalizeJob(rawPayload: any): NormalizedJob;
}
