import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWalkerApp } from "../../src/hooks/useWalkerApp";
import { useAppTheme } from "../../src/utils/theme";

export default function TabLayout() {
  const { settings } = useWalkerApp();
  const theme = useAppTheme(settings.themeMode);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "history") {
            iconName = focused ? "chart-line" : "chart-line";
          } else if (route.name === "settings") {
            iconName = focused ? "cog" : "cog-outline";
          } else {
            iconName = "circle";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.disabled,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
