import { 
  getAuth, 
  connectAuthEmulator, 
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  ActionCodeSettings,
  Auth
} from 'firebase/auth';
import { app, isEmulatorEnabled } from './config';

export const auth: Auth = getAuth(app);

// Configure standard browser local persistence for robust auth sessions
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence warning:', err);
});

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Setup action code settings for Passwordless Email Link Auth
export const getEmailLinkActionCodeSettings = (): ActionCodeSettings => {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://knowyourjob.web.app';
  return {
    url: `${origin}/auth/auth-action`,
    handleCodeInApp: true,
  };
};

// Connect to Auth Emulator if enabled
if (isEmulatorEnabled && typeof window !== 'undefined') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.info('Connected to Firebase Auth Emulator at http://localhost:9099');
  } catch {
    // Emulator might already be connected in hot module reloads
  }
}

export default auth;



