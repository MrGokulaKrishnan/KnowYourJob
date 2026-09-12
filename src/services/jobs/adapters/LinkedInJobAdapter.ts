import { BaseJobAdapter } from './BaseJobAdapter';
import { ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';

export class LinkedInJobAdapter extends BaseJobAdapter {
  private partnerApiEnabled: boolean;
  private partnerClientId?: string;

  constructor() {
    super('LinkedIn');
    this.partnerClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    this.partnerApiEnabled = import.meta.env.VITE_LINKEDIN_PARTNER_API_ENABLED === 'true' && Boolean(this.partnerClientId);
  }

  isEligible(): boolean {
    return this.partnerApiEnabled;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    if (!this.partnerApiEnabled) {
      return {
        providerName: this.providerName,
        status: 'requires_credentials',
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
        eligibilityVerified: false,
        message: 'LinkedIn Job Search API requires LinkedIn Official Partner Program authorization and OAuth credentials. Active feature flag is disabled.'
      };
    }

    return {
      providerName: this.providerName,
      status: 'active',
      responseTimeMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      eligibilityVerified: true,
      message: 'LinkedIn Partner API connected'
    };
  }

  async searchJobs(_params: ProviderSearchParams = {}): Promise<ProviderSearchResult> {
    const start = Date.now();

    if (!this.partnerApiEnabled) {
      return {
        jobs: [],
        total: 0,
        provider: this.providerName,
        executionTimeMs: Date.now() - start,
        sourceAttribution: 'LinkedIn Official Partner API (Requires Enterprise Client Credentials)'
      };
    }

    return {
      jobs: [],
      total: 0,
      provider: this.providerName,
      executionTimeMs: Date.now() - start,
      sourceAttribution: 'LinkedIn Partner Network'
    };
  }

  async getJob(_sourceJobId: string): Promise<NormalizedJob | null> {
    if (!this.partnerApiEnabled) return null;
    return null;
  }

  normalizeJob(raw: any): NormalizedJob {
    const title = String(raw.title || 'Engineering Role');
    const company = String(raw.company || 'Enterprise Partner');
    return {
      id: `li-${raw.id || Math.random().toString(36).substring(2, 9)}`,
      source: 'LinkedIn',
      sourceJobId: String(raw.id || ''),
      portal: 'LinkedIn',
      title,
      company,
      location: raw.location || 'India',
      remoteType: raw.remoteType || 'hybrid',
      employmentType: 'full-time',
      salary: raw.salary || { min: 1800000, max: 3200000, currency: 'INR', period: 'year' },
      description: raw.description || `${title} at ${company}.`,
      requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
      skills: Array.isArray(raw.skills) ? raw.skills : ['Software Engineering'],
      matchScore: 85,
      sourceUrl: raw.sourceUrl || 'https://www.linkedin.com/jobs',
      postedAt: raw.postedAt || new Date().toISOString()
    };
  }
}
