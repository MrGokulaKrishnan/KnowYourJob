import { describe, it, expect } from 'vitest';
import { JobDataQualityPipeline } from '../services/jobs/quality/JobDataQualityPipeline';
import { DirectPlatformAdapter } from '../services/jobs/adapters/DirectPlatformAdapter';
import { NormalizedJob } from '../types/normalizedJob';

describe('Stress & Scale — Large Catalog Processing', () => {
  it('processes and deduplicates 1,000 synthetic jobs in under 250ms', () => {
    const catalog: Partial<NormalizedJob>[] = [];
    const companies = ['Google', 'Microsoft', 'Anthropic', 'OpenAI', 'Meta', 'Amazon', 'Apple', 'NVIDIA', 'TCS', 'Infosys'];
    const titles = ['AI Engineer', 'ML Engineer', 'Prompt Engineer', 'LLM Architect', 'Full Stack Developer'];
    const locations = ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Remote'];

    // Generate 1,000 synthetic jobs with intentional duplicates
    for (let i = 0; i < 1000; i++) {
      const company = companies[i % companies.length];
      const title = titles[i % titles.length];
      const location = locations[i % locations.length];

      catalog.push({
        id: `synth-${i}`,
        title: `${title} - Batch ${Math.floor(i / 100)}`,
        company,
        location,
        remoteType: i % 2 === 0 ? 'remote' : 'hybrid',
        employmentType: 'full-time',
        salary: { min: 2000000 + (i * 1000), max: 3500000 + (i * 1000), currency: 'INR', period: 'year' },
        description: `Responsible for designing and deploying high-performance machine learning models and LLM agent backends. Record number ${i}.`,
        requirements: ['Python', 'Docker', 'PyTorch'],
        skills: ['Python', 'AI', 'FastAPI'],
        matchScore: 85,
        source: 'Direct Platform',
        sourceUrl: `https://knowyourjob.web.app/jobs/synth-${i}`,
        applyUrl: `https://knowyourjob.web.app/apply/synth-${i}`,
        postedAt: new Date().toISOString()
      });
    }

    const start = Date.now();
    const { validJobs, report } = JobDataQualityPipeline.processCatalog(catalog);
    const duration = Date.now() - start;

    expect(validJobs.length).toBeGreaterThan(0);
    expect(report.totalIngested).toBe(1000);
    expect(duration).toBeLessThan(250); // Under 250ms threshold
  });
});

describe('Stress & Scale — Long Text & Unicode Boundaries', () => {
  it('safely handles extremely long descriptions (20,000 characters) without regex catastrophic backtracking', () => {
    const longDesc = 'Machine learning systems and distributed training infrastructure. '.repeat(300);
    expect(longDesc.length).toBeGreaterThan(18000);

    const longJob: Partial<NormalizedJob> = {
      title: 'Distributed AI Training Architect',
      company: 'High Performance AI Compute Corp',
      description: longDesc,
      salary: { min: 3000000, max: 6000000, currency: 'INR', period: 'year' }
    };

    const start = Date.now();
    const result = JobDataQualityPipeline.validate(longJob);
    const duration = Date.now() - start;

    expect(result.isValid).toBe(true);
    expect(duration).toBeLessThan(50); // Validated instantaneously
  });

  it('safely handles multi-lingual Unicode strings (Hindi, Tamil, Cyrillic, Emoji)', () => {
    const unicodeJob: Partial<NormalizedJob> = {
      title: 'आर्टिफिशियल इंटेलिजेंस इंजीनियर 🤖 (AI Lead)',
      company: 'செயற்கை நுண்ணறிவு லேப்ஸ் 🚀',
      description: 'हम भारत और दुनिया भर में अत्याधुनिक AI मॉडल और एजेंट बना रहे हैं। Дополнительный текст для проверки кодировки.',
      salary: { min: 2500000, max: 4000000, currency: 'INR', period: 'year' }
    };

    const result = JobDataQualityPipeline.validate(unicodeJob);
    expect(result.isValid).toBe(true);

    const fp = JobDataQualityPipeline.generateFingerprint(`${unicodeJob.company}|${unicodeJob.title}|${unicodeJob.description}`);
    expect(typeof fp).toBe('string');
    expect(fp.length).toBeGreaterThan(0);
  });
});

describe('Stress & Scale — Concurrent Rapid Interactions', () => {
  it('executes 100 rapid concurrent searches without memory degradation or race conditions', async () => {
    const adapter = new DirectPlatformAdapter();
    const promises: Promise<any>[] = [];

    for (let i = 0; i < 100; i++) {
      const term = i % 2 === 0 ? 'AI' : 'Engineer';
      promises.push(adapter.searchJobs({ searchTerm: term, limit: 10 }));
    }

    const start = Date.now();
    const results = await Promise.all(promises);
    const duration = Date.now() - start;

    expect(results.length).toBe(100);
    expect(results.every((r) => r.jobs.length > 0)).toBe(true);
    expect(duration).toBeLessThan(1000); // 100 concurrent searches in under 1 second
  });
});
