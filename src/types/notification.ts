import { Timestamp, FieldValue } from 'firebase/firestore';

export type NotificationType = 'match' | 'application' | 'automation' | 'system' | 'security';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: Timestamp | FieldValue;
}

export interface ResumeMetadata {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  downloadUrl?: string;
  isPrimary: boolean;
  analysisStatus: 'pending' | 'analyzed' | 'failed';
  atsScore?: number;
  uploadedAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
