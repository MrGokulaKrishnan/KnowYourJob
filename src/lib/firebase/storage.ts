import { 
  getStorage, 
  connectStorageEmulator, 
  FirebaseStorage 
} from 'firebase/storage';
import { app, isEmulatorEnabled } from './config';

export const storage: FirebaseStorage = getStorage(app);

// Connect to Storage Emulator if enabled
if (isEmulatorEnabled && typeof window !== 'undefined') {
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
    console.info('Connected to Firebase Storage Emulator at localhost:9199');
  } catch {
    // Already connected in HMR
  }
}

export default storage;
