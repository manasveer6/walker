import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Appbar, Text, Card, ProgressBar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HistoryDay } from "../types";
import { getReadableDate, getDayOfWeek } from "../utils/dateUtils";

interface HistoryScreenProps {
  getLast7DaysHistory: () => HistoryDay[];
  theme: any;
  navigation: any;
}

const { width } = Dimensions.get("window");

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  getLast7DaysHistory,
  theme,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const history = getLast7DaysHistory();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#4CAF50"; // Green for complete
    if (percentage >= 75) return "#8BC34A"; // Light green
    if (percentage >= 50) return "#FF9800"; // Orange
    if (percentage >= 25) return "#FFC107"; // Yellow
    return theme.colors.disabled; // Gray for low progress
  };

  const getOverallStats = () => {
    const totalWalks = history.reduce(
      (sum, day) => sum + day.completedWalks,
      0,
    );
    const totalPossible = history.reduce((sum, day) => sum + day.totalWalks, 0);
    const averageCompletion =
      totalPossible > 0 ? (totalWalks / totalPossible) * 100 : 0;
    const completedDays = history.filter(
      (day) => day.completionPercentage >= 100,
    ).length;

    return {
      totalWalks,
      totalPossible,
      averageCompletion,
      completedDays,
    };
  };

  const stats = getOverallStats();

  const getMotivationalMessage = () => {
    if (stats.averageCompletion >= 90) {
      return "Outstanding consistency! You're a walking champion! 🏆";
    } else if (stats.averageCompletion >= 75) {
      return "Great job! You're building an excellent walking habit! 💪";
    } else if (stats.averageCompletion >= 50) {
      return "Good progress! Keep pushing forward! 🚶‍♀️";
    } else if (stats.averageCompletion >= 25) {
      return "Every step counts! You're on the right track! 👍";
    } else {
      return "Ready to start fresh? Today is a new opportunity! 🌟";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="History"
          titleStyle={{ color: theme.colors.text }}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Overall Stats */}
          <Card
            style={[
              styles.statsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.statsTitle, { color: theme.colors.text }]}
              >
                Last 7 Days Summary
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text
                    variant="headlineMedium"
                    style={[styles.statValue, { color: theme.colors.primary }]}
                  >
                    {stats.totalWalks}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.statLabel,
                      { color: theme.colors.placeholder },
                    ]}
                  >
                    Total Walks
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text
                    variant="headlineMedium"
                    style={[styles.statValue, { color: theme.colors.primary }]}
                  >
                    {Math.round(stats.averageCompletion)}%
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.statLabel,
                      { color: theme.colors.placeholder },
                    ]}
                  >
                    Average
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text
                    variant="headlineMedium"
                    style={[styles.statValue, { color: theme.colors.primary }]}
                  >
                    {stats.completedDays}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.statLabel,
                      { color: theme.colors.placeholder },
                    ]}
                  >
                    Perfect Days
                  </Text>
                </View>
              </View>

              <Text
                variant="bodyMedium"
                style={[styles.motivationText, { color: theme.colors.primary }]}
              >
                {getMotivationalMessage()}
              </Text>
            </Card.Content>
          </Card>

          {/* Daily History */}
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          >
            Daily Progress
          </Text>

          {history.map((day, index) => (
            <Card
              key={day.date}
              style={[
                styles.dayCard,
                { backgroundColor: theme.colors.surface },
                index === 0 && styles.todayCard,
              ]}
            >
              <Card.Content style={styles.dayContent}>
                <View style={styles.dayHeader}>
                  <View>
                    <Text
                      variant="titleMedium"
                      style={[styles.dayTitle, { color: theme.colors.text }]}
                    >
                      {getReadableDate(day.date)}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.daySubtitle,
                        { color: theme.colors.placeholder },
                      ]}
                    >
                      {getDayOfWeek(day.date)}
                    </Text>
                  </View>

                  <View style={styles.dayStats}>
                    <Text
                      variant="headlineSmall"
                      style={[
                        styles.dayPercentage,
                        { color: getProgressColor(day.completionPercentage) },
                      ]}
                    >
                      {day.completionPercentage}%
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.dayWalks,
                        { color: theme.colors.placeholder },
                      ]}
                    >
                      {day.completedWalks}/{day.totalWalks} walks
                    </Text>
                  </View>
                </View>

                <ProgressBar
                  progress={day.completionPercentage / 100}
                  color={getProgressColor(day.completionPercentage)}
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.disabled },
                  ]}
                />

                {day.completionPercentage >= 100 && (
                  <View style={styles.completionBadge}>
                    <Text
                      variant="bodySmall"
                      style={[styles.completionText, { color: "#4CAF50" }]}
                    >
                      ✅ Goal Achieved!
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}

          {/* Insights */}
          <Card
            style={[
              styles.insightsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.insightsTitle, { color: theme.colors.text }]}
              >
                📊 Insights
              </Text>

              <View style={styles.insightsList}>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.insightItem,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  • Best day:{" "}
                  {
                    history.reduce((best, day) =>
                      day.completionPercentage > best.completionPercentage
                        ? day
                        : best,
                    ).completionPercentage
                  }
                  % completion
                </Text>

                <Text
                  variant="bodyMedium"
                  style={[
                    styles.insightItem,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  • Streak: {stats.completedDays} perfect days
                </Text>

                <Text
                  variant="bodyMedium"
                  style={[
                    styles.insightItem,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  • Total distance: ~{(stats.totalWalks * 0.5).toFixed(1)}{" "}
                  miles*
                </Text>

                <Text
                  variant="bodySmall"
                  style={[
                    styles.disclaimerText,
                    { color: theme.colors.disabled },
                  ]}
                >
                  *Estimated based on average walking pace
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 16,
  },
  statsTitle: {
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontWeight: "700",
  },
  statLabel: {
    marginTop: 4,
    textAlign: "center",
  },
  motivationText: {
    textAlign: "center",
    fontWeight: "500",
    fontStyle: "italic",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
  },
  dayCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  dayContent: {
    paddingVertical: 16,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayTitle: {
    fontWeight: "600",
  },
  daySubtitle: {
    marginTop: 2,
  },
  dayStats: {
    alignItems: "flex-end",
  },
  dayPercentage: {
    fontWeight: "700",
  },
  dayWalks: {
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  completionBadge: {
    alignItems: "center",
    marginTop: 4,
  },
  completionText: {
    fontWeight: "600",
  },
  insightsCard: {
    marginTop: 20,
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  insightsTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    lineHeight: 20,
  },
  disclaimerText: {
    marginTop: 8,
    fontStyle: "italic",
  },
});
