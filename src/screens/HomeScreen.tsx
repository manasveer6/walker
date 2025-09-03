import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DailyProgressBar } from "../components/DailyProgressBar";
import { WalkSlot } from "../components/WalkSlot";
import { DailyProgress } from "../types";
import { getCurrentHour } from "../utils/dateUtils";

interface HomeScreenProps {
  dailyProgress: DailyProgress | null;
  onStartWalk: (walkSlotId: string) => void;
  onUndoWalk: (walkSlotId: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  theme: any;
  navigation: any;
  timerIsRunning: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  dailyProgress,
  onStartWalk,
  onUndoWalk,
  onRefresh,
  isRefreshing,
  theme,
  navigation,
  timerIsRunning,
}) => {
  const currentHour = getCurrentHour();
  const insets = useSafeAreaInsets();

  if (!dailyProgress) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text variant="bodyLarge" style={{ color: theme.colors.text }}>
          Loading your walking progress...
        </Text>
      </View>
    );
  }

  const getNextPendingWalk = () => {
    return dailyProgress.walkSlots.find((slot) => !slot.isCompleted);
  };

  const nextWalk = getNextPendingWalk();
  const hasActiveTimer = timerIsRunning;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <DailyProgressBar dailyProgress={dailyProgress} theme={theme} />

          <View style={styles.sectionContainer}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.text }]}
            >
              Today&apos;s Walk Schedule
            </Text>
            <Text
              variant="bodySmall"
              style={[
                styles.sectionSubtitle,
                { color: theme.colors.placeholder },
              ]}
            >
              Tap to start a walk • Long press completed walks to undo
            </Text>
          </View>

          <View style={styles.walkSlotsContainer}>
            {dailyProgress.walkSlots.map((walkSlot) => (
              <WalkSlot
                key={walkSlot.id}
                walkSlot={walkSlot}
                onStartWalk={onStartWalk}
                onUndoWalk={onUndoWalk}
                theme={theme}
                canStartWalk={!hasActiveTimer}
                isCurrentHour={
                  walkSlot.hour === currentHour && !walkSlot.isCompleted
                }
              />
            ))}
          </View>

          {dailyProgress.completedWalks === dailyProgress.totalWalks && (
            <View
              style={[
                styles.completionContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                variant="headlineSmall"
                style={[styles.completionTitle, { color: "#4CAF50" }]}
              >
                🎉 Congratulations! 🎉
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.completionText, { color: theme.colors.text }]}
              >
                You&apos;ve completed all your walks for today! Keep up the
                excellent work.
              </Text>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {nextWalk && !hasActiveTimer && (
        <FAB
          icon="play"
          label="Start Next Walk"
          onPress={() => onStartWalk(nextWalk.id)}
          style={[
            styles.fab,
            {
              backgroundColor: theme.colors.primary,
              bottom: insets.bottom + 16,
            },
          ]}
          color={theme.colors.background}
        />
      )}

      {hasActiveTimer && (
        <FAB
          icon="timer"
          label="Timer Running"
          onPress={() => navigation.navigate("Timer")}
          style={[
            styles.fab,
            {
              backgroundColor: "#FF9800",
              bottom: insets.bottom + 16,
            },
          ]}
          color="#FFFFFF"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontStyle: "italic",
  },
  walkSlotsContainer: {
    marginBottom: 20,
  },
  completionContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  completionTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  completionText: {
    textAlign: "center",
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 20, // Reduced since we now use contentContainerStyle padding
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    elevation: 8,
  },
});
