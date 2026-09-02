// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Firebase Client SDK Initialization
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
} from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

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
export const db       = getFirestore(app)
export const storage  = getStorage(app)
export const functions = getFunctions(app)

// â”€â”€ Offline persistence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Enable for better offline experience (non-critical if it fails)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open â€” only works in one tab at a time
    console.warn('[Firebase] Persistence failed: multiple tabs open')
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn('[Firebase] Persistence not supported in this browser')
  }
})

// â”€â”€ Emulator support (development only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  console.info('[Firebase] Using emulators')
}

export { app }
export default app

