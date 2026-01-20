
import { ProductionRecord } from '../types';

const STORAGE_KEY = 'egg_tray_production_data';

export const db = {
  getRecords: (): ProductionRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveRecord: (record: ProductionRecord) => {
    const records = db.getRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  syncRecords: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = db.getRecords();
        const synced = records.map(r => ({ ...r, isSynced: true }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
        resolve(true);
      }, 1500);
    });
  },

  getUnsyncedCount: (): number => {
    return db.getRecords().filter(r => !r.isSynced).length;
  }
};
