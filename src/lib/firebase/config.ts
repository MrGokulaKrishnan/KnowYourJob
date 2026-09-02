import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Centralized Firebase web configuration for knowyourjob17
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'VITE_FIREBASE_API_KEY_REMOVED',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'VITE_AUTH_DOMAIN_REMOVED',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob17',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'VITE_STORAGE_BUCKET_REMOVED',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'VITE_SENDER_ID_REMOVED',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'VITE_FIREBASE_APP_ID_REMOVED',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'VITE_MEASUREMENT_ID_REMOVED',
};

// Singleton initialization to prevent multiple instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const isEmulatorEnabled = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export default app;
