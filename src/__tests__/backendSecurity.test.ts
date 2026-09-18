import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { getOfficialJobPortalUrl } from '../lib/utils/jobPortalUrl';
import { NormalizedJob } from '../types/normalizedJob';

describe('Backend & Client Security — Zero Scraper & Secret Isolation', () => {
  it('strictly verifies zero Apify API key or scraper tokens in client environment', () => {
    const envKey = (import.meta as any).env?.VITE_APIFY_API_KEY;
    expect(envKey).toBeUndefined();
  });

  it('guarantees no VITE_GEMINI_API_KEY is defined in client build environment', () => {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    expect(envKey).toBeUndefined();
  });

  it('ensures .env.example contains zero secret keys or Apify references', () => {
    const envExamplePath = path.resolve(process.cwd(), '.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf8');
    expect(content.toLowerCase()).not.toContain('apify');
    expect(content).not.toMatch(/api_key=[a-zA-Z0-9_-]{15,}/);
  });
});

describe('Production Content Security Policy (CSP) & Header Integrity', () => {
  const firebaseJsonPath = path.resolve(process.cwd(), 'firebase.json');
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
  const headers = firebaseConfig?.hosting?.headers?.[0]?.headers || [];

  const getHeader = (key: string) => headers.find((h: any) => h.key.toLowerCase() === key.toLowerCase())?.value;

  it('enforces frame-ancestors none to prevent Clickjacking (OWASP A05)', () => {
    const csp = getHeader('Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(getHeader('X-Frame-Options')).toBe('DENY');
  });

  it('strictly prohibits Apify domains in CSP connect-src', () => {
    const csp = getHeader('Content-Security-Policy');
    expect(csp).not.toContain('apify.com');
    expect(csp).not.toContain('api.apify.com');
  });

  it('enforces strict object-src none and nosniff MIME type protection', () => {
    const csp = getHeader('Content-Security-Policy');
    expect(csp).toContain("object-src 'none'");
    expect(getHeader('X-Content-Type-Options')).toBe('nosniff');
  });

  it('enforces HSTS with preload and subdomains for HTTPS transport security', () => {
    const hsts = getHeader('Strict-Transport-Security');
    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });
});

describe('Injection & Malicious URL Neutralization (OWASP A03)', () => {
  const mockBaseJob: NormalizedJob = {
    id: 'test-job-sec-1',
    title: 'Senior Security Architect',
    company: 'SecureCorp India',
    location: 'Bangalore',
    remoteType: 'hybrid',
    employmentType: 'full-time',
    salary: { min: 2500000, max: 4000000, currency: 'INR', period: 'year' },
    description: 'Lead security audits and vulnerability remediation.',
    responsibilities: ['Review cloud infra'],
    requirements: ['5+ years AppSec'],
    skills: ['Cybersecurity', 'CSP', 'OWASP'],
    matchScore: 90,
    source: 'LinkedIn',
    portal: 'LinkedIn',
    sourceUrl: 'https://example.com',
    postedAt: new Date().toISOString(),
    isVerified: true
  };

  it('defangs and refuses dangerous javascript: pseudo-protocol URIs in job redirection', () => {
    const maliciousJob: NormalizedJob = {
      ...mockBaseJob,
      sourceUrl: 'javascript:alert(document.cookie);',
      portal: 'Direct Employer'
    };

    const targetUrl = getOfficialJobPortalUrl(maliciousJob);
    expect(targetUrl).not.toContain('javascript:');
    expect(targetUrl.startsWith('https://')).toBe(true);
  });

  it('defangs data: URI scheme attempts intended to execute inline scripts', () => {
    const maliciousJob: NormalizedJob = {
      ...mockBaseJob,
      sourceUrl: 'data:text/html,<script>alert(1)</script>',
      portal: 'Direct Employer'
    };

    const targetUrl = getOfficialJobPortalUrl(maliciousJob);
    expect(targetUrl).not.toContain('data:text/html');
    expect(targetUrl.startsWith('https://')).toBe(true);
  });

  it('encodes XSS payloads safely in LinkedIn search fallback queries', () => {
    const maliciousJob: NormalizedJob = {
      ...mockBaseJob,
      title: '<script>alert("xss")</script>',
      company: 'Evil" onfocus="alert(1)',
      sourceUrl: 'dummy-url-for-routing',
      portal: 'LinkedIn'
    };

    const targetUrl = getOfficialJobPortalUrl(maliciousJob);
    expect(targetUrl).not.toContain('<script>');
    expect(targetUrl).toContain(encodeURIComponent('<script>alert("xss")</script>'));
  });

  it('safely normalizes and routes Naukri search slugs without script execution', () => {
    const maliciousJob: NormalizedJob = {
      ...mockBaseJob,
      title: 'DevOps<svg/onload=alert(1)>',
      location: 'Hyderabad<img src=x onerror=alert(2)>',
      sourceUrl: 'dummy-url-for-routing',
      portal: 'Naukri'
    };

    const targetUrl = getOfficialJobPortalUrl(maliciousJob);
    expect(targetUrl).not.toContain('<svg');
    expect(targetUrl).not.toContain('onerror=');
    expect(targetUrl.startsWith('https://www.naukri.com/')).toBe(true);
  });
});

describe('Firestore Security Rules Analysis & Privileged Field Protection', () => {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  it('strictly denies client read/write to private vaults (Cloud Functions / Admin SDK only)', () => {
    expect(rulesContent).toMatch(/match\s+\/private\/\{docId\}\s*\{\s*allow\s+read,\s*write:\s*if\s+false;/);
  });

  it('blocks privilege escalation: users cannot modify isAdmin, roles, accountStatus, or subscriptionTier', () => {
    expect(rulesContent).toContain("!request.resource.data.keys().hasAny(['isAdmin', 'roles'])");
    expect(rulesContent).toContain("affectedKeys().hasAny(['accountStatus', 'isAdmin', 'roles', 'subscriptionTier'])");
  });

  it('enforces verified recruiter domain / email authorization for job creation', () => {
    expect(rulesContent).toContain('function isAuthorizedJobPoster()');
    expect(rulesContent).toContain('allow create: if isAuthorizedJobPoster()');
    expect(rulesContent).toContain('allow update, delete: if isAuthorizedJobPoster()');
  });

  it('protects applications collection from client tampering of verification status', () => {
    expect(rulesContent).toContain("!request.resource.data.diff(resource.data).affectedKeys().hasAny(['verifiedSubmission', 'systemStatus'])");
  });
});
