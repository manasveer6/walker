import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useWalkerApp } from "../../src/hooks/useWalkerApp";
import { useAppTheme } from "../../src/utils/theme";
import { SettingsScreen } from "../../src/screens/SettingsScreen";

const Stack = createStackNavigator();

export default function SettingsTab() {
  const { settings, updateSettings } = useWalkerApp();
  const theme = useAppTheme(settings.themeMode);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain">
        {({ navigation }) => (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            theme={theme}
            navigation={navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
