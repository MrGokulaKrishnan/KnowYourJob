import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase/auth';
import { authService } from '../services/firebase/authService';
import { getUserDoc, syncUserDocument } from '../services/firebase/userService';
import { AppUser } from '../types/user';
import { AuthContextType } from '../types/auth';
import { getAuthErrorMessage } from '../utils/authErrorMapper';
import { useToast } from './ToastContext';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const fetchUserData = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setUser(null);
      setUserDoc(null);
      setLoading(false);
      return;
    }

    setUser(firebaseUser);
    try {
      let doc = await getUserDoc(firebaseUser.uid);

      if (!doc) {
        // Idempotent creation if missing
        const providerId = firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google.com' : 'password';
        doc = await syncUserDocument(firebaseUser, providerId);
      }

      setUserDoc(doc);
    } catch (err) {
      console.warn('Error synchronizing user data, using session fallback:', err);
      setUserDoc({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || null,
        email: firebaseUser.email || null,
        photoURL: firebaseUser.photoURL || null,
        provider: (firebaseUser.providerData[0]?.providerId as any) || 'password',
        onboardingCompleted: true,
        accountStatus: 'active',
        role: 'user',
        createdAt: null as any,
        updatedAt: null as any,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Single centralized onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await fetchUserData(firebaseUser);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      await fetchUserData(auth.currentUser);
    }
  }, [fetchUserData]);

  const signInWithEmailPassword = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    try {
      await authService.signInWithEmailPassword(email, pass);
      showToast('Welcome back! Your dashboard is ready.', 'success', 'Signed In');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Sign In Failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const signUpWithEmailPassword = useCallback(async (email: string, pass: string, fullName: string) => {
    setLoading(true);
    try {
      await authService.signUpWithEmailPassword(email, pass, fullName);
      showToast('Account successfully created! Please verify your email.', 'success', 'Account Created');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Registration Failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      showToast('Successfully authenticated with Google!', 'success', 'Google Connected');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Google Sign-In Failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const sendEmailLink = useCallback(async (email: string) => {
    try {
      await authService.sendSignInLink(email);
      showToast(`We sent a secure sign-in link to ${email}.`, 'info', 'Check Your Inbox');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Dispatch Failed');
      throw error;
    }
  }, [showToast]);

  const completeEmailLinkSignIn = useCallback(async (email: string, url: string) => {
    setLoading(true);
    try {
      await authService.completeEmailLinkSignIn(email, url);
      showToast('Passwordless sign-in confirmed! Welcome.', 'success', 'Authenticated');
    } catch (error) {
      // If user is already authenticated in Firebase, suppress false-alarm error toast
      if (auth.currentUser) {
        return;
      }
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Verification Failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await authService.sendPasswordReset(email);
      showToast(`Password reset link sent to ${email}.`, 'info', 'Email Sent');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Reset Failed');
      throw error;
    }
  }, [showToast]);

  const sendEmailVerification = useCallback(async () => {
    if (!auth.currentUser) throw new Error('No user is currently signed in.');
    try {
      await authService.sendVerificationEmail(auth.currentUser);
      showToast('Verification email resent. Check your inbox.', 'info', 'Sent');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Verification Error');
      throw error;
    }
  }, [showToast]);

  const reauthenticate = useCallback(async (password: string) => {
    try {
      await authService.reauthenticateUser(password);
      showToast('Identity verified.', 'success');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Authentication Failed');
      throw error;
    }
  }, [showToast]);

  const deleteAccount = useCallback(async (password?: string) => {
    try {
      await authService.deleteUserAccount(password);
      setUser(null);
      setUserDoc(null);
      showToast('Your account and associated profile have been permanently deleted.', 'info', 'Account Closed');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Deletion Error');
      throw error;
    }
  }, [showToast]);

  const signOut = useCallback(async () => {
    try {
      await authService.signOutUser();
      setUser(null);
      setUserDoc(null);
      showToast('You have been signed out safely.', 'info', 'Logged Out');
    } catch (error) {
      const msg = getAuthErrorMessage(error);
      showToast(msg, 'error', 'Sign Out Failed');
      throw error;
    }
  }, [showToast]);

  const isAuthenticated = !!user;
  const isEmailVerified = !!user?.emailVerified;
  const accountStatus = userDoc?.accountStatus || 'active';

  const value: AuthContextType = {
    user,
    userDoc,
    loading,
    isAuthenticated,
    isEmailVerified,
    accountStatus,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signInWithGoogle,
    sendEmailLink,
    completeEmailLinkSignIn,
    sendPasswordReset,
    sendEmailVerification,
    reauthenticate,
    deleteAccount,
    signOut,
    reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
