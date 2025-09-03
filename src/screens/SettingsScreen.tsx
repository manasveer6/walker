import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Appbar,
  Text,
  Card,
  List,
  Switch,
  Button,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
} from "react-native-paper";
import { UserSettings, ThemeMode } from "../types";
import { themeOptions } from "../utils/theme";

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  theme: any;
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  theme,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [quotaDialogVisible, setQuotaDialogVisible] = useState(false);
  const [durationDialogVisible, setDurationDialogVisible] = useState(false);
  const [tempQuota, setTempQuota] = useState(settings.dailyQuota.toString());
  const [tempDuration, setTempDuration] = useState(
    settings.walkDuration.toString(),
  );

  const handleQuotaChange = () => {
    const newQuota = parseInt(tempQuota, 10);
    if (isNaN(newQuota) || newQuota < 1 || newQuota > 24) {
      Alert.alert(
        "Invalid Quota",
        "Please enter a number between 1 and 24 walks per day.",
      );
      return;
    }

    if (newQuota !== settings.dailyQuota) {
      Alert.alert(
        "Change Daily Quota",
        `Are you sure you want to change your daily quota to ${newQuota} walks? This will reset today's progress.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              onUpdateSettings({ dailyQuota: newQuota });
              setQuotaDialogVisible(false);
            },
          },
        ],
      );
    } else {
      setQuotaDialogVisible(false);
    }
  };

  const handleDurationChange = () => {
    const newDuration = parseInt(tempDuration, 10);
    if (isNaN(newDuration) || newDuration < 1 || newDuration > 60) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a number between 1 and 60 minutes.",
      );
      return;
    }

    onUpdateSettings({ walkDuration: newDuration });
    setDurationDialogVisible(false);
  };

  const handleThemeChange = (value: string) => {
    onUpdateSettings({ themeMode: value as ThemeMode });
  };

  const handleNotificationsToggle = () => {
    onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            onUpdateSettings({
              dailyQuota: 8,
              walkDuration: 5,
              themeMode: "system",
              notificationsEnabled: true,
            });
          },
        },
      ],
    );
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
          title="Settings"
          titleStyle={{ color: theme.colors.text }}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View style={styles.content}>
          {/* Walking Settings */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                Walking Settings
              </Text>

              <List.Item
                title="Daily Quota"
                description={`${settings.dailyQuota} walks per day`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="target"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon="chevron-right"
                    color={theme.colors.placeholder}
                  />
                )}
                onPress={() => {
                  setTempQuota(settings.dailyQuota.toString());
                  setQuotaDialogVisible(true);
                }}
                style={styles.listItem}
              />

              <List.Item
                title="Walk Duration"
                description={`${settings.walkDuration} minutes per walk`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="clock-outline"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon="chevron-right"
                    color={theme.colors.placeholder}
                  />
                )}
                onPress={() => {
                  setTempDuration(settings.walkDuration.toString());
                  setDurationDialogVisible(true);
                }}
                style={styles.listItem}
              />
            </Card.Content>
          </Card>

          {/* Appearance */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                Appearance
              </Text>

              <View style={styles.themeContainer}>
                <Text
                  variant="bodyMedium"
                  style={[styles.themeLabel, { color: theme.colors.text }]}
                >
                  Theme Mode
                </Text>
                <SegmentedButtons
                  value={settings.themeMode}
                  onValueChange={handleThemeChange}
                  buttons={themeOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  style={styles.segmentedButtons}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Notifications */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                Notifications
              </Text>

              <List.Item
                title="Walk Reminders"
                description="Get hourly reminders for pending walks"
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="bell-outline"
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Switch
                    value={settings.notificationsEnabled}
                    onValueChange={handleNotificationsToggle}
                    color={theme.colors.primary}
                  />
                )}
                style={styles.listItem}
              />
            </Card.Content>
          </Card>

          {/* Actions */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                Actions
              </Text>

              <Button
                mode="outlined"
                onPress={resetSettings}
                style={[
                  styles.resetButton,
                  { borderColor: theme.colors.error },
                ]}
                labelStyle={{ color: theme.colors.error }}
                icon="refresh"
              >
                Reset to Defaults
              </Button>
            </Card.Content>
          </Card>

          {/* App Info */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.text }]}
              >
                About Walker
              </Text>

              <Text
                variant="bodyMedium"
                style={[styles.aboutText, { color: theme.colors.placeholder }]}
              >
                Walker helps you stay active by breaking down your daily walking
                goal into manageable hourly slots. Set your pace, track your
                progress, and build a healthy walking habit.
              </Text>

              <Text
                variant="bodySmall"
                style={[
                  styles.versionText,
                  { color: theme.colors.placeholder },
                ]}
              >
                Version 1.0.0
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Quota Dialog */}
      <Portal>
        <Dialog
          visible={quotaDialogVisible}
          onDismiss={() => setQuotaDialogVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>
            Change Daily Quota
          </Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={[
                styles.dialogDescription,
                { color: theme.colors.placeholder },
              ]}
            >
              How many walks would you like to do per day? (1-24)
            </Text>
            <TextInput
              label="Daily Quota"
              value={tempQuota}
              onChangeText={setTempQuota}
              keyboardType="numeric"
              style={styles.textInput}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setQuotaDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleQuotaChange} mode="contained">
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Duration Dialog */}
      <Portal>
        <Dialog
          visible={durationDialogVisible}
          onDismiss={() => setDurationDialogVisible(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>
            Change Walk Duration
          </Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={[
                styles.dialogDescription,
                { color: theme.colors.placeholder },
              ]}
            >
              How long should each walk be? (1-60 minutes)
            </Text>
            <TextInput
              label="Duration (minutes)"
              value={tempDuration}
              onChangeText={setTempDuration}
              keyboardType="numeric"
              style={styles.textInput}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDurationDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleDurationChange} mode="contained">
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  themeContainer: {
    marginTop: 8,
  },
  themeLabel: {
    marginBottom: 12,
    fontWeight: "500",
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 8,
  },
  aboutText: {
    lineHeight: 20,
    marginBottom: 16,
  },
  versionText: {
    textAlign: "center",
    fontStyle: "italic",
  },
  dialogDescription: {
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 8,
  },
});
