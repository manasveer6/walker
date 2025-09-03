import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";
import { formatTime } from "../utils/dateUtils";
import { TimerState } from "../types";

interface CircularTimerProps {
  timerState: TimerState;
  onStart: () => void;
  onStop: () => void;
  theme: any;
}

const { width } = Dimensions.get("window");
const SIZE = Math.min(width * 0.7, 300);
const RADIUS = SIZE / 2 - 20;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CircularTimer: React.FC<CircularTimerProps> = ({
  timerState,
  onStart,
  onStop,
  theme,
}) => {
  const insets = useSafeAreaInsets();
  const progress =
    timerState.totalTime > 0
      ? (timerState.totalTime - timerState.timeRemaining) / timerState.totalTime
      : 0;

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.timerContainer}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <G rotation="-90" originX={SIZE / 2} originY={SIZE / 2}>
            {/* Background circle */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={theme.colors.disabled}
              strokeWidth={STROKE_WIDTH}
              opacity={0.3}
            />
            {/* Progress circle */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <View style={styles.timeContainer}>
          <Text
            variant="displayMedium"
            style={[styles.timeText, { color: theme.colors.text }]}
          >
            {formatTime(timerState.timeRemaining)}
          </Text>
          {timerState.totalTime > 0 && (
            <Text
              variant="bodyMedium"
              style={[
                styles.totalTimeText,
                { color: theme.colors.placeholder },
              ]}
            >
              / {formatTime(timerState.totalTime)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!timerState.isRunning ? (
          <Button
            mode="contained"
            onPress={onStart}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={[
              styles.buttonLabel,
              { color: theme.colors.background },
            ]}
            icon="play"
            disabled={
              timerState.timeRemaining > 0 &&
              timerState.timeRemaining < timerState.totalTime
            }
          >
            {timerState.timeRemaining > 0 &&
            timerState.timeRemaining < timerState.totalTime
              ? "Completed"
              : "Start Walk"}
          </Button>
        ) : (
          <Button
            mode="outlined"
            onPress={onStop}
            style={[styles.button, { borderColor: theme.colors.primary }]}
            labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
            icon="stop"
          >
            Stop Walk
          </Button>
        )}
      </View>

      {timerState.isRunning && (
        <Text
          variant="bodyMedium"
          style={[styles.statusText, { color: theme.colors.placeholder }]}
        >
          Keep walking! 🚶‍♀️
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  svg: {
    position: "absolute",
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  totalTimeText: {
    marginTop: 4,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 200,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});
