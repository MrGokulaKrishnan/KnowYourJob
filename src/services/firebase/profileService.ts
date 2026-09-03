import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/firestore';
import { CandidateProfile } from '../../types/profile';

export const profileService = {
  async getProfile(uid: string): Promise<CandidateProfile | null> {
    const profileRef = doc(db, 'profiles', uid);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return null;
    return snap.data() as CandidateProfile;
  },

  async updateProfile(uid: string, profileData: Partial<CandidateProfile>): Promise<void> {
    const profileRef = doc(db, 'profiles', uid);
    const sanitized = JSON.parse(JSON.stringify(profileData));
    await setDoc(profileRef, {
      ...sanitized,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async saveFullProfile(uid: string, profile: CandidateProfile): Promise<void> {
    const profileRef = doc(db, 'profiles', uid);
    const sanitized = JSON.parse(JSON.stringify(profile));
    await setDoc(profileRef, {
      ...sanitized,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
};
