import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Centralized Firebase web configuration for knowyourjob
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'knowyourjob.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'knowyourjob.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Singleton initialization to prevent multiple instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const isEmulatorEnabled = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export default app;
