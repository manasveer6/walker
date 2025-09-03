import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, DailyProgress, HistoryDay } from '../types';

const STORAGE_KEYS = {
  USER_SETTINGS: '@walker_user_settings',
  DAILY_PROGRESS: '@walker_daily_progress',
  HISTORY: '@walker_history',
};

const DEFAULT_SETTINGS: UserSettings = {
  dailyQuota: 8,
  walkDuration: 5,
  themeMode: 'system',
  notificationsEnabled: true,
};

export class StorageService {
  // User Settings
  static async getUserSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        return { ...DEFAULT_SETTINGS, ...settings };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }

  // Daily Progress
  static async getDailyProgress(date: string): Promise<DailyProgress | null> {
    try {
      const progressJson = await AsyncStorage.getItem(`${STORAGE_KEYS.DAILY_PROGRESS}_${date}`);
      if (progressJson) {
        const progress = JSON.parse(progressJson);
        // Convert date strings back to Date objects
        progress.walkSlots = progress.walkSlots.map((slot: any) => ({
          ...slot,
          completedAt: slot.completedAt ? new Date(slot.completedAt) : undefined,
        }));
        return progress;
      }
      return null;
    } catch (error) {
      console.error('Error loading daily progress:', error);
      return null;
    }
  }

  static async saveDailyProgress(progress: DailyProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.DAILY_PROGRESS}_${progress.date}`,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Error saving daily progress:', error);
    }
  }

  // History
  static async getHistory(): Promise<HistoryDay[]> {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  static async saveHistory(history: HistoryDay[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  static async addToHistory(historyDay: HistoryDay): Promise<void> {
    try {
      const history = await this.getHistory();
      const existingIndex = history.findIndex(day => day.date === historyDay.date);

      if (existingIndex >= 0) {
        history[existingIndex] = historyDay;
      } else {
        history.push(historyDay);
      }

      // Keep only last 30 days in history
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const trimmedHistory = history.slice(0, 30);

      await this.saveHistory(trimmedHistory);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }

  // Cleanup old data
  static async cleanupOldData(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const progressKeys = allKeys.filter(key =>
        key.startsWith(STORAGE_KEYS.DAILY_PROGRESS) && key !== STORAGE_KEYS.DAILY_PROGRESS
      );

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const keysToDelete = progressKeys.filter(key => {
        const dateStr = key.replace(`${STORAGE_KEYS.DAILY_PROGRESS}_`, '');
        const keyDate = new Date(dateStr);
        return keyDate < thirtyDaysAgo;
      });

      if (keysToDelete.length > 0) {
        await AsyncStorage.multiRemove(keysToDelete);
      }
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }
}
