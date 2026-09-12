import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Technical SEO Assets & Meta Configuration', () => {
  const publicDir = path.resolve(process.cwd(), 'public');
  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');

  it('verifies robots.txt exists with proper crawl directives and sitemap reference', () => {
    const robotsPath = path.join(publicDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, 'utf8');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /jobs');
    expect(content).toContain('Disallow: /dashboard');
    expect(content).toContain('Disallow: /admin');
    expect(content).toContain('Sitemap: https://knowyourjob.web.app/sitemap.xml');
  });

  it('verifies sitemap.xml exists with AI job category canonical URLs', () => {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, 'utf8');
    expect(content).toContain('<loc>https://knowyourjob.web.app/</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs/generative-ai</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs/llm</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs/machine-learning</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs/remote-ai</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/jobs/india-ai</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/privacy</loc>');
    expect(content).toContain('<loc>https://knowyourjob.web.app/terms</loc>');
  });

  it('verifies index.html has complete OpenGraph, Twitter, and JSON-LD structured data', () => {
    expect(fs.existsSync(indexHtmlPath)).toBe(true);
    const content = fs.readFileSync(indexHtmlPath, 'utf8');

    // Title & Canonical
    expect(content).toContain('<title>KnowYourJob — AI-Powered Job Discovery & Automation</title>');
    expect(content).toContain('<link rel="canonical" href="https://knowyourjob.web.app/" />');

    // OpenGraph
    expect(content).toContain('<meta property="og:type" content="website" />');
    expect(content).toContain('<meta property="og:url" content="https://knowyourjob.web.app/" />');
    expect(content).toContain('<meta property="og:title"');
    expect(content).toContain('<meta property="og:description"');

    // Twitter Card
    expect(content).toContain('<meta name="twitter:card" content="summary_large_image" />');

    // JSON-LD WebSite & Organization
    expect(content).toContain('@context": "https://schema.org');
    expect(content).toContain('"@type": "WebSite"');
    expect(content).toContain('"@type": "Organization"');
    expect(content).toContain('"@type": "SearchAction"');
  });
});
