export interface WalkSlot {
  id: string;
  hour: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  walkSlots: WalkSlot[];
  completedWalks: number;
  totalWalks: number;
}

export interface UserSettings {
  dailyQuota: number;
  walkDuration: number; // in minutes
  themeMode: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export interface HistoryDay {
  date: string;
  completionPercentage: number;
  completedWalks: number;
  totalWalks: number;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    onSurface: string;
    notification: string;
  };
}
