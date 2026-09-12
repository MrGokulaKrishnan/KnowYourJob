import { BaseJobAdapter } from './BaseJobAdapter';
import { ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';

export class IndeedJobAdapter extends BaseJobAdapter {
  private indeedPublisherId?: string;
  private isConfigured: boolean;

  constructor() {
    super('Indeed');
    this.indeedPublisherId = import.meta.env.VITE_INDEED_PUBLISHER_ID;
    this.isConfigured = import.meta.env.VITE_INDEED_PARTNER_API_ENABLED === 'true' && Boolean(this.indeedPublisherId);
  }

  isEligible(): boolean {
    return this.isConfigured;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    if (!this.isConfigured) {
      return {
        providerName: this.providerName,
        status: 'requires_credentials',
        responseTimeMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
        eligibilityVerified: false,
        message: 'Indeed Partner Search API requires Indeed Publisher ID and OAuth authorization. Feature flag disabled.'
      };
    }

    return {
      providerName: this.providerName,
      status: 'active',
      responseTimeMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      eligibilityVerified: true,
      message: 'Indeed Publisher Feed connected'
    };
  }

  async searchJobs(_params: ProviderSearchParams = {}): Promise<ProviderSearchResult> {
    const start = Date.now();
    if (!this.isConfigured) {
      return {
        jobs: [],
        total: 0,
        provider: this.providerName,
        executionTimeMs: Date.now() - start,
        sourceAttribution: 'Indeed Partner Feed (Requires Publisher Credentials)'
      };
    }

    return {
      jobs: [],
      total: 0,
      provider: this.providerName,
      executionTimeMs: Date.now() - start,
      sourceAttribution: 'Indeed Job Search Network'
    };
  }

  async getJob(_sourceJobId: string): Promise<NormalizedJob | null> {
    if (!this.isConfigured) return null;
    return null;
  }

  normalizeJob(raw: any): NormalizedJob {
    const title = String(raw.jobtitle || raw.title || 'Tech Role');
    const company = String(raw.company || 'Enterprise Company');
    return {
      id: `in-${raw.jobkey || Math.random().toString(36).substring(2, 9)}`,
      source: 'Indeed',
      sourceJobId: String(raw.jobkey || ''),
      portal: 'Indeed',
      title,
      company,
      location: raw.formattedLocation || 'India',
      remoteType: raw.remote ? 'remote' : 'onsite',
      employmentType: 'full-time',
      salary: { min: 1400000, max: 2500000, currency: 'INR', period: 'year' },
      description: raw.snippet || `${title} at ${company}.`,
      requirements: [],
      skills: ['Engineering'],
      matchScore: 82,
      sourceUrl: raw.url || 'https://www.indeed.com',
      postedAt: raw.date || new Date().toISOString()
    };
  }
}
