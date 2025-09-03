import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";

import { useWalkerApp } from "../src/hooks/useWalkerApp";
import { useAppTheme, getPaperTheme } from "../src/utils/theme";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const { settings } = useWalkerApp();
  const theme = useAppTheme(settings.themeMode);
  const paperTheme = getPaperTheme(theme);

  useEffect(() => {
    // Set up notification handler
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      },
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        // Handle notification tap here if needed
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        style={theme.mode === "dark" ? "light" : "dark"}
        backgroundColor={theme.colors.surface}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
