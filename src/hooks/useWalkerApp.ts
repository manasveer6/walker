import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { UserSettings, DailyProgress, WalkSlot, HistoryDay, TimerState } from '../types';
import { StorageService } from '../utils/storage';
import { NotificationService } from '../utils/notifications';
import {
  getTodayString,
  getCurrentHour,
  formatDate,
  getLast7Days,
  getTimeUntilMidnight
} from '../utils/dateUtils';

export const useWalkerApp = () => {
  const [settings, setSettings] = useState<UserSettings>({
    dailyQuota: 8,
    walkDuration: 5,
    themeMode: 'system',
    notificationsEnabled: true,
  });

  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [history, setHistory] = useState<HistoryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeRemaining: 0,
    totalTime: 0,
  });

  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const midnightTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize app data
  const initializeApp = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load settings
      const savedSettings = await StorageService.getUserSettings();
      setSettings(savedSettings);

      // Load today's progress
      const today = getTodayString();
      let todayProgress = await StorageService.getDailyProgress(today);

      // If no progress for today, create initial state
      if (!todayProgress) {
        todayProgress = createInitialDailyProgress(today, savedSettings.dailyQuota);
        await StorageService.saveDailyProgress(todayProgress);
      }

      // Check if quota has changed and update if needed
      if (todayProgress.totalWalks !== savedSettings.dailyQuota) {
        todayProgress = updateDailyProgressQuota(todayProgress, savedSettings.dailyQuota);
        await StorageService.saveDailyProgress(todayProgress);
      }

      setDailyProgress(todayProgress);

      // Load history
      const savedHistory = await StorageService.getHistory();
      setHistory(savedHistory);

      // Request notification permissions if enabled
      if (savedSettings.notificationsEnabled) {
        await NotificationService.requestPermissions();
        await scheduleNotifications(todayProgress);
      }

      // Clean up old data
      await StorageService.cleanupOldData();

    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create initial daily progress
  const createInitialDailyProgress = (date: string, quota: number): DailyProgress => {
    const walkSlots: WalkSlot[] = [];

    // Distribute walks across 24 hours
    const hoursPerWalk = 24 / quota;

    for (let i = 0; i < quota; i++) {
      const hour = Math.floor(i * hoursPerWalk);
      walkSlots.push({
        id: `${date}_${hour}_${i}`,
        hour,
        isCompleted: false,
      });
    }

    return {
      date,
      walkSlots,
      completedWalks: 0,
      totalWalks: quota,
    };
  };

  // Update daily progress when quota changes
  const updateDailyProgressQuota = (progress: DailyProgress, newQuota: number): DailyProgress => {
    const currentCompletedWalks = progress.walkSlots.filter(slot => slot.isCompleted);

    // Create new walk slots for the new quota
    const newWalkSlots: WalkSlot[] = [];
    const hoursPerWalk = 24 / newQuota;

    for (let i = 0; i < newQuota; i++) {
      const hour = Math.floor(i * hoursPerWalk);
      const existingSlot = currentCompletedWalks.find(slot => slot.hour === hour);

      newWalkSlots.push({
        id: `${progress.date}_${hour}_${i}`,
        hour,
        isCompleted: existingSlot ? true : false,
        completedAt: existingSlot?.completedAt,
      });
    }

    return {
      ...progress,
      walkSlots: newWalkSlots,
      totalWalks: newQuota,
      completedWalks: newWalkSlots.filter(slot => slot.isCompleted).length,
    };
  };

  // Schedule notifications for pending walks
  const scheduleNotifications = async (progress: DailyProgress) => {
    if (!settings.notificationsEnabled) return;

    const completedHours = new Set(
      progress.walkSlots.filter(slot => slot.isCompleted).map(slot => slot.hour)
    );

    await NotificationService.scheduleHourlyReminders(
      progress.totalWalks,
      completedHours
    );
  };

  // Save settings
  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await StorageService.saveUserSettings(updatedSettings);

    // Update notifications if setting changed
    if ('notificationsEnabled' in newSettings && dailyProgress) {
      if (updatedSettings.notificationsEnabled) {
        await NotificationService.requestPermissions();
        await scheduleNotifications(dailyProgress);
      } else {
        await NotificationService.cancelAllNotifications();
      }
    }

    // Update quota if changed
    if ('dailyQuota' in newSettings && dailyProgress && newSettings.dailyQuota !== dailyProgress.totalWalks) {
      const updatedProgress = updateDailyProgressQuota(dailyProgress, newSettings.dailyQuota!);
      setDailyProgress(updatedProgress);
      await StorageService.saveDailyProgress(updatedProgress);

      if (updatedSettings.notificationsEnabled) {
        await scheduleNotifications(updatedProgress);
      }
    }
  }, [settings, dailyProgress]);

  // Start walk timer
  const startWalk = useCallback((walkSlotId: string) => {
    const totalSeconds = settings.walkDuration * 60;

    setTimerState({
      isRunning: true,
      timeRemaining: totalSeconds,
      totalTime: totalSeconds,
    });

    timerInterval.current = setInterval(() => {
      setTimerState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          // Walk completed
          completeWalk(walkSlotId);
          return {
            isRunning: false,
            timeRemaining: 0,
            totalTime: prev.totalTime,
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);
  }, [settings.walkDuration]);

  // Stop walk timer
  const stopWalk = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    setTimerState({
      isRunning: false,
      timeRemaining: 0,
      totalTime: 0,
    });
  }, []);

  // Complete a walk
  const completeWalk = useCallback(async (walkSlotId: string) => {
    if (!dailyProgress) return;

    const updatedWalkSlots = dailyProgress.walkSlots.map(slot => {
      if (slot.id === walkSlotId) {
        return {
          ...slot,
          isCompleted: true,
          completedAt: new Date(),
        };
      }
      return slot;
    });

    const completedWalks = updatedWalkSlots.filter(slot => slot.isCompleted).length;

    const updatedProgress: DailyProgress = {
      ...dailyProgress,
      walkSlots: updatedWalkSlots,
      completedWalks,
    };

    setDailyProgress(updatedProgress);
    await StorageService.saveDailyProgress(updatedProgress);

    // Update history
    const historyDay: HistoryDay = {
      date: dailyProgress.date,
      completionPercentage: Math.round((completedWalks / dailyProgress.totalWalks) * 100),
      completedWalks,
      totalWalks: dailyProgress.totalWalks,
    };

    await StorageService.addToHistory(historyDay);

    // Reload history
    const updatedHistory = await StorageService.getHistory();
    setHistory(updatedHistory);

    // Stop timer if running
    stopWalk();

    // Send completion notification
    if (settings.notificationsEnabled) {
      if (completedWalks === dailyProgress.totalWalks) {
        await NotificationService.sendImmediateNotification(
          'Congratulations! 🎉',
          'You\'ve completed all your walks for today!'
        );
      } else {
        await NotificationService.sendImmediateNotification(
          'Walk Completed! ✅',
          `${completedWalks}/${dailyProgress.totalWalks} walks done today. Keep it up!`
        );
      }
    }

    // Reschedule notifications
    if (settings.notificationsEnabled) {
      await scheduleNotifications(updatedProgress);
    }
  }, [dailyProgress, settings.notificationsEnabled, stopWalk]);

  // Mark walk as undone (in case of mistake)
  const undoWalk = useCallback(async (walkSlotId: string) => {
    if (!dailyProgress) return;

    const updatedWalkSlots = dailyProgress.walkSlots.map(slot => {
      if (slot.id === walkSlotId) {
        return {
          ...slot,
          isCompleted: false,
          completedAt: undefined,
        };
      }
      return slot;
    });

    const completedWalks = updatedWalkSlots.filter(slot => slot.isCompleted).length;

    const updatedProgress: DailyProgress = {
      ...dailyProgress,
      walkSlots: updatedWalkSlots,
      completedWalks,
    };

    setDailyProgress(updatedProgress);
    await StorageService.saveDailyProgress(updatedProgress);

    // Update history
    const historyDay: HistoryDay = {
      date: dailyProgress.date,
      completionPercentage: Math.round((completedWalks / dailyProgress.totalWalks) * 100),
      completedWalks,
      totalWalks: dailyProgress.totalWalks,
    };

    await StorageService.addToHistory(historyDay);

    // Reload history
    const updatedHistory = await StorageService.getHistory();
    setHistory(updatedHistory);

    // Reschedule notifications
    if (settings.notificationsEnabled) {
      await scheduleNotifications(updatedProgress);
    }
  }, [dailyProgress, settings.notificationsEnabled]);

  // Get history for last 7 days
  const getLast7DaysHistory = useCallback((): HistoryDay[] => {
    const last7Days = getLast7Days();

    return last7Days.map(date => {
      const existingDay = history.find(day => day.date === date);
      return existingDay || {
        date,
        completionPercentage: 0,
        completedWalks: 0,
        totalWalks: settings.dailyQuota,
      };
    });
  }, [history, settings.dailyQuota]);

  // Handle app state changes (for midnight reset)
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // Check if it's a new day
      const today = getTodayString();
      if (dailyProgress && dailyProgress.date !== today) {
        // Reset for new day
        await initializeApp();
      }
    }
  }, [dailyProgress, initializeApp]);

  // Set up midnight reset timer
  const setupMidnightReset = useCallback(() => {
    if (midnightTimer.current) {
      clearTimeout(midnightTimer.current);
    }

    const timeUntilMidnight = getTimeUntilMidnight();

    midnightTimer.current = setTimeout(async () => {
      await initializeApp();
      setupMidnightReset(); // Set up for next day
    }, timeUntilMidnight);
  }, [initializeApp]);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    setupMidnightReset();

    return () => {
      subscription?.remove();
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      if (midnightTimer.current) {
        clearTimeout(midnightTimer.current);
      }
    };
  }, []);

  return {
    // State
    settings,
    dailyProgress,
    history,
    isLoading,
    timerState,

    // Actions
    updateSettings,
    startWalk,
    stopWalk,
    completeWalk,
    undoWalk,
    getLast7DaysHistory,
    initializeApp,
  };
};
