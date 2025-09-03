import React from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { Appbar, Text, Card } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircularTimer } from "../components/CircularTimer";
import { TimerState } from "../types";
import { useFocusEffect } from "@react-navigation/native";

interface TimerScreenProps {
  timerState: TimerState;
  onStartWalk: () => void;
  onStopWalk: () => void;
  theme: any;
  navigation: any;
  walkDuration: number;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({
  timerState,
  onStartWalk,
  onStopWalk,
  theme,
  navigation,
  walkDuration,
}) => {
  const insets = useSafeAreaInsets();

  // Handle back button press when timer is running
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (timerState.isRunning) {
          // Don't go back if timer is running, just minimize
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription?.remove();
    }, [timerState.isRunning]),
  );

  const getTimerInstructions = () => {
    if (timerState.isRunning) {
      return "Keep walking! The timer will notify you when you're done.";
    } else if (timerState.timeRemaining === 0 && timerState.totalTime > 0) {
      return "Great job! Your walk is complete.";
    } else {
      return `Ready for a ${walkDuration}-minute walk? Tap Start Walk to begin your timer.`;
    }
  };

  const getTimerStatus = () => {
    if (timerState.isRunning) {
      return "Walk in Progress";
    } else if (timerState.timeRemaining === 0 && timerState.totalTime > 0) {
      return "Walk Completed!";
    } else {
      return "Ready to Walk";
    }
  };

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
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          disabled={timerState.isRunning}
        />
        <Appbar.Content
          title="Walk Timer"
          titleStyle={{ color: theme.colors.text }}
        />
      </Appbar.Header>

      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Card
          style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Content style={styles.statusContent}>
            <Text
              variant="titleLarge"
              style={[styles.statusTitle, { color: theme.colors.text }]}
            >
              {getTimerStatus()}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.instructions, { color: theme.colors.placeholder }]}
            >
              {getTimerInstructions()}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.timerContainer}>
          <CircularTimer
            timerState={timerState}
            onStart={onStartWalk}
            onStop={onStopWalk}
            theme={theme}
          />
        </View>

        {timerState.isRunning && (
          <Card
            style={[styles.tipsCard, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.tipsTitle, { color: theme.colors.text }]}
              >
                Walking Tips 💡
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.tipsText, { color: theme.colors.placeholder }]}
              >
                • Maintain a comfortable pace{"\n"}• Keep your phone with you
                {"\n"}• Stay hydrated{"\n"}• Enjoy the fresh air!
              </Text>
            </Card.Content>
          </Card>
        )}

        {timerState.timeRemaining === 0 && timerState.totalTime > 0 && (
          <Card style={[styles.completionCard, { backgroundColor: "#E8F5E8" }]}>
            <Card.Content style={styles.completionContent}>
              <Text
                variant="titleMedium"
                style={[styles.completionTitle, { color: "#4CAF50" }]}
              >
                🎉 Walk Completed!
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.completionText, { color: "#2E7D32" }]}
              >
                Congratulations! You&apos;ve completed your {walkDuration}
                -minute walk. Your progress has been automatically saved.
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  statusContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statusTitle: {
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  instructions: {
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tipsCard: {
    marginTop: 20,
    elevation: 2,
    borderRadius: 12,
  },
  tipsTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  tipsText: {
    lineHeight: 22,
  },
  completionCard: {
    marginTop: 20,
    elevation: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  completionContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  completionTitle: {
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  completionText: {
    textAlign: "center",
    lineHeight: 20,
  },
});
