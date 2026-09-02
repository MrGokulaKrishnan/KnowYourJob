// ─────────────────────────────────────────────────────────────────────────────
// services/firebase/auth.ts
// Firebase v12 modular auth service — all sign-in methods + lifecycle helpers
// ─────────────────────────────────────────────────────────────────────────────

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { getAuthErrorMessage } from '@/utils/authErrorMapper'
import type { AppUser } from '@/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a raw Firebase user into our normalised AppUser shape.
 * Optionally override role and plan when creating a new record.
 */
export function firebaseUserToAppUser(
  fbUser: FirebaseUser,
  role: 'user' | 'admin' = 'user',
  _plan?: string
): AppUser {
  const provider = (fbUser.providerData[0]?.providerId ?? 'password') as AppUser['provider']
  return {
    uid: fbUser.uid,
    displayName: fbUser.displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    provider: provider === 'google.com' ? 'google.com' : provider === 'emailLink' ? 'emailLink' : 'password',
    onboardingCompleted: false,
    accountStatus: 'active',
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
}

/**
 * Upsert the `users/{uid}` Firestore document.
 * Creates a new one on first sign-up; updates mutable fields on subsequent logins.
 */
async function upsertUserDoc(
  fbUser: FirebaseUser,
  extraFields?: Partial<AppUser>
): Promise<AppUser> {
  const userRef = doc(db, 'users', fbUser.uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    const existing = snap.data() as AppUser
    const updates: Partial<AppUser> = {
      displayName: fbUser.displayName ?? existing.displayName,
      photoURL: fbUser.photoURL ?? existing.photoURL,
      updatedAt: serverTimestamp(),
      ...extraFields,
    }
    await updateDoc(userRef, updates)
    return { ...existing, ...updates } as AppUser
  }

  // First time — build the full document
  const provider = (fbUser.providerData[0]?.providerId ?? 'password') as AppUser['provider']
  const newUser: AppUser = {
    uid: fbUser.uid,
    displayName: fbUser.displayName,
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    provider: provider === 'google.com' ? 'google.com' : provider === 'emailLink' ? 'emailLink' : 'password',
    onboardingCompleted: false,
    accountStatus: 'active',
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...extraFields,
  }
  await setDoc(userRef, newUser)
  return newUser
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Sign in an existing user with email + password.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AppUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
    return await upsertUserDoc(cred.user)
  } catch (err) {
    throw new Error(getAuthErrorMessage(err))
  }
}

/**
 * Create a new account with email + password.
 * Sets the Firebase Auth displayName and creates the Firestore user doc.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AppUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)

    // Persist the display name in Firebase Auth
    await updateProfile(cred.user, { displayName: displayName.trim() })

    return await upsertUserDoc(cred.user, {
      displayName: displayName.trim(),
      onboardingCompleted: false,
    })
  } catch (err) {
    throw new Error(getAuthErrorMessage(err))
  }
}

/**
 * Sign in with a Google popup.
 */
export async function signInWithGoogle(): Promise<AppUser> {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const cred = await signInWithPopup(auth, provider)
    return await upsertUserDoc(cred.user)
  } catch (err) {
    throw new Error(getAuthErrorMessage(err))
  }
}

/**
 * Sign the current user out.
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (err) {
    throw new Error(getAuthErrorMessage(err))
  }
}

/**
 * Send a password-reset email.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim())
  } catch (err) {
    throw new Error(getAuthErrorMessage(err))
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 * The callback receives our AppUser (hydrated from Firestore) or null.
 * Returns the unsubscribe function.
 */
export function onAuthChange(
  callback: (user: AppUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null)
      return
    }

    try {
      // Try to read the Firestore doc; fall back to a minimal shape
      const userRef = doc(db, 'users', fbUser.uid)
      const snap = await getDoc(userRef)
      if (snap.exists()) {
        callback(snap.data() as AppUser)
      } else {
        // Doc not found — create it (handles edge-case where Firestore write failed earlier)
        const appUser = await upsertUserDoc(fbUser)
        callback(appUser)
      }
    } catch {
      // Network/permission error — return a minimal in-memory user so the app
      // doesn't get stuck in a loading state
      callback(firebaseUserToAppUser(fbUser))
    }
  })
}
