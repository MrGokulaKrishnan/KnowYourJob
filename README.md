# KnowYourJob ⚡

> **Find Smarter. Apply Faster.**
> Next-generation AI autonomous career discovery, matching, ATS resume analysis, and application platform.

---

## 🌟 Overview

**KnowYourJob** is built with React 19, TypeScript, Tailwind CSS, and a complete Firebase v12 backend foundation. It features a futuristic **Liquid Glass + Yellow Gradient** aesthetic designed for speed, security, and high conversion.

### Core Capabilities

- **3 Authentication Channels**:
  - 📧 **Email + Password**: Full validation, email verification enforcement, and password reset.
  - 🔗 **Passwordless Email Link**: Magic sign-in links dispatched via Firebase Authentication without passwords.
  - 🌐 **Google OAuth**: One-click Google sign-in with idempotent Firestore user synchronization.
- **Strict Data Isolation**:
  - User-scoped Firestore security rules (`users`, `profiles`, `applications`, `resumes`, `automationSettings`, `notifications`).
  - Read-only shared public jobs catalog.
  - Client tampering protection on privileged administrative and account status fields.
- **Encrypted Cloud Storage**:
  - Secure resume file storage under `users/{uid}/resumes/{resumeId}/{fileName}` with 10MB limits and PDF/DOCX MIME validation.
- **Autonomous Application Pipeline**:
  - Safety thresholds (minimum match score, daily submission caps).
  - Immutable execution audit logs.
- **Zero-Flicker Route Protection**:
  - Preserves intended destinations (e.g. `/dashboard/applications`).
  - Onboarding gate routing first-time candidates to profile setup.

---

## 🏗️ Architecture

```
                            KnowYourJob Web App (React 19 + TS)
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
          Firebase Authentication                         Cloud Firestore
  ┌────────────────┼────────────────┐             ┌──────────────┼──────────────┐
  ▼                ▼                ▼             ▼              ▼              ▼
Email/Password   Google       Passwordless   users/{uid}    profiles/{uid}  applications
+ Verification   OAuth        Email Link          │              │         & automation
                                                  └──────────────┴──────────────┘
                                                                 │
                                                       Firebase Storage
                                                                 │
                                                   users/{uid}/resumes/{id}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20+` or `v22+`
- **npm**: `v10+`
- **Firebase CLI**: `npm install -g firebase-tools`

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/knowyourjob.git
cd knowyourjob

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your Web App configuration keys from the [Firebase Console](https://console.firebase.google.com/):

```ini
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_USE_FIREBASE_EMULATOR=false
```

> ⚠️ **Security Notice**: Never commit `.env` or Firebase service account private keys to version control. Only commit `.env.example`.

### 3. Local Development

```bash
# Start local Vite development server
npm run dev
```

Visit `http://localhost:5173` to experience the app.

---

## 🧪 Testing & Verification

```bash
# Verify TypeScript compilation (0 errors)
npm run typecheck

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Firebase Security Rules & Indexes

Deploy Cloud Firestore security rules and compound indexes:

```bash
# Deploy Firestore rules & indexes
firebase deploy --only firestore:rules,firestore:indexes --project your-project-id

# Deploy Storage rules (after enabling Storage in Console)
firebase deploy --only storage --project your-project-id
```

---

## 📁 Project Structure

```
KnowYourJob/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── src/
│   ├── components/
│   │   ├── auth/                  # ProtectedRoute guards
│   │   ├── glass/                 # Liquid glass component library
│   │   ├── layout/                # AuthLayout, DashboardLayout
│   │   └── ui/                    # LiquidButton, GlassInput, Loaders
│   ├── context/
│   │   ├── AuthContext.tsx        # Centralized auth state & methods
│   │   └── ToastContext.tsx       # Liquid glass toast notifications
│   ├── hooks/
│   │   └── useAuth.ts             # Auth consumer hook
│   ├── lib/
│   │   └── firebase/              # Firebase singleton instances
│   ├── pages/
│   │   ├── auth/                  # Login, Register, Verify, Forgot Password
│   │   ├── dashboard/             # Overview, Jobs, Apps, Resume, Settings
│   │   ├── onboarding/            # Profile onboarding wizard
│   │   └── LandingPage.tsx        # High-converting futuristic hero page
│   ├── services/
│   │   └── firebase/              # Pure Firebase & Firestore services
│   ├── types/                     # TypeScript domain models
│   └── utils/                     # Error mappers & Zod validation
├── firestore.rules                # Production Firestore security rules
├── firestore.indexes.json         # Compound indexes
├── storage.rules                  # Firebase Storage security rules
├── firebase.json                  # Firebase configuration
└── package.json
```

---

## 📄 License

Private proprietary software. All rights reserved.
