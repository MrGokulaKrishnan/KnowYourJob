// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Firebase Client SDK Initialization
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// db is managed by lib/firebase/firestore.ts (uses modern persistentLocalCache)
export { db } from './firebase/firestore'

// Configuration loaded exclusively from environment variables.
// Set values in .env.local â€” never hardcode secrets in source files.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDUQDgvxI5aCDewo_UIpmjR87-eU-WNVyg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'knowyourjob-17.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob-17',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'knowyourjob-17.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '673034453640',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:673034453640:web:18a1e1580d15efcfebd5f9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EHSL3D00RZ',
}

// Initialize once (handles HMR re-imports)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth      = getAuth(app)
export const storage   = getStorage(app)
export const functions = getFunctions(app)

// â”€â”€ Emulator support (development only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectStorageEmulator(storage, 'localhost', 9199)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.info('[Firebase] Using emulators')
}

export { app }
export default app

