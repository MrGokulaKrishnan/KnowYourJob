import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  writeBatch,
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../../lib/firebase/firestore';
import { AppNotification } from '../../types/notification';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  async getNotifications(userId: string, maxResults = 25): Promise<AppNotification[]> {
    const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notifRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    const notifications: AppNotification[] = [];
    snapshot.forEach((d) => {
      notifications.push({ id: d.id, ...d.data() } as AppNotification);
    });
    return notifications;
  },

  // Subscribe to real-time notification alerts
  subscribeNotifications(userId: string, callback: (notifications: AppNotification[]) => void): Unsubscribe {
    const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notifRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const items: AppNotification[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as AppNotification);
      });
      callback(items);
    }, (error) => {
      console.warn('Notification snapshot listener error:', error);
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notifRef, { read: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(notifRef, where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  }
};
