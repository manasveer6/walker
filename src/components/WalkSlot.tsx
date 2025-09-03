import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { WalkSlot as WalkSlotType } from "../types";
import { getHourLabel } from "../utils/dateUtils";

interface WalkSlotProps {
  walkSlot: WalkSlotType;
  onStartWalk: (walkSlotId: string) => void;
  onUndoWalk: (walkSlotId: string) => void;
  theme: any;
  canStartWalk: boolean;
  isCurrentHour: boolean;
}

export const WalkSlot: React.FC<WalkSlotProps> = ({
  walkSlot,
  onStartWalk,
  onUndoWalk,
  theme,
  canStartWalk,
  isCurrentHour,
}) => {
  const handlePress = () => {
    if (walkSlot.isCompleted) {
      return; // Don't allow undoing for now - can be enabled via long press
    } else if (canStartWalk) {
      onStartWalk(walkSlot.id);
    }
  };

  const handleLongPress = () => {
    if (walkSlot.isCompleted) {
      onUndoWalk(walkSlot.id);
    }
  };

  const getStatusIcon = () => {
    if (walkSlot.isCompleted) {
      return "check-circle";
    } else {
      return "clock-outline";
    }
  };

  const getStatusColor = () => {
    if (walkSlot.isCompleted) {
      return "#4CAF50"; // Green
    } else if (isCurrentHour) {
      return theme.colors.primary;
    } else {
      return theme.colors.placeholder;
    }
  };

  const getCardStyle = () => {
    let cardStyle: any = {
      ...styles.card,
      backgroundColor: theme.colors.surface,
    };

    if (isCurrentHour && !walkSlot.isCompleted) {
      cardStyle = {
        ...cardStyle,
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
    }

    if (walkSlot.isCompleted) {
      cardStyle = {
        ...cardStyle,
        opacity: 0.8,
      };
    }

    return cardStyle;
  };

  const getCompletedTime = () => {
    if (walkSlot.completedAt) {
      return walkSlot.completedAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={!canStartWalk && !walkSlot.isCompleted}
      style={styles.container}
    >
      <Card style={[getCardStyle()]}>
        <Card.Content style={styles.content}>
          <View style={styles.timeContainer}>
            <Text
              variant="titleMedium"
              style={[styles.hourText, { color: theme.colors.text }]}
            >
              {getHourLabel(walkSlot.hour)}
            </Text>
            {walkSlot.isCompleted && getCompletedTime() && (
              <Text
                variant="bodySmall"
                style={[
                  styles.completedTime,
                  { color: theme.colors.placeholder },
                ]}
              >
                Done at {getCompletedTime()}
              </Text>
            )}
          </View>

          <View style={styles.statusContainer}>
            <IconButton
              icon={getStatusIcon()}
              iconColor={getStatusColor()}
              size={24}
              style={styles.statusIcon}
            />
            <Text
              variant="bodyMedium"
              style={[styles.statusText, { color: getStatusColor() }]}
            >
              {walkSlot.isCompleted ? "Done" : "Pending"}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    elevation: 2,
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  timeContainer: {
    flex: 1,
  },
  hourText: {
    fontWeight: "600",
  },
  completedTime: {
    marginTop: 2,
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    margin: 0,
    marginRight: 4,
  },
  statusText: {
    fontWeight: "500",
    fontSize: 14,
  },
});
