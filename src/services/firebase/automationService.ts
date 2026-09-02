import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/firestore';
import { AutomationSettings, AutomationLog } from '../../types/automation';

const SETTINGS_COLLECTION = 'automationSettings';
const LOGS_COLLECTION = 'automationLogs';

export const automationService = {
  async getSettings(userId: string): Promise<AutomationSettings> {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    const snap = await getDoc(settingsRef);

    if (snap.exists()) {
      return snap.data() as AutomationSettings;
    }

    // Default settings: enabled is strictly false by default
    const defaultSettings: AutomationSettings = {
      userId,
      enabled: false,
      mode: 'assisted',
      dailyLimit: 10,
      minimumMatchScore: 85,
      preferredRoles: [],
      preferredLocations: [],
      excludedCompanies: [],
      updatedAt: serverTimestamp(),
    };

    await setDoc(settingsRef, defaultSettings);
    return defaultSettings;
  },

  async updateSettings(userId: string, updates: Partial<AutomationSettings>): Promise<void> {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    await updateDoc(settingsRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async getLogs(userId: string, maxLogs = 20): Promise<AutomationLog[]> {
    const logsRef = collection(db, LOGS_COLLECTION);
    const q = query(
      logsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxLogs)
    );

    const snap = await getDocs(q);
    const logs: AutomationLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...d.data() } as AutomationLog);
    });
    return logs;
  }
};
