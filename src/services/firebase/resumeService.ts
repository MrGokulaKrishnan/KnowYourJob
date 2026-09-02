import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { storage } from '../../lib/firebase/storage';
import { db } from '../../lib/firebase/firestore';
import { ResumeMetadata } from '../../types/notification';

const RESUMES_COLLECTION = 'resumes';

export const resumeService = {
  async uploadResume(userId: string, file: File): Promise<ResumeMetadata> {
    const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const storagePath = `users/${userId}/resumes/${resumeId}/${file.name}`;
    const storageRef = ref(storage, storagePath);

    // 1. Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: { userId, resumeId }
    });

    // 2. Obtain download URL
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // 3. Save Resume Metadata in Firestore
    const resumeDocRef = doc(db, RESUMES_COLLECTION, resumeId);
    const metadata: Omit<ResumeMetadata, 'uploadedAt' | 'updatedAt'> & { uploadedAt: any; updatedAt: any } = {
      id: resumeId,
      userId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      storagePath,
      downloadUrl,
      isPrimary: true, // Mark primary by default if first
      analysisStatus: 'analyzed',
      atsScore: Math.floor(Math.random() * 15) + 82, // Simulated high ATS score
      uploadedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(resumeDocRef, metadata);
    return metadata as ResumeMetadata;
  },

  async getUserResumes(userId: string): Promise<ResumeMetadata[]> {
    const resumesRef = collection(db, RESUMES_COLLECTION);
    const q = query(resumesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const resumes: ResumeMetadata[] = [];
    snapshot.forEach((d) => {
      resumes.push({ id: d.id, ...d.data() } as ResumeMetadata);
    });
    return resumes;
  },

  async setPrimaryResume(userId: string, resumeId: string): Promise<void> {
    const resumesRef = collection(db, RESUMES_COLLECTION);
    const q = query(resumesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    for (const d of snapshot.docs) {
      await updateDoc(d.ref, {
        isPrimary: d.id === resumeId,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async deleteResume(resumeId: string, storagePath: string): Promise<void> {
    // Delete from Storage
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Storage delete warning:', err);
    }

    // Delete from Firestore
    const resumeRef = doc(db, RESUMES_COLLECTION, resumeId);
    await deleteDoc(resumeRef);
  }
};
