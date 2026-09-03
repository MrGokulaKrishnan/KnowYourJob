// ────────────────────────────────────────────────────────────────────────────
// Firebase Client SDK Initialization
// ────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// db is managed by lib/firebase/firestore.ts (uses modern persistentLocalCache)
export { db } from './firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'VITE_FIREBASE_API_KEY_REMOVED',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'VITE_AUTH_DOMAIN_REMOVED',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob17',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'VITE_STORAGE_BUCKET_REMOVED',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'VITE_SENDER_ID_REMOVED',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'VITE_FIREBASE_APP_ID_REMOVED',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'VITE_MEASUREMENT_ID_REMOVED',
}

// Initialize once (handles HMR re-imports)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth     = getAuth(app)
export const storage  = getStorage(app)
export const functions = getFunctions(app)

// ── Emulator support (development only) ─────────────────────────────────────
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectStorageEmulator(storage, 'localhost', 9199)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.info('[Firebase] Using emulators')
}

export { app }
export default app

