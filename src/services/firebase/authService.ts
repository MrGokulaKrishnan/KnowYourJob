import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider, getEmailLinkActionCodeSettings } from '../../lib/firebase/auth';
import { syncUserDocument } from './userService';

const EMAIL_STORAGE_KEY = 'knowyourjob_email_link_target';

export const authService = {
  // Method 1: Email + Password Login
  async signInWithEmailPassword(email: string, password: string): Promise<UserCredential> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    await syncUserDocument(cred.user, 'password');
    return cred;
  },

  // Method 1: Email + Password Registration
  async signUpWithEmailPassword(email: string, password: string, fullName: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    // Update Firebase Auth profile display name
    await updateProfile(cred.user, { displayName: fullName.trim() });
    
    // Create initial user document in Firestore
    await syncUserDocument(cred.user, 'password', fullName.trim());
    
    // Send email verification automatically
    try {
      await sendEmailVerification(cred.user);
    } catch (verErr) {
      console.warn('Could not auto-dispatch verification email:', verErr);
    }

    return cred;
  },

  // Method 2: Passwordless Email Link Send
  async sendSignInLink(email: string): Promise<void> {
    const settings = getEmailLinkActionCodeSettings();
    await sendSignInLinkToEmail(auth, email.trim(), settings);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, email.trim());
    }
  },

  // Method 2: Passwordless Email Link Complete Sign-In
  async completeEmailLinkSignIn(email: string, url: string): Promise<UserCredential> {
    if (!isSignInWithEmailLink(auth, url)) {
      throw { code: 'auth/invalid-email-link', message: 'The URL is not a valid email sign-in link.' };
    }

    let targetEmail = email;
    if (!targetEmail && typeof window !== 'undefined') {
      targetEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY) || '';
    }

    if (!targetEmail) {
      throw { code: 'auth/missing-email', message: 'Please confirm your email address to complete sign-in.' };
    }

    const cred = await signInWithEmailLink(auth, targetEmail.trim(), url);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(EMAIL_STORAGE_KEY);
    }

    await syncUserDocument(cred.user, 'emailLink');
    return cred;
  },

  // Method 3: Google Sign-in
  async signInWithGoogle(): Promise<UserCredential> {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserDocument(cred.user, 'google.com');
    return cred;
  },

  // Password Reset
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  // Resend Email Verification
  async sendVerificationEmail(user: FirebaseUser): Promise<void> {
    await sendEmailVerification(user);
  },

  // Reauthenticate for sensitive actions
  async reauthenticateUser(password: string): Promise<void> {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated user session found.');
    }
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  },

  // Delete User Account
  async deleteUserAccount(password?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently signed in.');

    // If password provided and user has password provider, re-authenticate first
    if (password && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }

    await deleteUser(user);
  },

  // Global Sign Out
  async signOutUser(): Promise<void> {
    await signOut(auth);
  },
};
