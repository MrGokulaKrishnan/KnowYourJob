import {
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';
import { app, isEmulatorEnabled } from './config';

// Modern Firebase v10 persistent cache (replaces deprecated enableIndexedDbPersistence)
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

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
