import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from '../utils/authErrorMapper';
import { JobDataQualityPipeline } from '../services/jobs/quality/JobDataQualityPipeline';

describe('Security — Account Enumeration Defenses', () => {
  it('collapses user-not-found and wrong-password into identical generic responses', () => {
    const notFoundMsg = getAuthErrorMessage({ code: 'auth/user-not-found' });
    const wrongPasswordMsg = getAuthErrorMessage({ code: 'auth/wrong-password' });
    const invalidCredentialMsg = getAuthErrorMessage({ code: 'auth/invalid-credential' });

    expect(notFoundMsg).toBe('Incorrect email or password. Please verify and try again.');
    expect(wrongPasswordMsg).toBe('Incorrect email or password. Please verify and try again.');
    expect(invalidCredentialMsg).toBe('Incorrect email or password. Please verify and try again.');
    expect(notFoundMsg).toBe(wrongPasswordMsg);
  });

  it('provides security cooldown message on too-many-requests brute force attempt', () => {
    const rateLimitMsg = getAuthErrorMessage({ code: 'auth/too-many-requests' });
    expect(rateLimitMsg).toContain('Too many attempts');
  });
});

describe('Security — XSS & URL Scheme Neutralization', () => {
  it('strips dangerous query parameters and tracking hashes', () => {
    const dirtyUrl = 'https://example.com/apply?utm_source=malicious&utm_medium=cpc&ref=attacker';
    const cleaned = JobDataQualityPipeline.cleanUrl(dirtyUrl);
    expect(cleaned).toBe('https://example.com/apply');
    expect(cleaned).not.toContain('utm_source');
  });

  it('rejects malicious javascript: pseudo-protocol in apply and source URLs', () => {
    const maliciousJob = {
      title: 'Senior Developer',
      company: 'Test Company',
      description: 'Standard software development role with security focus.',
      applyUrl: 'javascript:alert(document.cookie)',
    };
    const result = JobDataQualityPipeline.validate(maliciousJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('invalid_url');
  });

  it('rejects data: URL scheme in apply and source URLs', () => {
    const maliciousJob = {
      title: 'DevOps Engineer',
      company: 'Security Testing Inc',
      description: 'Infrastructure automation and cloud security monitoring.',
      applyUrl: 'data:text/html,<script>alert(1)</script>',
    };
    const result = JobDataQualityPipeline.validate(maliciousJob);
    expect(result.isValid).toBe(false);
    expect(result.flags).toContain('invalid_url');
  });

  it('generates consistent collision-resistant content fingerprints', () => {
    const fp1 = JobDataQualityPipeline.generateFingerprint('Anthropic|Generative AI Engineer|Building state of the art LLMs');
    const fp2 = JobDataQualityPipeline.generateFingerprint('Anthropic|Generative AI Engineer|Building state of the art LLMs');
    const fp3 = JobDataQualityPipeline.generateFingerprint('Anthropic|Machine Learning Engineer|Building state of the art LLMs');

    expect(fp1).toBe(fp2);
    expect(fp1).not.toBe(fp3);
  });
});
