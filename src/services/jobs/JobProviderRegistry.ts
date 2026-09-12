import { JobProvider, ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';
import { DirectPlatformAdapter } from './adapters/DirectPlatformAdapter';
import { LinkedInJobAdapter } from './adapters/LinkedInJobAdapter';
import { IndeedJobAdapter } from './adapters/IndeedJobAdapter';
import { NaukriJobAdapter } from './adapters/NaukriJobAdapter';
import { JobDataQualityPipeline } from './quality/JobDataQualityPipeline';

export class JobProviderRegistry {
  private static instance: JobProviderRegistry;
  private providers: Map<string, JobProvider> = new Map();

  private constructor() {
    this.registerProvider(new DirectPlatformAdapter());
    this.registerProvider(new LinkedInJobAdapter());
    this.registerProvider(new IndeedJobAdapter());
    this.registerProvider(new NaukriJobAdapter());
  }

  static getInstance(): JobProviderRegistry {
    if (!this.instance) {
      this.instance = new JobProviderRegistry();
    }
    return this.instance;
  }

  registerProvider(provider: JobProvider) {
    this.providers.set(provider.getProviderName().toLowerCase(), provider);
  }

  getProvider(name: string): JobProvider | undefined {
    return this.providers.get(name.toLowerCase());
  }

  getAllProviders(): JobProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Health checks across all registered providers
   */
  async runHealthChecks(): Promise<ProviderHealth[]> {
    const results: ProviderHealth[] = [];
    for (const provider of this.providers.values()) {
      try {
        const health = await provider.healthCheck();
        results.push(health);
      } catch (err: any) {
        results.push({
          providerName: provider.getProviderName(),
          status: 'degraded',
          responseTimeMs: 0,
          lastChecked: new Date().toISOString(),
          eligibilityVerified: false,
          message: err?.message || 'Health check probe timed out'
        });
      }
    }
    return results;
  }

  /**
   * Aggregates jobs across all eligible and active providers, passes them through the Data Quality Pipeline
   */
  async aggregateJobs(params: ProviderSearchParams = {}): Promise<{
    jobs: NormalizedJob[];
    total: number;
    providerReports: ProviderSearchResult[];
  }> {
    const providerReports: ProviderSearchResult[] = [];
    const rawJobs: NormalizedJob[] = [];

    // Run active providers in parallel with timeout safeguards
    const searchPromises = Array.from(this.providers.values()).map(async (provider) => {
      try {
        const result = await provider.searchJobs(params);
        providerReports.push(result);
        rawJobs.push(...result.jobs);
      } catch (err) {
        console.warn(`[JobProviderRegistry] Provider ${provider.getProviderName()} error:`, err);
      }
    });

    await Promise.all(searchPromises);

    // Pass through JobDataQualityPipeline (validation + 5-tier deduplication)
    const { validJobs } = JobDataQualityPipeline.processCatalog(rawJobs);

    return {
      jobs: validJobs,
      total: validJobs.length,
      providerReports
    };
  }
}

export const jobProviderRegistry = JobProviderRegistry.getInstance();
