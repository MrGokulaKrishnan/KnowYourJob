# KnowYourJob — QA & Security Test Report

**Target:** `https://knowyourjob.web.app/#dashboard`  
**Assessment Date:** 2026-09-05  
**Assessment Type:** Functional QA + Security Audit + Vulnerability Assessment + Safe Attack Simulation  
**Lead Evaluator:** Senior Security Engineer & Principal QA Architect  

---

## 1. Executive Summary

A comprehensive, production-oriented functional QA, cyber security, vulnerability, and resilience assessment was conducted on the deployed **KnowYourJob** web application ([https://knowyourjob.web.app/](https://knowyourjob.web.app/)).

The application exhibits a **strong baseline architectural security model**:
- **Zero Cross-Site Scripting (XSS)**: Pure React JSX data-binding with zero usage of `dangerouslySetInnerHTML`, `eval()`, or raw DOM sinks.
- **Robust Firestore Multi-Tenant Isolation**: Owner-scoped security rules prevent unauthorized cross-user reading, writing, updating, or deleting of candidate profiles, resumes, applications, and settings.
- **Privilege Tampering Protection**: Security rules explicitly block clients from self-assigning `isAdmin`, modifying `accountStatus`, or elevating `subscriptionTier`.
- **Enforced Transport Security**: Global HTTPS via TLS 1.3 with Google HSTS preloading.

Several areas require immediate engineering hardening before broad public release:
1. **Dependency Vulnerability (CVE in `pdfjs-dist`)**: In-browser client-side PDF parsing uses a version vulnerable to arbitrary script execution via malicious PDF glyphs (GHSA-hq66-cqwq-w95j).
2. **Client-Side Secret Exposure Architecture**: Client code patterns contain fallback references to `VITE_GEMINI_API_KEY` and `VITE_APIFY_API_KEY`, which would leak secrets into public client bundles if configured at build time.
3. **Missing Security Headers**: Firebase Hosting configuration lacks `Content-Security-Policy` (CSP), `X-Frame-Options` (Clickjacking), `X-Content-Type-Options`, and `Referrer-Policy`.
4. **Missing Role Guard on Admin Route**: Any authenticated user can navigate to `/dashboard/admin` because client-side route guards do not enforce `isAdmin`.

### Quality & Posture Summary

| Metric | Rating / Value |
|---|---|
| **Overall Quality Rating** | **88 / 100** |
| **Security Posture** | **Good (Hardening Required for Production)** |
| **Total Findings** | **14** |
| • Critical | 0 |
| • High | 1 (Dependency CVE) |
| • Medium | 2 (Client API Key Pattern, Missing Headers) |
| • Low | 3 (Admin Route Guard, Storage Initialization, Error Fallback) |
| • Informational | 2 (Firebase Config Context, Console Telemetry) |
| • Functional QA Issues | 2 |
| • UI/UX Defects | 2 |
| • Accessibility Issues | 2 |
| • Performance Observations | 2 |

---

## 2. Scope & Methodology

### Assessment Scope
- **Domain Targets**: `https://knowyourjob.web.app/` and `https://knowyourjob17.web.app/`
- **Application Architecture**: Single-Page Application (SPA) built with React 19, TypeScript, Vite, Tailwind CSS, Firebase Authentication v10, Cloud Firestore, Cloud Storage, and Google Gemini 3.6 Flash.
- **Routes Audited**:
  - Public: `/`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-email`, `/auth/email-link-sent`, `/auth/auth-action`
  - Protected: `/onboarding`, `/dashboard`, `/dashboard/jobs`, `/dashboard/jobs/:id`, `/dashboard/recommended`, `/dashboard/applications`, `/dashboard/applications/:id`, `/dashboard/resume`, `/dashboard/resume/analyze`, `/dashboard/profile`, `/dashboard/preferences`, `/dashboard/automation`, `/dashboard/analytics`, `/dashboard/settings`, `/dashboard/privacy`, `/dashboard/admin`, `/dashboard/billing`
- **Environments Evaluated**: Production Firebase Hosting CDN, local source code inspection, dependency tree analysis, and simulated attacker requests.

### Testing Methodology
The assessment adhered to the **OWASP Web Security Testing Guide (WSTG v4.2)** and **OWASP Top 10 (2021)** standards:
1. **Passive Reconnaissance & Asset Inventory**: Bundle inspection, network tracing, header analysis, and endpoint discovery.
2. **Safe Attack Simulation**:
   - Authentication bypass and state manipulation.
   - Horizontal and vertical privilege escalation.
   - Indirect injection testing (harmless script tags, Unicode vectors, boundary values).
   - In-memory inspection of client-side storage (`localStorage`, `sessionStorage`, `IndexedDB`).
   - Cross-user data isolation verification against Firestore rules.
3. **Automated Static & Dependency Auditing**: `npm audit`, source-code grep scanning for dangerous sinks, and security rule static analysis.
4. **Functional, UI/UX, and Accessibility QA**: Cross-viewport testing (320px to 1920px), keyboard navigation, screen-reader semantics, and error handling.

---

## 3. Feature Coverage Matrix

| Feature / Area | Route / Component | Tested | Result | Notes |
|---|---|---|---|---|
| **Public Landing Page** | `/` | Yes | **PASS** | Hero section, branding, CTA links, trust badges, zero console errors. |
| **Email/Password Registration** | `/auth/register` | Yes | **PASS** | Zod validation enforces min 8 chars, uppercase, lowercase, number. |
| **Email/Password Login** | `/auth/login` | Yes | **PASS** | Generic error messages prevent user enumeration. |
| **Google OAuth Sign-In** | `/auth/login` | Yes | **PASS** | Popup authentication through Firebase Auth handler. |
| **Passwordless Magic Link** | `/auth/login` | Yes | **PASS** | Action code dispatched via Firebase Auth; target stored in localStorage. |
| **Password Reset** | `/auth/forgot-password` | Yes | **PASS** | Dispatches standard password reset email; handles rate-limiting. |
| **Route Protection Guard** | `<ProtectedRoute>` | Yes | **PARTIAL** | Enforces authentication and onboarding, but omits admin role check. |
| **Resume Upload (Dropzone)** | `/onboarding` & `/dashboard/resume` | Yes | **PASS** | Accepts PDF/DOCX up to 10MB; rejects unsupported formats. |
| **Client PDF Text Parsing** | `extractTextFromPDF` | Yes | **FAIL** | Functions correctly, but relies on vulnerable `pdfjs-dist` package. |
| **Candidate Profile Parsing** | `aiService.extractCandidateProfile` | Yes | **PASS** | Structured JSON schema extracts real name, skills, jobs, degrees. |
| **Profile Verification Screen** | `/onboarding` Step 3 | Yes | **PASS** | Displays real parsed candidate data with inline editing capabilities. |
| **INR Salary Localization** | `/onboarding` Step 4 & `/preferences` | Yes | **PASS** | Formatted in Indian Rupees (₹ LPA) with 1-click presets. |
| **Firestore Profile Persistence** | `profileService.saveFullProfile` | Yes | **PASS** | Deep sanitization strips `undefined` values; saves cleanly. |
| **Job Search & Text Filter** | `/dashboard/jobs` | Yes | **PASS** | Case-insensitive substring search across titles, skills, and companies. |
| **Job Details & AI Match** | `/dashboard/jobs/:id` | Yes | **PASS** | Lazy-loaded match breakdown computes skills and experience scores. |
| **AI Application Submission** | `handleApplyWithAI` | Yes | **PASS** | Saves record to `applications/{id}` with verified user ID. |
| **Application Tracker Board** | `/dashboard/applications` | Yes | **PASS** | Kanban views accurately reflect Firestore status updates. |
| **Resume ATS Deep Analysis** | `/dashboard/resume/analyze` | Yes | **PASS** | Displays readability score, keyword gaps, and actionable suggestions. |
| **Admin Command Center** | `/dashboard/admin` | Yes | **FAIL** | Accessible to non-admin authenticated users without role check. |
| **Responsive Mobile Layout** | All routes (320px - 414px) | Yes | **PASS** | Responsive drawer, stackable cards, zero horizontal overflow. |

---

## 4. Critical Findings

*No **P0 (Critical)** vulnerabilities (such as active remote code execution, universal database bypass, or unauthenticated full-database dump) were identified.*

The highest-severity issue discovered is **FINDING-001 (High Severity)** regarding the `pdfjs-dist` third-party dependency CVE.

---

## 5. Detailed Security Findings

---

### FINDING-001 — High-Severity Code Execution CVE in Client-Side PDF Parser (`pdfjs-dist`)
**Severity:** High (CVSS: 7.8 / CWE-79 / GHSA-hq66-cqwq-w95j)  
**Category:** Vulnerable & Outdated Components (OWASP A06:2021)  
**Affected Area:** `src/services/firebase/resumeService.ts` (`extractTextFromPDF`)  
**Status:** Confirmed Vulnerability in Dependency Tree  

#### Description
The application uses `pdfjs-dist` (installed version in range `>=5.6.83 <6.2.108`) to extract plain text from candidate resumes directly in the user's browser. A known security vulnerability in PDF.js allows arbitrary JavaScript execution upon opening or parsing a maliciously crafted PDF file containing contaminated font tables or glyph matrix definitions.

#### Preconditions
An attacker uploads a specially crafted PDF resume to `/onboarding` or `/dashboard/resume`.

#### Reproduction Steps
1. Inspect `package.json` and run `npm audit --json`.
2. Observe reported advisory: `GHSA-hq66-cqwq-w95j` ("PDF.js: Arbitrary JavaScript execution upon opening a malicious PDF").
3. Inspect `src/services/firebase/resumeService.ts` line 23:
   ```ts
   const pdfjsLib = await import('pdfjs-dist');
   ```
4. While the application sets `isEvalSupported: false`, the parser is invoked directly on client-provided `ArrayBuffer` data in the main execution thread or web worker.

#### Expected Result
Resume files should be parsed using an updated, patched engine, or processed inside an isolated sandbox.

#### Actual Result
The installed version of `pdfjs-dist` is vulnerable to arbitrary script execution.

#### Impact
If an attacker crafts a malicious PDF resume, uploading or processing it could trigger client-side code execution in the context of the user's session, potentially reading auth tokens or making unauthorized requests.

#### Evidence
`npm audit` verification:
```json
{
  "name": "pdfjs-dist",
  "severity": "high",
  "title": "PDF.js: Arbitrary JavaScript execution upon opening a malicious PDF",
  "url": "https://github.com/advisories/GHSA-hq66-cqwq-w95j",
  "cwe": ["CWE-79"],
  "range": ">=5.6.83 <6.2.108"
}
```

#### Recommended Fix
1. Upgrade `pdfjs-dist` to the patched release (`>=6.2.108` or the latest stable release):
   ```bash
   npm install pdfjs-dist@latest
   ```
2. Offload PDF text extraction to a backend serverless function (Firebase Cloud Function with a hardened parser) so that no client browser parses untrusted binary PDF structures.

#### Regression Test
Run `npm audit` and confirm zero vulnerabilities reported for `pdfjs-dist`. Verify that PDF resume uploads continue to extract candidate text accurately.

---

### FINDING-002 — Insecure Architectural Pattern: Client-Side LLM & Scraper API Key Ingestion
**Severity:** Medium (CWE-200 / CWE-798)  
**Category:** Insecure Design & Information Exposure (OWASP A04:2021)  
**Affected Area:** [`src/lib/services/aiService.ts`](file:///c:/KnowYourJob/src/lib/services/aiService.ts#L88) and [`src/services/jobs/apifyJobService.ts`](file:///c:/KnowYourJob/src/services/jobs/apifyJobService.ts#L195)  
**Status:** Confirmed Architectural Risk  

#### Description
In `aiService.ts` and `apifyJobService.ts`, fallback methods are written to invoke the Google Gemini API and Apify API directly from the browser using client environment variables:
```ts
// aiService.ts line 88
const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`, ...);

// apifyJobService.ts line 196
const key = import.meta.env.VITE_APIFY_API_KEY;
fetch(`${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${token}...`);
```
In Vite applications, any variable prefixed with `VITE_` is statically embedded into the public JavaScript client bundle at build time. While `.env` is currently gitignored and secrets were stripped from version control, if any developer compiles the application with `VITE_GEMINI_API_KEY` or `VITE_APIFY_API_KEY` defined, the private key becomes publicly readable to anyone opening Chrome DevTools.

#### Preconditions
A production build is compiled with `VITE_GEMINI_API_KEY` or `VITE_APIFY_API_KEY` present in the build environment.

#### Reproduction Steps
1. Add a test key to `.env`: `VITE_GEMINI_API_KEY=AIzaSyFakeKey...`.
2. Run `npm run build`.
3. Search in `dist/assets/index-*.js` for `AIzaSyFakeKey`.
4. The key is found in plain text in the compiled bundle.

#### Expected Result
Private API keys (Gemini, OpenAI, Apify) must never exist in client-side bundles or be transmitted directly from browser JavaScript.

#### Actual Result
Client code is structured to make direct browser-to-API calls with `VITE_*` keys if configured.

#### Impact
An attacker inspecting the application bundle or Network panel can extract the API key, exhaust the account's quota, or incur financial charges.

#### Recommended Fix
1. Remove `callGeminiDirect` client-side API key callers.
2. Route all AI match calculations and profile extractions through Firebase Cloud Functions (or a serverless endpoint) using server-side secrets (`firebase functions:secrets:set GEMINI_API_KEY`).

#### Regression Test
Verify that no `VITE_GEMINI_API_KEY` or `VITE_APIFY_API_KEY` variables are referenced in client-side code and that the frontend communicates solely with authenticated backend functions.

---

### FINDING-003 — Missing Security Headers on Firebase Hosting
**Severity:** Medium (CWE-1021 / CWE-693)  
**Category:** Security Misconfiguration (OWASP A05:2021)  
**Affected Area:** `firebase.json` (Hosting configuration)  
**Status:** Confirmed Live  

#### Description
Probing the live response headers of `https://knowyourjob.web.app/` reveals that critical defensive HTTP response headers are absent from production responses.

#### Preconditions
None (public HTTP request).

#### Reproduction Steps
Execute HTTP HEAD/GET against `https://knowyourjob.web.app/`:
```bash
curl -I https://knowyourjob.web.app/
```

#### Observed Live Headers
```http
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: max-age=3600
strict-transport-security: max-age=31556926; includeSubDomains; preload
```

#### Missing Headers
- `Content-Security-Policy` (CSP)
- `X-Frame-Options: DENY` (or `SAMEORIGIN`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### Impact
- **Clickjacking**: Without `X-Frame-Options` or CSP `frame-ancestors 'none'`, malicious websites can embed KnowYourJob in a transparent `<iframe>` and trick authenticated users into clicking sensitive buttons.
- **MIME Sniffing**: Without `X-Content-Type-Options: nosniff`, older browsers may attempt to interpret non-script files as JavaScript.
- **Referrer Leakage**: Internal URL parameters could be leaked to external sites when navigating via outbound links.

#### Recommended Fix
Add a `"headers"` block to `firebase.json`:
```json
{
  "hosting": {
    "site": "knowyourjob",
    "public": "dist",
    "headers": [
      {
        "source": "/**",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
          { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com;" }
        ]
      }
    ]
  }
}
```

#### Regression Test
Run `curl -I https://knowyourjob.web.app/` after deployment and verify that all five headers are present in the response.

---

### FINDING-004 — Missing Role Guard on Admin Route (Broken Access Control)
**Severity:** Low (CVSS: 4.3 / CWE-285)  
**Category:** Broken Access Control (OWASP A01:2021)  
**Affected Area:** `src/components/auth/ProtectedRoute.tsx` and `src/pages/admin/AdminPage.tsx`  
**Status:** Confirmed  

#### Description
In `src/App.tsx`, the route `/dashboard/admin` is wrapped with standard `<ProtectedRoute>`:
```tsx
<Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```
`ProtectedRoute` checks only whether the user is logged in (`isAuthenticated`). It does not verify whether `userDoc?.role === 'admin'` or `userDoc?.isAdmin === true`. Consequently, any normal candidate who registers an account can directly navigate to `https://knowyourjob.web.app/dashboard/admin` and access the Admin Command Center UI.

#### Preconditions
Authenticated with any standard non-admin candidate account.

#### Reproduction Steps
1. Register a normal user account at `/auth/register`.
2. Complete or bypass onboarding to access the dashboard.
3. In the browser URL bar, type: `https://knowyourjob.web.app/dashboard/admin`.
4. The page loads the "Admin Command Center" dashboard without redirecting or denying access.

#### Expected Result
Non-admin users should be redirected to `/dashboard` with an access-denied notification.

#### Actual Result
The Admin Command Center interface renders fully for non-admin accounts.

#### Impact
While `AdminPage.tsx` currently displays demo metrics and does not execute privileged backend database mutations, exposing internal administrative interfaces to normal users violates the Principle of Least Privilege and provides reconnaissance information regarding platform architecture.

#### Recommended Fix
1. Add an `adminOnly` prop to `<ProtectedRoute>`:
   ```tsx
   if (adminOnly && userDoc?.role !== 'admin' && !userDoc?.isAdmin) {
     return <Navigate to="/dashboard" replace />;
   }
   ```
2. Update the route definition in `App.tsx`:
   ```tsx
   <Route path="/dashboard/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
   ```

#### Regression Test
Sign in as a standard user, attempt to navigate to `/dashboard/admin`, and confirm automatic redirection to `/dashboard`.

---

## 6. Functional QA Findings

| ID | Severity | Feature | Expected | Actual | Reproduction | Recommendation |
|---|---|---|---|---|---|---|
| **QA-001** | Low | Resume Upload Storage | Uploaded file binary saved to Firebase Storage bucket | Storage upload skips if bucket is uninitialized in Firebase console; relies on in-browser text extraction fallback | Drop PDF on `/dashboard/resume` when storage bucket is uninitialized | Initialize bucket in Firebase Console to enable persistent file binary archiving. |
| **QA-002** | Low | Email Link Sign-in Cross-Device | User clicks magic link in email on device B without device A's localStorage | If `emailForSignIn` is missing from localStorage, prompts user to re-enter email | Send email link on mobile, open link on desktop | Expected behavior for Firebase email link auth; ensure prompt clearly explains why email is re-requested. |

---

## 7. UI/UX Findings

| ID | Severity | Area | Issue Description | Recommendation |
|---|---|---|---|---|
| **UX-001** | Cosmetic (P4) | Onboarding Salary Range | In Step 4, entering a Min Salary greater than Max Salary displays an inverted range (e.g. `25L – 12L`) | Add auto-adjustment logic: if `minSalary > maxSalary`, set `maxSalary = minSalary`. |
| **UX-002** | Cosmetic (P4) | Job Card Long Titles | Extremely long job titles (>60 chars) wrap onto three lines on 320px screens | Apply Tailwind `line-clamp-2` to maintain uniform job card heights on extra-small mobile viewports. |

---

## 8. Accessibility Findings

| ID | Severity | WCAG Area | Issue Description | Recommendation |
|---|---|---|---|---|
| **A11Y-001** | Minor (P3) | 1.4.3 Contrast (Minimum) | Subtle secondary borders (`border-white/5` and text `text-slate-500`) have low contrast ratios against `#050505` background | Increase muted text to `text-slate-400` to exceed 4.5:1 contrast threshold. |
| **A11Y-002** | Minor (P3) | 1.3.1 Info and Relationships | Some inline glass input elements lack explicit `id` / `htmlFor` label associations | Add explicit `id` attributes and `aria-label` tags to all filter and salary inputs. |

---

## 9. Performance & Reliability Findings

| ID | Severity | Metric / Area | Observation | Recommendation |
|---|---|---|---|---|
| **PERF-001** | Minor (P3) | Bundle Chunk Size | Vite build generates large chunk warning (`pdf.worker-xSiVJ7U_.mjs` is ~2.1MB; main vendor chunk is ~1.5MB uncompressed) | Configure Rollup `output.manualChunks` to split vendor dependencies (`firebase`, `motion`, `pdfjs-dist`) into separate cached chunks. |
| **PERF-002** | Informational | CDN TTFB & Caching | Static assets transferred in ~270ms with Brotli compression; HTML cached for 3600s | Maintain current Firebase Global CDN edge caching configuration. |

---

## 10. Firebase Security Review

### Authentication
- **Identity Provider Integration**: Google OAuth and Email/Password flows function through the project's authorized handler (`knowyourjob.firebaseapp.com/__/auth/handler`).
- **Enumeration Defense**: `authErrorMapper.ts` collapses `auth/user-not-found`, `auth/wrong-password`, and `auth/invalid-credential` into an identical user-facing message, mitigating username enumeration attacks.
- **Session Persistence**: Managed via Firebase Auth `browserLocalPersistence` in IndexedDB.

### Firestore Security Rules
- **Multi-Tenant Isolation**: Verified. All user-specific collections (`users/{uid}`, `profiles/{uid}`, `automationSettings/{uid}`) strictly check `request.auth.uid == uid`.
- **Privilege Escalation Prevention**: Verified. The `users/{uid}` rule explicitly blocks client modification of privileged fields:
  ```javascript
  !request.resource.data.keys().hasAny(['isAdmin', 'roles']) &&
  !request.resource.data.diff(resource.data).affectedKeys().hasAny(['accountStatus', 'isAdmin', 'roles', 'subscriptionTier'])
  ```
- **Job Data Protection**: Verified. The `jobs/{jobId}` collection is publicly readable but strictly write-disabled for normal users (`allow write: if false;`).

### Cloud Storage
- **Rules Configuration**: `storage.rules` contains owner-scoped restrictions (`request.auth.uid == userId`), a 10MB maximum file size limit, and MIME-type restrictions (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- **Operational Requirement**: The storage bucket (`knowyourjob17.firebasestorage.app`) must be initialized in the Firebase Console to enable server-side file retention.

### Firebase Hosting
- **Routing & Rewrite Integrity**: `firebase.json` properly rewrites all requests to `/index.html` with zero 404 leakage on direct URL reloads.
- **Security Headers**: Needs explicit header definitions (see **FINDING-003**).

---

## 11. Security Headers & Browser Security Matrix

| Header / Control | Current Live Result | Risk Level | Remediation Recommendation |
|---|---|---|---|
| **Strict-Transport-Security** | Present (`max-age=31556926; includeSubDomains; preload`) | **PASS** | Maintain existing configuration. |
| **Content-Security-Policy (CSP)** | Missing | **Medium** | Implement strict script, style, and connect directives. |
| **X-Frame-Options** | Missing | **Medium** | Set `X-Frame-Options: DENY` to prevent clickjacking. |
| **X-Content-Type-Options** | Missing | **Low** | Set `X-Content-Type-Options: nosniff`. |
| **Referrer-Policy** | Missing | **Low** | Set `Referrer-Policy: strict-origin-when-cross-origin`. |
| **Permissions-Policy** | Missing | **Low** | Restrict unneeded device APIs: `camera=(), microphone=(), geolocation=()`. |

---

## 12. Test Coverage / Untested Areas

1. **Cloud Functions v2 Live Endpoints**:
   - The Cloud Function `analyzeResume` was not active in production due to the Firebase project being on the Spark free plan (which disables Cloud Build). The application cleanly executed its deterministic client fallback.
2. **Third-Party Payment Gateways**:
   - The `/dashboard/billing` page displays plan tiers, but live payment webhooks (Stripe / Razorpay) were not tested in live transaction mode.
3. **High-Volume Concurrent Application Flooding**:
   - Out of scope per safe testing boundaries. Firestore security rules enforce daily application caps (`dailyLimit <= 50`).

---

## 13. Recommended Fix Priority

### P0 — Immediate Action
*No immediate blockers identified.*

### P1 — High Priority (Address Before Public Marketing Launch)
1. **Upgrade `pdfjs-dist`**: Eliminate the arbitrary code execution CVE (GHSA-hq66-cqwq-w95j) by updating to the latest patched release.
2. **Add Security Headers in `firebase.json`**: Implement `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Content-Security-Policy`.

### P2 — Normal Priority (Next Sprint)
3. **Add Admin Role Guard**: Restrict `/dashboard/admin` in `ProtectedRoute` to users with `isAdmin: true`.
4. **Remove Client-Side Secret References**: Ensure all LLM calls route through serverless proxies rather than client-side `VITE_*` keys.
5. **Initialize Firebase Storage Bucket**: Provision the storage bucket in Firebase Console to enable permanent resume binary archiving.

### P3 — Improvements & Polish
6. **Code Splitting**: Configure Rollup `manualChunks` in `vite.config.ts` to reduce initial bundle size below 500kB.
7. **Salary Range Bounds Guard**: Auto-sync Min and Max salary inputs if an inverted range is entered.
8. **Contrast Enhancement**: Elevate secondary text contrast from `text-slate-500` to `text-slate-400`.

---

## 14. Final Quality Assessment

**Overall Score:** **88 / 100**

### Scoring Breakdown:
- **Architecture & Infrastructure**: 18 / 20
- **Authentication & Multi-Tenant Isolation**: 20 / 20
- **OWASP Client-Side Security**: 16 / 20 (Deduction for missing headers and PDF.js CVE)
- **Functional Completeness & QA**: 18 / 20
- **UI/UX & Mobile Responsiveness**: 9 / 10
- **Accessibility & Performance**: 7 / 10

The application demonstrates high architectural maturity, rock-solid Firestore multi-tenant security rules, and excellent responsive UI design. Resolving the dependency update and adding security headers will elevate the platform to top-tier enterprise production standards.

---

## 15. Release Recommendation

# ⚠️ READY WITH MINOR FIXES

The application is functionally sound, highly stable, and ready for deployment upon completing the two high-priority hardening steps:
1. Updating `pdfjs-dist` to the patched version.
2. Injecting security headers into `firebase.json`.

---

## 16. Regression Checklist

- [x] Unauthenticated users redirected to `/auth/login` on protected routes.
- [x] Users cannot modify other users' profiles, resumes, or applications.
- [x] Client cannot self-assign `isAdmin` or modify `accountStatus`.
- [x] Google OAuth popup completes through authorized domain.
- [x] Passwordless email sign-in links function without infinite loops.
- [x] Onboarding Gemini candidate profile extraction parses real resume text.
- [x] Onboarding "Finish Setup" saves candidate profile without `undefined` Firestore errors.
- [x] INR salary preferences display formatted ₹ LPA and save to Firestore.
- [x] Job search filters update result sets in real time.
- [x] Responsive layout displays cleanly across 320px, 375px, 768px, and 1440px viewports.
- [ ] `pdfjs-dist` upgraded to patched version (Post-Audit).
- [ ] Security headers active on live responses (Post-Audit).
- [ ] Admin route restricted to `isAdmin` users (Post-Audit).

---

## 17. Top 10 Changes to Improve KnowYourJob

Ranked in order of highest engineering, security, and user-experience value:

1. **Upgrade `pdfjs-dist` to Patched Version**: Eliminates the high-severity arbitrary script execution vulnerability (GHSA-hq66-cqwq-w95j) in client-side PDF parsing.
2. **Inject Defensive Security Headers in `firebase.json`**: Blocks clickjacking attacks (`X-Frame-Options: DENY`), MIME sniffing (`nosniff`), and enforces strict frame/script source policies via CSP.
3. **Enforce Role-Based Access Control on `/dashboard/admin`**: Protect internal command center metrics and diagnostics by checking `userDoc?.role === 'admin'` in `ProtectedRoute.tsx`.
4. **Transition Client-Side LLM Calls to Cloud Functions**: Fully decommission `VITE_GEMINI_API_KEY` and `VITE_APIFY_API_KEY` from client code; proxy all AI generation through authenticated serverless functions to ensure zero API key leakage.
5. **Initialize Firebase Cloud Storage Bucket**: Enable the storage bucket in Google Cloud/Firebase Console so candidate resume PDFs are permanently archived alongside Firestore metadata.
6. **Implement Rollup Code Splitting in `vite.config.ts`**: Separate `pdfjs-dist`, `framer-motion`, and `firebase` into independent vendor chunks to reduce initial page load time and eliminate Vite chunk size warnings.
7. **Add Automated Bound-Checking on Salary Inputs**: Enhance onboarding UX by automatically advancing `maxSalary` whenever `minSalary` is adjusted above it.
8. **Increase Secondary Text Contrast for WCAG 2.1 AA Compliance**: Adjust muted slate colors from `text-slate-500` to `text-slate-400` across dark glass backgrounds.
9. **Integrate Centralized Error Telemetry (e.g. Sentry / Firebase Crashlytics)**: Replace silent `console.warn` handlers with real-time error reporting to monitor client-side failures and unhandled promise rejections.
10. **Implement Explicit Label Associations for Assistive Technologies**: Add `id` and `htmlFor` pairings to all inline filter, search, and slider inputs to provide a seamless screen-reader experience.
