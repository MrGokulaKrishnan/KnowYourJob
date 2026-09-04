import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Centralized Firebase web configuration for knowyourjob-17
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDUQDgvxI5aCDewo_UIpmjR87-eU-WNVyg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'knowyourjob-17.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'knowyourjob-17',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'knowyourjob-17.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '673034453640',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:673034453640:web:bdc28f838ca6e59a5c953d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EHSL3D00RZ',
};

// Singleton initialization to prevent multiple instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const isEmulatorEnabled = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export default app;
