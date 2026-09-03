import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../../lib/firebase/firestore';
import { AppUser } from '../../types/user';
import { CandidateProfile } from '../../types/profile';

export const syncUserDocument = async (
  firebaseUser: FirebaseUser,
  provider: 'password' | 'google.com' | 'emailLink',
  customDisplayName?: string
): Promise<AppUser> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const profileRef = doc(db, 'profiles', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const displayName = customDisplayName || firebaseUser.displayName || null;
  const email = firebaseUser.email || null;
  const photoURL = firebaseUser.photoURL || null;

  if (userSnap.exists()) {
    const data = userSnap.data() as AppUser;
    // Update existing user doc
    const updates: Partial<AppUser> = {
      displayName: displayName || data.displayName,
      photoURL: photoURL || data.photoURL,
      provider: provider || data.provider,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(userRef, updates);
    return { ...data, ...updates } as AppUser;
  } else {
    // Create new user doc
    const newUserData: AppUser = {
      uid: firebaseUser.uid,
      displayName,
      email,
      photoURL,
      provider,
      onboardingCompleted: false,
      accountStatus: 'active',
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, newUserData);

    // Also initialize base candidate profile document
    const baseProfile: CandidateProfile = {
      basicInfo: {
        firstName: displayName ? displayName.split(' ')[0] : '',
        lastName: displayName && displayName.split(' ').length > 1 ? displayName.split(' ').slice(1).join(' ') : '',
        phone: '',
        location: '',
      },
      professional: {
        headline: '',
        summary: '',
        yearsOfExperience: 0,
      },
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      preferences: {
        roles: [],
        locations: [],
        remoteType: 'any',
        minimumSalary: null,
        employmentTypes: ['full-time'],
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(profileRef, baseProfile);

    return newUserData;
  }
};

export const getUserDoc = async (uid: string): Promise<AppUser | null> => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
};

export const updateUserDoc = async (uid: string, updates: Partial<AppUser>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const deleteUserData = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid));
  await deleteDoc(doc(db, 'profiles', uid));
  await deleteDoc(doc(db, 'automationSettings', uid));
};
