import type { NormalizedJob } from '@/types/normalizedJob';

/**
 * Validates and resolves the official external job portal URL.
 * Guarantees that users are NEVER redirected to dummy/placeholder URLs like knowyourjob.ai/jobs/job-1.
 * Instead, maps scraped or recommended jobs to genuine official links on LinkedIn, Naukri, Indeed, or company portals.
 */
export function getOfficialJobPortalUrl(job: Partial<NormalizedJob> | null | undefined): string {
  if (!job) return 'https://www.linkedin.com/jobs/';

  const rawUrl = job.sourceUrl || '';
  const title = job.title || 'Software Engineer';
  const company = job.company || '';
  const location = job.location || 'India';
  const portal = (job.portal || job.source || '').toLowerCase();

  // Check if rawUrl is already a legitimate live external portal URL (not knowyourjob.ai)
  const isDummyUrl = rawUrl.includes('knowyourjob.ai') || rawUrl.includes('example.com') || !rawUrl.startsWith('http');
  const isLegitPortal = /linkedin\.com|naukri\.com|indeed\.com|glassdoor\.com|wellfound\.com|google\.com|foundit\.in|hirist\.tech/i.test(rawUrl);

  if (!isDummyUrl && isLegitPortal) {
    return rawUrl;
  }

  // If rawUrl is a valid custom company domain (not dummy), use it
  if (!isDummyUrl && rawUrl.startsWith('http') && !rawUrl.includes('localhost')) {
    return rawUrl;
  }

  // Route to official LinkedIn Job Portal search
  if (portal.includes('linkedin')) {
    // If we have a numerical jobId from provider adapter, direct link to view
    const jobIdMatch = (job.id || '').match(/li-(\d+)/) || rawUrl.match(/view\/(\d+)/);
    if (jobIdMatch && jobIdMatch[1]) {
      return `https://www.linkedin.com/jobs/view/${jobIdMatch[1]}/`;
    }
    const query = [title, company].filter(Boolean).join(' ');
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
  }

  // Route to official Naukri Job Portal
  if (portal.includes('naukri')) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const locSlug = location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `https://www.naukri.com/${slug}-jobs-in-${locSlug}?k=${encodeURIComponent(title)}&l=${encodeURIComponent(location)}`;
  }

  // Route to official Indeed Job Portal
  if (portal.includes('indeed')) {
    const query = [title, company].filter(Boolean).join(' ');
    return `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
  }

  // Default fallback: Search on official LinkedIn Jobs (universally most recognized)
  const fallbackQuery = [title, company].filter(Boolean).join(' ');
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(fallbackQuery)}&location=${encodeURIComponent(location)}`;
}

/**
 * Returns clean human-readable name of the portal
 */
export function getPortalDisplayName(job: Partial<NormalizedJob> | null | undefined): string {
  if (!job) return 'Official Portal';
  const portal = (job.portal || job.source || '').toLowerCase();
  if (portal.includes('linkedin')) return 'LinkedIn';
  if (portal.includes('naukri')) return 'Naukri';
  if (portal.includes('indeed')) return 'Indeed';
  if (portal.includes('direct')) return 'Direct Employer';
  return 'Official Portal';
}
