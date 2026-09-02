import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase/firestore';
import { Application, ApplicationStatus } from '../../types/application';

const APPLICATIONS_COLLECTION = 'applications';

export const applicationService = {
  async getApplications(
    userId: string, 
    statusFilter?: ApplicationStatus, 
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    pageSize = 15
  ) {
    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const constraints: any[] = [
      where('userId', '==', userId),
    ];

    if (statusFilter) {
      constraints.push(where('status', '==', statusFilter));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(pageSize));

    const q = query(appsRef, ...constraints);
    const snapshot = await getDocs(q);

    const applications: Application[] = [];
    snapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as Application);
    });

    const nextLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { applications, lastDoc: nextLastDoc, hasMore: applications.length === pageSize };
  },

  async createApplication(appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const newDocRef = doc(appsRef);
    const newApp = {
      ...appData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(newDocRef, newApp);
    return newDocRef.id;
  },

  async updateApplicationStatus(appId: string, status: ApplicationStatus, notes?: string): Promise<void> {
    const appRef = doc(db, APPLICATIONS_COLLECTION, appId);
    const updates: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (status === 'applied') {
      updates.appliedAt = serverTimestamp();
    }
    if (notes !== undefined) {
      updates.notes = notes;
    }
    await updateDoc(appRef, updates);
  },

  async deleteApplication(appId: string): Promise<void> {
    const appRef = doc(db, APPLICATIONS_COLLECTION, appId);
    await deleteDoc(appRef);
  }
};
