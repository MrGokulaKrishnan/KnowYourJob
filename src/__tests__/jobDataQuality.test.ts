import { describe, it, expect } from 'vitest';
import { JobDataQualityPipeline } from '../services/jobs/quality/JobDataQualityPipeline';
import { NormalizedJob } from '../types/normalizedJob';

describe('JobDataQualityPipeline — Validation Gates', () => {
  it('rejects jobs with missing or too-short title', () => {
    const invalidJob = {
      title: 'A',
      company: 'Anthropic Labs',
      description: 'Engineering cutting-edge AI systems and agents.',
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('incomplete_fields');
    expect(result.reasons.some((r) => r.includes('Title'))).toBe(true);
  });

  it('rejects jobs with missing company name', () => {
    const invalidJob = {
      title: 'Generative AI Engineer',
      company: ' ',
      description: 'Building LLM workflows with LangChain and vector databases.',
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('incomplete_fields');
  });

  it('rejects jobs with empty or too-short description', () => {
    const invalidJob = {
      title: 'Senior MLOps Engineer',
      company: 'Veloce AI',
      description: 'Short text',
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('incomplete_fields');
  });

  it('rejects non-HTTP/HTTPS apply URLs', () => {
    const invalidJob = {
      title: 'LLM Systems Architect',
      company: 'NeuralCraft Solutions',
      description: 'Lead next-generation foundation model fine-tuning and inference optimizations.',
      applyUrl: 'javascript:alert("exploit")',
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('invalid_url');
  });

  it('flags impossible salary bounds (min > max)', () => {
    const invalidJob = {
      title: 'AI Research Scientist',
      company: 'Cognitive Velocity',
      description: 'Conduct foundational deep learning research on reasoning benchmarks.',
      salary: { min: 4500000, max: 2000000, currency: 'INR', period: 'year' as const },
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('impossible_salary');
  });

  it('flags negative salary values', () => {
    const invalidJob = {
      title: 'Python AI Developer',
      company: 'FastFlow Systems',
      description: 'Build backend pipelines using FastAPI, Redis, and PyTorch inference servers.',
      salary: { min: -50000, max: 1500000, currency: 'INR', period: 'year' as const },
    };
    const result = JobDataQualityPipeline.validate(invalidJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('impossible_salary');
  });

  it('detects fraudulent spam keywords in job content', () => {
    const spamJob = {
      title: 'Work from Home Earn $5000 a day without working',
      company: 'Instant Wealth Crypto',
      description: 'Wire transfer agent needed urgently. Telegram me @scammer for instant cash.',
    };
    const result = JobDataQualityPipeline.validate(spamJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('spam');
  });

  it('detects expired jobs based on expiresAt timestamp', () => {
    const expiredJob = {
      title: 'Computer Vision Specialist',
      company: 'Perception AI',
      description: 'Develop OpenCV and YOLO detection pipelines on embedded edge devices.',
      expiresAt: '2020-01-01T00:00:00Z',
    };
    const result = JobDataQualityPipeline.validate(expiredJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('stale');
  });

  it('passes a fully valid job record', () => {
    const validJob = {
      title: 'Generative AI Engineer',
      company: 'Anthropic Labs India',
      location: 'Bangalore · Hybrid',
      remoteType: 'hybrid' as const,
      employmentType: 'full-time' as const,
      salary: { min: 2400000, max: 3600000, currency: 'INR', period: 'year' as const },
      description: 'Design and deploy state-of-the-art LLM pipelines, RAG architectures, and agentic workflows.',
      requirements: ['3+ years Python experience', 'Expertise with vector databases'],
      skills: ['Python', 'LLMs', 'RAG', 'LangChain'],
      matchScore: 92,
      source: 'KnowYourJob Direct',
      sourceUrl: 'https://knowyourjob.web.app/jobs/demo-1',
      postedAt: new Date().toISOString(),
    };
    const result = JobDataQualityPipeline.validate(validJob);
    expect(result.isValid).toBe(true);
    expect(result.reasons.length).toBe(0);
  });
});

describe('JobDataQualityPipeline — 5-Tier Deduplication', () => {
  const createJob = (overrides: Partial<NormalizedJob> = {}): NormalizedJob => ({
    id: 'job-1',
    title: 'Generative AI Engineer',
    company: 'Anthropic Labs India',
    location: 'Bangalore · Hybrid',
    remoteType: 'hybrid',
    employmentType: 'full-time',
    salary: { min: 2400000, max: 3600000, currency: 'INR', period: 'year' },
    description: 'Design and deploy state-of-the-art LLM pipelines and autonomous agent frameworks.',
    requirements: ['Python', 'PyTorch'],
    skills: ['Python', 'LLMs', 'RAG'],
    matchScore: 94,
    source: 'Direct Platform',
    sourceUrl: 'https://knowyourjob.web.app/jobs/job-1',
    postedAt: new Date().toISOString(),
    ...overrides,
  });

  it('deduplicates jobs by provider + sourceJobId', () => {
    const jobA = createJob({ id: 'job-1' });
    const duplicate = createJob({ id: 'job-1' });
    const { validJobs, report } = JobDataQualityPipeline.processCatalog([jobA, duplicate]);
    expect(validJobs.length).toBe(1);
    expect(report.totalDuplicates).toBe(1);
  });

  it('deduplicates jobs by normalized apply URL (stripping tracking parameters)', () => {
    const jobA = createJob({ id: 'job-a', applyUrl: 'https://careers.example.com/apply/123?utm_source=linkedin&utm_medium=cpc' });
    const jobB = createJob({ id: 'job-b', applyUrl: 'https://careers.example.com/apply/123?ref=jobboard&trk=feed' });

    const { validJobs, report } = JobDataQualityPipeline.processCatalog([jobA, jobB]);
    expect(validJobs.length).toBe(1);
    expect(report.totalDuplicates).toBe(1);
  });

  it('deduplicates jobs by company + normalized title + location', () => {
    const jobA = createJob({ id: 'job-comp-1', title: 'Generative AI Engineer' });
    const jobB = createJob({ id: 'job-comp-2', title: 'generative  ai   engineer' }); // whitespace & case variant

    const { validJobs, report } = JobDataQualityPipeline.processCatalog([jobA, jobB]);
    expect(validJobs.length).toBe(1);
    expect(report.totalDuplicates).toBe(1);
  });

  it('preserves genuinely distinct jobs with different companies or locations', () => {
    const jobBangalore = createJob({ id: 'job-blr', company: 'Company A', location: 'Bangalore' });
    const jobHyderabad = createJob({ id: 'job-hyd', company: 'Company A', location: 'Hyderabad' });
    const jobDifferentCompany = createJob({ id: 'job-diff', company: 'Company B', location: 'Bangalore' });

    const { validJobs, report } = JobDataQualityPipeline.processCatalog([jobBangalore, jobHyderabad, jobDifferentCompany]);
    expect(validJobs.length).toBe(3);
    expect(report.totalDuplicates).toBe(0);
  });
});
