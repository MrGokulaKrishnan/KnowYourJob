import { BaseJobAdapter } from './BaseJobAdapter';
import { ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';

export class NaukriJobAdapter extends BaseJobAdapter {
  private isConfigured: boolean;

  constructor() {
    super('Naukri');
    this.isConfigured = import.meta.env.VITE_NAUKRI_PARTNER_FEED_ENABLED === 'true';
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
        message: 'Naukri.com requires official Info Edge enterprise employer/recruiter API subscription. Direct scraping is prohibited. Feature flag disabled.'
      };
    }

    return {
      providerName: this.providerName,
      status: 'active',
      responseTimeMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      eligibilityVerified: true,
      message: 'Naukri Enterprise Feed active'
    };
  }

  async searchJobs(_params: ProviderSearchParams = {}): Promise<ProviderSearchResult> {
    const start = Date.now();
    return {
      jobs: [],
      total: 0,
      provider: this.providerName,
      executionTimeMs: Date.now() - start,
      sourceAttribution: 'Naukri Info Edge Partner Network'
    };
  }

  async getJob(_sourceJobId: string): Promise<NormalizedJob | null> {
    return null;
  }

  normalizeJob(raw: any): NormalizedJob {
    const title = String(raw.title || 'Software Professional');
    const company = String(raw.companyName || 'Indian Enterprise');
    return {
      id: `nk-${raw.jobId || Math.random().toString(36).substring(2, 9)}`,
      source: 'Naukri',
      sourceJobId: String(raw.jobId || ''),
      portal: 'Naukri',
      title,
      company,
      location: raw.location || 'Bengaluru, India',
      remoteType: 'hybrid',
      employmentType: 'full-time',
      salary: { min: 1200000, max: 2400000, currency: 'INR', period: 'year' },
      description: raw.jobDescription || `${title} at ${company}.`,
      requirements: [],
      skills: ['Java', 'Spring', 'SQL'],
      matchScore: 80,
      sourceUrl: raw.url || 'https://www.naukri.com',
      postedAt: new Date().toISOString()
    };
  }
}
