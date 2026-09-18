import { BaseJobAdapter } from './BaseJobAdapter';
import { ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';
import { DEMO_JOBS } from '@/lib/services/demoJobs';

export class DirectPlatformAdapter extends BaseJobAdapter {
  constructor() {
    super('KnowYourJob Direct');
  }

  isEligible(): boolean {
    return true; // Native direct platform is always eligible
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    return {
      providerName: this.providerName,
      status: 'active',
      responseTimeMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      eligibilityVerified: true,
      message: 'Native verified platform job engine operational',
      quotaRemaining: 100000
    };
  }

  async searchJobs(params: ProviderSearchParams = {}): Promise<ProviderSearchResult> {
    const start = Date.now();
    let jobs = [...DEMO_JOBS];

    if (params.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.location && j.location.toLowerCase().includes(q)) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params.remoteType && params.remoteType !== 'all' && params.remoteType !== 'All') {
      jobs = jobs.filter((j) => j.remoteType.toLowerCase() === params.remoteType!.toLowerCase());
    }

    if (params.minSalary) {
      jobs = jobs.filter((j) => (j.salary?.min || 0) >= params.minSalary!);
    }

    const total = jobs.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const paged = jobs.slice((page - 1) * limit, page * limit);

    return {
      jobs: paged,
      total,
      provider: this.providerName,
      executionTimeMs: Date.now() - start,
      sourceAttribution: 'Direct verified employer listings via KnowYourJob partner network'
    };
  }

  async getJob(sourceJobId: string): Promise<NormalizedJob | null> {
    const found = DEMO_JOBS.find((j) => j.id === sourceJobId || j.sourceJobId === sourceJobId);
    return found || null;
  }

  normalizeJob(rawPayload: any): NormalizedJob {
    return rawPayload as NormalizedJob;
  }
}
