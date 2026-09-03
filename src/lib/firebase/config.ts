import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Centralized Firebase web configuration for knowyourjob17
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC5gPrPoR7HB3hgVfRRa75HakHC6ynHM1c',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'knowyourjob17.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob17',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'knowyourjob17.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '92777178236',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:92777178236:web:18a1e1580d15efcfebd5f9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-RFE9FH4Z7Z',
};

// Singleton initialization to prevent multiple instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const isEmulatorEnabled = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export default app;
