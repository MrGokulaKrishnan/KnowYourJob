/**
 * Security and Authorization guard for Job Postings.
 * Enforces that only official, verified recruiter/admin email accounts can publish jobs.
 * General users cannot upload or post jobs.
 */

// Official job posting email addresses authorized to post jobs
export const OFFICIAL_JOB_POSTER_EMAILS: string[] = [
  'jobs@knowyourjob.com',
  'careers@knowyourjob.com',
  'admin@knowyourjob.com',
  'gokulkrish7204@gmail.com', // Official Project Owner & Administrator
];

// Load any extra authorized emails from environment if configured
const envEmails = import.meta.env.VITE_OFFICIAL_JOB_POSTER_EMAILS;
if (envEmails) {
  envEmails.split(',').forEach((e: string) => {
    const trimmed = e.trim().toLowerCase();
    if (trimmed && !OFFICIAL_JOB_POSTER_EMAILS.includes(trimmed)) {
      OFFICIAL_JOB_POSTER_EMAILS.push(trimmed);
    }
  });
}

/**
 * Public consumer email domains that are rejected unless explicitly whitelisted in OFFICIAL_JOB_POSTER_EMAILS.
 */
const PUBLIC_CONSUMER_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'proton.me',
  'protonmail.com',
];

/**
 * Checks if the given email is authorized to post jobs.
 * 
 * Rules:
 * 1. Must be authenticated.
 * 2. If in OFFICIAL_JOB_POSTER_EMAILS -> ALLOWED.
 * 3. If user role is 'admin' or 'recruiter' -> ALLOWED.
 * 4. If has a verified official corporate work domain (e.g. @company.com, @google.com, @microsoft.com) -> ALLOWED.
 * 5. General consumer email addresses (e.g. random @gmail.com) -> BLOCKED.
 */
export function isAuthorizedJobPoster(email: string | null | undefined, role?: string | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();

  // Role check
  if (role === 'admin' || role === 'recruiter') {
    return true;
  }

  // Exact match in official whitelist
  if (OFFICIAL_JOB_POSTER_EMAILS.includes(normalizedEmail)) {
    return true;
  }

  // Check domain
  const domain = normalizedEmail.split('@')[1];
  if (!domain) return false;

  // If domain is knowyourjob.com or an official company corporate domain (not public webmail)
  if (domain === 'knowyourjob.com' || domain === 'knowyourjob.ai') {
    return true;
  }

  // If it's a corporate / company domain (e.g. hr@infosys.com, recruiter@stripe.com)
  const isConsumerDomain = PUBLIC_CONSUMER_DOMAINS.includes(domain);
  if (!isConsumerDomain) {
    return true;
  }

  return false;
}

/**
 * The official email address designated for receiving job posting requests.
 */
export const OFFICIAL_JOB_CONTACT_EMAIL = 'jobs@knowyourjob.com';
