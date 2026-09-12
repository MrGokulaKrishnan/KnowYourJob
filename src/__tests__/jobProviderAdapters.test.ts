import { describe, it, expect } from 'vitest';
import { DirectPlatformAdapter } from '../services/jobs/adapters/DirectPlatformAdapter';
import { LinkedInJobAdapter } from '../services/jobs/adapters/LinkedInJobAdapter';
import { IndeedJobAdapter } from '../services/jobs/adapters/IndeedJobAdapter';
import { NaukriJobAdapter } from '../services/jobs/adapters/NaukriJobAdapter';
import { JobProviderRegistry } from '../services/jobs/JobProviderRegistry';

describe('DirectPlatformAdapter', () => {
  const adapter = new DirectPlatformAdapter();

  it('reports active and eligible status', async () => {
    expect(adapter.isEligible()).toBe(true);
    const health = await adapter.healthCheck();
    expect(health.status).toBe('active');
    expect(health.eligibilityVerified).toBe(true);
  });

  it('searches jobs by keyword with pagination and execution metrics', async () => {
    const result = await adapter.searchJobs({ searchTerm: 'Generative', limit: 5 });
    expect(result.jobs.length).toBeGreaterThan(0);
    expect(result.provider).toBe('KnowYourJob Direct');
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    expect(result.jobs[0].title.toLowerCase()).toContain('generative');
  });

  it('filters jobs by remoteType', async () => {
    const result = await adapter.searchJobs({ remoteType: 'remote' });
    expect(result.jobs.every((j) => j.remoteType === 'remote')).toBe(true);
  });

  it('filters jobs by minimum salary threshold in INR', async () => {
    const result = await adapter.searchJobs({ minSalary: 3000000 });
    expect(result.jobs.every((j) => (j.salary?.min || 0) >= 3000000)).toBe(true);
  });
});

describe('LinkedInJobAdapter — Partner Compliance Boundaries', () => {
  const adapter = new LinkedInJobAdapter();

  it('defensively flags requires_credentials when official partner flag is disabled', async () => {
    // In test environment without VITE_LINKEDIN_PARTNER_API_ENABLED
    const health = await adapter.healthCheck();
    expect(health.status).toBe('requires_credentials');
    expect(health.eligibilityVerified).toBe(false);
    expect(health.message).toContain('Official Partner Program');
  });

  it('does NOT perform unauthorized scraping when credentials are absent', async () => {
    const result = await adapter.searchJobs({ searchTerm: 'Engineer' });
    expect(result.jobs).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.sourceAttribution).toContain('Requires Enterprise Client Credentials');
  });
});

describe('IndeedJobAdapter & NaukriJobAdapter — Compliance Boundaries', () => {
  it('Indeed adapter requires publisher authentication', async () => {
    const adapter = new IndeedJobAdapter();
    const health = await adapter.healthCheck();
    expect(health.status).toBe('requires_credentials');
    expect(health.eligibilityVerified).toBe(false);
  });

  it('Naukri adapter enforces official enterprise feed flag', async () => {
    const adapter = new NaukriJobAdapter();
    const health = await adapter.healthCheck();
    expect(health.status).toBe('requires_credentials');
    expect(health.message).toContain('Direct scraping is prohibited');
  });
});

describe('JobProviderRegistry — Multi-Source Aggregator', () => {
  const registry = JobProviderRegistry.getInstance();

  it('registers all 4 standard core adapters', () => {
    const providers = registry.getAllProviders();
    expect(providers.length).toBeGreaterThanOrEqual(4);
    const names = providers.map((p) => p.getProviderName().toLowerCase());
    expect(names).toContain('knowyourjob direct');
    expect(names).toContain('linkedin');
    expect(names).toContain('indeed');
    expect(names).toContain('naukri');
  });

  it('executes health checks across all providers simultaneously without throwing', async () => {
    const healthChecks = await registry.runHealthChecks();
    expect(healthChecks.length).toBeGreaterThanOrEqual(4);
    expect(healthChecks.some((h) => h.providerName === 'KnowYourJob Direct')).toBe(true);
  });

  it('aggregates jobs and returns validated deduplicated results', async () => {
    const result = await registry.aggregateJobs({ searchTerm: 'AI' });
    expect(result.jobs.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.jobs.length);
    expect(result.providerReports.length).toBeGreaterThan(0);
  });
});
