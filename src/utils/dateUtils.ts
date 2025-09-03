export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
};

export const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(formatDate(date));
  }
  return days;
};

export const getHourFromDate = (date: Date): number => {
  return date.getHours();
};

export const getCurrentHour = (): number => {
  return getHourFromDate(new Date());
};

export const isToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

export const isMidnight = (): boolean => {
  const now = new Date();
  return now.getHours() === 0 && now.getMinutes() === 0;
};

export const getTimeUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getReadableDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (formatDate(date) === formatDate(today)) {
    return 'Today';
  } else if (formatDate(date) === formatDate(yesterday)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
};

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getHourLabel = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};
