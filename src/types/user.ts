import { Timestamp, FieldValue } from 'firebase/firestore';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: 'password' | 'google.com' | 'emailLink';
  onboardingCompleted: boolean;
  accountStatus: 'active' | 'suspended' | 'pending';
  role: 'user' | 'admin';
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
