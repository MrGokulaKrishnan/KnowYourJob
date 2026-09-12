import { JobProvider, ProviderHealth, ProviderSearchParams, ProviderSearchResult } from '@/types/jobProvider';
import { NormalizedJob } from '@/types/normalizedJob';

export abstract class BaseJobAdapter implements JobProvider {
  protected providerName: string;
  protected maxRetries = 2;
  protected timeoutMs = 8000;

  constructor(providerName: string) {
    this.providerName = providerName;
  }

  getProviderName(): string {
    return this.providerName;
  }

  abstract isEligible(): boolean;
  abstract healthCheck(): Promise<ProviderHealth>;
  abstract searchJobs(params: ProviderSearchParams): Promise<ProviderSearchResult>;
  abstract getJob(sourceJobId: string): Promise<NormalizedJob | null>;
  abstract normalizeJob(rawPayload: any): NormalizedJob;

  /**
   * Safe fetch with retry, exponential backoff, and strict timeout
   */
  protected async fetchWithBackoff(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: any = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        return response;
      } catch (err: any) {
        lastError = err;
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 500;
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
    throw lastError || new Error(`Network request failed after ${this.maxRetries} retries`);
  }
}
