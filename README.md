# KnowYourJob

> **Find Smarter. Apply Faster.**

**KnowYourJob** is an AI-powered career discovery and job application platform designed to help candidates discover relevant opportunities, evaluate job compatibility, analyze resumes, and manage their application workflow.

Built with **React 19, TypeScript, Tailwind CSS, and Firebase**, the platform combines intelligent career workflows with a secure, user-isolated application architecture.

---

## Overview

KnowYourJob is designed to simplify the modern job-search process by bringing job discovery, candidate profiles, resume analysis, job matching, and application management into a single platform.

The application follows a structured career workflow:

```text
Discover
   ↓
Analyze
   ↓
Match
   ↓
Optimize
   ↓
Apply
   ↓
Track
```

The user interface uses a modern **Liquid Glass and Yellow Gradient** visual system while maintaining a responsive experience across desktop, tablet, and mobile devices.

---

## Core Capabilities

### Authentication

KnowYourJob supports three authentication methods through Firebase Authentication.

#### Email & Password

* User registration
* Email verification
* Password validation
* Password reset
* Session persistence

#### Passwordless Email Link

* Password-free authentication
* Secure email sign-in links
* Firebase Authentication integration

#### Google OAuth

* One-click Google authentication
* Firebase OAuth integration
* Idempotent Firestore user synchronization

---

## Data Isolation

User data is logically isolated using authenticated Firebase user identities.

Protected user-specific resources include:

```text
users
profiles
applications
resumes
automationSettings
notifications
```

Firestore security rules enforce user-level access boundaries.

The application also protects privileged account and administrative fields from unauthorized client-side modification.

The public jobs catalog is designed as a read-only shared resource.

---

## Resume Storage

Resume documents are stored using Firebase Cloud Storage with user-scoped paths.

```text
users/{uid}/resumes/{resumeId}/{fileName}
```

### Storage Controls

* Maximum file size: **10 MB**
* PDF validation
* DOCX validation
* User-scoped storage paths
* Firebase Storage security rules

The storage architecture is designed to prevent users from accessing another user's protected resume files.

---

## Job Discovery & Matching

KnowYourJob provides a structured workflow for discovering and evaluating job opportunities.

The platform can use candidate profile information and job requirements to help identify relevant opportunities.

### Matching Workflow

```text
Candidate Profile
       ↓
Job Requirements
       ↓
Requirement Analysis
       ↓
Compatibility Evaluation
       ↓
Relevant Opportunities
```

Matching results are intended to assist candidate decision-making and should not be interpreted as a guarantee of employment, interview selection, or recruiter response.

---

## ATS Resume Analysis

Resume analysis can be incorporated into the job-search workflow to help candidates understand how their resume aligns with target opportunities.

Typical analysis areas include:

* Skills
* Keywords
* Experience
* Job requirements
* Resume completeness
* Formatting compatibility
* Role relevance

ATS results should be treated as estimates because actual Applicant Tracking System implementations vary between vendors and employers.

---

## Autonomous Application Pipeline

KnowYourJob provides an application automation architecture with configurable safety controls.

### Safety Controls

* Minimum match-score thresholds
* Daily application submission limits
* User-configurable automation settings
* Execution tracking
* Immutable audit records

Conceptual workflow:

```text
Job Discovery
     ↓
Compatibility Check
     ↓
Safety Threshold
     ↓
Automation Rules
     ↓
Application Execution
     ↓
Audit Log
```

The safety layer is designed to prevent unrestricted automated application activity.

---

## Route Protection

The application implements protected routing for authenticated areas.

Route protection supports:

* Authentication state validation
* Intended destination preservation
* Session-aware navigation
* Onboarding enforcement
* Protected dashboard access

Example:

```text
Unauthenticated User
        ↓
Authentication
        ↓
Original Destination
        ↓
Dashboard
```

First-time users can be redirected through the onboarding flow before accessing the main application workspace.

---

## Architecture

```text
                         KnowYourJob
                    React 19 + TypeScript
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
     Firebase Authentication             Cloud Firestore
             |                                 |
     +-------+--------+              +---------+---------+
     |       |        |              |         |         |
     v       v        v              v         v         v
   Email   Google  Passwordless    Users    Profiles Applications
   Auth    OAuth   Email Link        |         |          |
                                     +---------+----------+
                                               |
                                               v
                                      Automation Settings
                                               |
                                               v
                                       Firebase Storage
                                               |
                                               v
                                  users/{uid}/resumes/{id}
```

---

# Technology Stack

| Technology              | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| React 19                | Frontend application                     |
| TypeScript              | Type-safe development                    |
| Tailwind CSS            | UI styling                               |
| Vite                    | Development and production build tooling |
| Firebase Authentication | User authentication                      |
| Cloud Firestore         | Application and user data                |
| Firebase Storage        | Resume document storage                  |
| Firebase Hosting        | Production deployment                    |
| Zod                     | Runtime input validation                 |
| GitHub Actions          | Continuous integration                   |

---

# Security Architecture

Security is a fundamental part of the application design.

### Authentication Security

* Firebase Authentication
* Email verification
* Password reset workflows
* OAuth authentication
* Passwordless authentication
* Protected application routes

### Firestore Security

Firestore rules enforce user-level access to protected collections.

Conceptually:

```text
Authenticated User
       |
       v
Firebase UID
       |
       v
User-Owned Resources
       |
       +--> Profile
       +--> Resume
       +--> Applications
       +--> Automation Settings
       +--> Notifications
```

A client must not be trusted to enforce authorization by itself. Security-critical access control is enforced through Firebase Security Rules.

### Storage Security

Resume files use user-scoped storage paths and Firebase Storage rules to restrict unauthorized access.

### Client Security

The application validates user input using schema-based validation and avoids relying solely on client-side checks for authorization.

---

# Project Structure

```text
KnowYourJob/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute
│   │   │
│   │   ├── glass/
│   │   │   └── Liquid Glass components
│   │   │
│   │   ├── layout/
│   │   │   ├── AuthLayout
│   │   │   └── DashboardLayout
│   │   │
│   │   └── ui/
│   │       ├── LiquidButton
│   │       ├── GlassInput
│   │       └── Loaders
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.ts
│   │
│   ├── lib/
│   │   └── firebase/
│   │       └── Firebase singleton instances
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login
│   │   │   ├── Register
│   │   │   ├── Verify
│   │   │   └── Forgot Password
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Overview
│   │   │   ├── Jobs
│   │   │   ├── Applications
│   │   │   ├── Resume
│   │   │   └── Settings
│   │   │
│   │   ├── onboarding/
│   │   │   └── Profile onboarding
│   │   │
│   │   └── LandingPage.tsx
│   │
│   ├── services/
│   │   └── firebase/
│   │       └── Firebase & Firestore services
│   │
│   ├── types/
│   │   └── TypeScript domain models
│   │
│   └── utils/
│       ├── Error mappers
│       └── Zod validation
│
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── package.json
└── README.md
```

---

# Getting Started

## Prerequisites

Ensure the following are installed:

* **Node.js 20+**
* **npm 10+**
* **Firebase CLI**

Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/knowyourjob.git
cd knowyourjob
```

Install dependencies:

```bash
npm install
```

---

# Environment Configuration

Create a local environment file from the example configuration:

```bash
cp .env.example .env
```

Configure the Firebase Web App credentials:

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

### Environment Security

Never commit:

```text
.env
```

or Firebase service-account private keys to the repository.

Only the example configuration should be committed:

```text
.env.example
```

---

# Local Development

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# Type Checking

Verify TypeScript compilation:

```bash
npm run typecheck
```

The project should complete type checking without TypeScript errors before deployment.

---

# Firebase Deployment

Authenticate with Firebase:

```bash
firebase login
```

Select or configure the appropriate Firebase project.

Deploy Firestore rules and indexes:

```bash
firebase deploy \
  --only firestore:rules,firestore:indexes \
  --project your-project-id
```

Deploy Firebase Storage rules:

```bash
firebase deploy \
  --only storage \
  --project your-project-id
```

Deploy the application using the project's configured Firebase Hosting workflow.

---

# Testing & Verification

Before production deployment, verify the following areas.

## Authentication

* Email/password registration
* Email verification
* Email/password login
* Password reset
* Passwordless email authentication
* Google OAuth
* Logout
* Session persistence
* Unauthorized route protection

## User Data

* Profile creation
* Profile updates
* User-specific Firestore access
* Application data isolation
* Resume data isolation
* Notification isolation
* Automation settings isolation

## Resume Management

* Resume creation
* Resume upload
* PDF validation
* DOCX validation
* File-size restrictions
* Resume retrieval
* Resume deletion
* Unauthorized file-access prevention

## Job Discovery

* Job search
* Search filters
* Job details
* Job matching
* Empty-result handling
* Invalid input handling
* Duplicate job handling

## Application Automation

* Match-score threshold
* Daily submission limits
* Automation settings
* Execution handling
* Audit logging
* Failure handling

## Responsive UI

Verify the application on:

* Desktop
* Laptop
* Tablet
* Mobile

---

# CI/CD

The repository includes GitHub Actions infrastructure under:

```text
.github/workflows/
```

The CI pipeline can be used to automatically verify:

```text
Install Dependencies
        ↓
Type Check
        ↓
Build
        ↓
Validation
        ↓
Deployment
```

Production deployments should only be performed after successful validation.

---

# Design System

KnowYourJob uses a custom visual system based on:

* Liquid Glass components
* Yellow gradient accents
* Layered surfaces
* Modern typography
* Responsive layouts
* Consistent component primitives
* Accessible interactive states

The visual system is intended to provide a distinctive product identity while maintaining usability across device sizes.

---

# Development Principles

The project follows several engineering principles:

### Security First

Authorization must be enforced server-side through Firebase Security Rules rather than relying exclusively on frontend logic.

### Type Safety

TypeScript is used throughout the application to reduce runtime errors and improve maintainability.

### Separation of Concerns

Firebase operations are organized into dedicated service modules rather than being distributed throughout UI components.

### Reusable Components

Common UI patterns are implemented as reusable components to maintain consistency.

### Validation

User-controlled data is validated before being processed or persisted.

### Fail-Safe Automation

Automated workflows use configurable thresholds and limits to prevent unrestricted application activity.

---

# Roadmap

Potential future improvements include:

* Advanced AI job matching
* Personalized job recommendations
* Improved ATS analysis
* Job-source integrations
* Advanced application analytics
* Automated job alerts
* Resume-to-job compatibility scoring
* Enhanced application automation controls
* Interview preparation workflows
* Skill-gap analysis
* Career analytics
* Resume optimization
* Advanced notification workflows
* Accessibility improvements
* Performance optimization
* Expanded mobile experience

---

# Live Application

**KnowYourJob**

https://knowyourjob.web.app/

---

# License

**Private Proprietary Software — All Rights Reserved.**

This project is proprietary software. Unauthorized copying, modification, distribution, sublicensing, or commercial use is prohibited unless explicitly authorized by the copyright holder.

---

<p align="center">
  <strong>KnowYourJob</strong>
  <br>
  Find Smarter. Apply Faster.
</p>
