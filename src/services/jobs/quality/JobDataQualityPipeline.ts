import { NormalizedJob } from '@/types/normalizedJob';

export interface QualityValidationResult {
  isValid: boolean;
  job: NormalizedJob | null;
  reasons: string[];
  flags: ('spam' | 'impossible_salary' | 'stale' | 'invalid_url' | 'incomplete_fields')[];
}

export interface PipelineReport {
  totalIngested: number;
  totalValid: number;
  totalRejected: number;
  totalDuplicates: number;
  rejectedReasons: Record<string, number>;
}

export class JobDataQualityPipeline {
  /**
   * Cleans and normalizes URLs to strip tracking and marketing query parameters
   */
  static cleanUrl(urlStr?: string): string {
    if (!urlStr) return '';
    try {
      const parsed = new URL(urlStr);
      // Remove common tracking parameters
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'trk', 'fbclid', 'gclid', 'source'];
      trackingParams.forEach((param) => parsed.searchParams.delete(param));
      return parsed.toString();
    } catch {
      return urlStr.trim();
    }
  }

  /**
   * Generates a 32-bit content hash fingerprint from text
   */
  static generateFingerprint(input: string): string {
    let hash = 0;
    const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let i = 0; i < clean.length; i++) {
      const char = clean.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Validates an individual job against all quality gates
   */
  static validate(job: Partial<NormalizedJob>): QualityValidationResult {
    const reasons: string[] = [];
    const flags: QualityValidationResult['flags'] = [];

    // 1. Missing Title Gate
    if (!job.title || job.title.trim().length < 3) {
      reasons.push('Title is missing or under 3 characters');
      flags.push('incomplete_fields');
    }

    // 2. Missing Company Gate
    if (!job.company || job.company.trim().length < 2) {
      reasons.push('Company name is missing or invalid');
      flags.push('incomplete_fields');
    }

    // 3. Empty / Short Description Gate
    if (!job.description || job.description.trim().length < 25) {
      reasons.push('Description is empty or too short (< 25 characters)');
      flags.push('incomplete_fields');
    }

    // 4. Invalid Apply / Source URL Gate
    const targetUrl = job.applyUrl || job.sourceUrl;
    if (targetUrl) {
      const isHttp = targetUrl.startsWith('http://') || targetUrl.startsWith('https://');
      if (!isHttp) {
        reasons.push('Target apply/source URL is not a valid HTTP/HTTPS address');
        flags.push('invalid_url');
      }
    }

    // 5. Impossible / Absurd Salary Gate
    if (job.salary) {
      const { min, max, currency } = job.salary;
      // Inverted min/max
      if (min > max && max > 0) {
        reasons.push(`Inverted salary bounds: min (${min}) > max (${max})`);
        flags.push('impossible_salary');
      }
      // Negative bounds
      if (min < 0 || max < 0) {
        reasons.push('Negative salary specified');
        flags.push('impossible_salary');
      }
      // Absurd upper bounds (e.g. > 100 Crore INR or > $10 Million USD)
      if (currency === 'INR' && (max > 1000000000 || min > 1000000000)) {
        reasons.push('Salary exceeds realistic threshold (> 100 Cr INR)');
        flags.push('impossible_salary');
      } else if (currency === 'USD' && (max > 10000000 || min > 10000000)) {
        reasons.push('Salary exceeds realistic threshold (> $10M USD)');
        flags.push('impossible_salary');
      }
    }

    // 6. Spam Detection Gate
    const combined = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    const spamIndicators = [
      'crypto scam', 'earn $5000 a day without working', 'telegram me @',
      'whatsapp me to get rich', 'wire transfer agent needed urgently'
    ];
    if (spamIndicators.some((indicator) => combined.includes(indicator))) {
      reasons.push('Job contains prohibited spam or fraudulent solicitation patterns');
      flags.push('spam');
    }

    // 7. Stale / Expired Jobs Gate
    if (job.expiresAt) {
      const expiryMs = new Date(job.expiresAt).getTime();
      if (!isNaN(expiryMs) && expiryMs < Date.now()) {
        reasons.push('Job validity has expired');
        flags.push('stale');
      }
    }

    const isValid = reasons.length === 0;

    return {
      isValid,
      job: isValid ? (job as NormalizedJob) : null,
      reasons,
      flags
    };
  }

  /**
   * Runs an array of raw/ingested jobs through the validation and 5-tier deduplication pipeline
   */
  static processCatalog(rawJobs: Partial<NormalizedJob>[]): {
    validJobs: NormalizedJob[];
    report: PipelineReport;
  } {
    const validJobs: NormalizedJob[] = [];
    const rejectedReasons: Record<string, number> = {};
    let totalRejected = 0;
    let totalDuplicates = 0;

    // Deduplication index tables:
    const seenProviderId = new Set<string>();
    const seenApplyUrl = new Set<string>();
    const seenCanonicalUrl = new Set<string>();
    const seenComposite = new Set<string>();
    const seenFingerprints = new Set<string>();

    for (const raw of rawJobs) {
      const validation = this.validate(raw);
      if (!validation.isValid) {
        totalRejected++;
        validation.reasons.forEach((r) => {
          rejectedReasons[r] = (rejectedReasons[r] || 0) + 1;
        });
        continue;
      }

      // Clone to ensure immutability and never mutate input objects
      const job: NormalizedJob = { ...validation.job! };

      // 5-Tier Deduplication Strategy

      // Tier 1: Provider + sourceJobId
      const providerIdKey = `${job.portal || job.source || 'direct'}:${job.sourceJobId || job.id}`;
      if (seenProviderId.has(providerIdKey)) {
        totalDuplicates++;
        continue;
      }

      // Tier 2: Normalized Apply URL (only when explicit applyUrl is provided)
      const cleanedApplyUrl = job.applyUrl ? this.cleanUrl(job.applyUrl) : '';
      if (cleanedApplyUrl && seenApplyUrl.has(cleanedApplyUrl)) {
        totalDuplicates++;
        continue;
      }

      // Tier 3: Canonical URL
      if (job.canonicalUrl && seenCanonicalUrl.has(job.canonicalUrl)) {
        totalDuplicates++;
        continue;
      }

      // Tier 4: Company + Normalized Title + Location
      const normTitle = job.title.toLowerCase().trim().replace(/\s+/g, ' ');
      const normCompany = job.company.toLowerCase().trim();
      const normLoc = (job.location || '').toLowerCase().trim();
      const compositeKey = `${normCompany}|${normTitle}|${normLoc}`;
      if (seenComposite.has(compositeKey)) {
        totalDuplicates++;
        continue;
      }

      // Tier 5: Content Fingerprint (hash of company + title + location + first 200 chars of description)
      const descSample = (job.description || '').slice(0, 200);
      const fingerprint = this.generateFingerprint(`${normCompany}|${normTitle}|${normLoc}|${descSample}`);
      if (seenFingerprints.has(fingerprint)) {
        totalDuplicates++;
        continue;
      }

      // Record in indices
      seenProviderId.add(providerIdKey);
      if (cleanedApplyUrl) seenApplyUrl.add(cleanedApplyUrl);
      if (job.canonicalUrl) seenCanonicalUrl.add(job.canonicalUrl);
      seenComposite.add(compositeKey);
      seenFingerprints.add(fingerprint);

      // Cleaned canonical fields
      job.applyUrl = cleanedApplyUrl || job.sourceUrl;
      if (!job.canonicalUrl) {
        job.canonicalUrl = `https://knowyourjob.web.app/jobs/${job.id}`;
      }

      validJobs.push(job);
    }

    return {
      validJobs,
      report: {
        totalIngested: rawJobs.length,
        totalValid: validJobs.length,
        totalRejected,
        totalDuplicates,
        rejectedReasons
      }
    };
  }
}
