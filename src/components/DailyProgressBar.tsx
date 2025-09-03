import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { DailyProgress } from "../types";

interface DailyProgressBarProps {
  dailyProgress: DailyProgress;
  theme: any;
}

export const DailyProgressBar: React.FC<DailyProgressBarProps> = ({
  dailyProgress,
  theme,
}) => {
  const progress =
    dailyProgress.totalWalks > 0
      ? dailyProgress.completedWalks / dailyProgress.totalWalks
      : 0;

  const getProgressColor = () => {
    if (progress >= 1) return "#4CAF50"; // Green for complete
    if (progress >= 0.5) return "#FF9800"; // Orange for halfway
    return theme.colors.primary; // Default color
  };

  const getMotivationalMessage = () => {
    if (progress >= 1)
      return "Amazing! You&apos;ve completed all walks today! 🎉";
    if (progress >= 0.75) return "Almost there! Keep it up! 💪";
    if (progress >= 0.5) return "Great progress! You&apos;re halfway there! 👍";
    if (progress > 0) return "Good start! Keep going! 🚶‍♀️";
    return "Ready to start your walking journey today? 🌟";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerContainer}>
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.text }]}
        >
          Today&apos;s Progress
        </Text>
        <Text
          variant="titleMedium"
          style={[styles.stats, { color: theme.colors.text }]}
        >
          {dailyProgress.completedWalks}/{dailyProgress.totalWalks}
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        color={getProgressColor()}
        style={[styles.progressBar, { backgroundColor: theme.colors.disabled }]}
      />

      <View style={styles.detailsContainer}>
        <Text
          variant="bodyMedium"
          style={[styles.percentage, { color: theme.colors.text }]}
        >
          {Math.round(progress * 100)}% Complete
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.remaining, { color: theme.colors.placeholder }]}
        >
          {dailyProgress.totalWalks - dailyProgress.completedWalks} walks
          remaining
        </Text>
      </View>

      <Text
        variant="bodyMedium"
        style={[styles.motivation, { color: theme.colors.primary }]}
      >
        {getMotivationalMessage()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
  },
  stats: {
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  percentage: {
    fontWeight: "600",
  },
  remaining: {
    fontStyle: "italic",
  },
  motivation: {
    textAlign: "center",
    fontWeight: "500",
    fontStyle: "italic",
  },
});
