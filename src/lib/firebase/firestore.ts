import { 
  getFirestore, 
  connectFirestoreEmulator, 
  Firestore 
} from 'firebase/firestore';
import { app, isEmulatorEnabled } from './config';

export const db: Firestore = getFirestore(app);

// Connect to Firestore Emulator if enabled
if (isEmulatorEnabled && typeof window !== 'undefined') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.info('Connected to Firebase Firestore Emulator at localhost:8080');
  } catch {
    // Already connected in HMR
  }
}

export default db;
