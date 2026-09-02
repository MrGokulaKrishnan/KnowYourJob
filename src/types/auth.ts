import { User as FirebaseUser } from 'firebase/auth';
import { AppUser } from './user';

export type AuthProviderType = 'password' | 'google.com' | 'emailLink';

export type AuthState = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR';

export type EmailLinkFlowState = 
  | 'IDLE' 
  | 'SENDING' 
  | 'EMAIL_SENT' 
  | 'PROCESSING_LINK' 
  | 'AUTHENTICATED' 
  | 'ERROR';

export interface AuthContextType {
  user: FirebaseUser | null;
  userDoc: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'pending';
  
  // Auth methods
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string, url: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}
