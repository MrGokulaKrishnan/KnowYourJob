import { describe, it, expect } from 'vitest';
import { CATEGORY_CONFIGS } from '../pages/jobs/SeoJobCategoryPage';

describe('Production Lifecycle & Category Definitions', () => {
  it('defines valid configurations for all required AI search categories', () => {
    const requiredCategories = [
      'ai',
      'artificial-intelligence',
      'machine-learning',
      'generative-ai',
      'llm',
      'nlp',
      'computer-vision',
      'mlops',
      'prompt-engineer',
      'remote-ai',
      'india-ai',
    ];

    for (const cat of requiredCategories) {
      const config = CATEGORY_CONFIGS[cat];
      expect(config, `Missing category config for: ${cat}`).toBeDefined();
      expect(config.title.length).toBeGreaterThan(5);
      expect(config.metaDescription.length).toBeGreaterThan(20);
      expect(config.filterKeywords.length).toBeGreaterThan(0);
      expect(config.faqs.length).toBeGreaterThan(0);
      expect(config.salaryBenchmarkINR).toContain('₹');
    }
  });

  it('provides structured FAQ pairs with non-empty answers for each category', () => {
    for (const [key, config] of Object.entries(CATEGORY_CONFIGS)) {
      expect(config.faqs.length).toBeGreaterThanOrEqual(1);
      config.faqs.forEach((faq) => {
        expect(faq.q.endsWith('?')).toBe(true);
        expect(faq.a.length).toBeGreaterThan(25);
      });
    }
  });
});
