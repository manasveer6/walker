import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useWalkerApp } from "../../src/hooks/useWalkerApp";
import { useAppTheme } from "../../src/utils/theme";
import { HistoryScreen } from "../../src/screens/HistoryScreen";

const Stack = createStackNavigator();

export default function HistoryTab() {
  const { getLast7DaysHistory, settings } = useWalkerApp();
  const theme = useAppTheme(settings.themeMode);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain">
        {({ navigation }) => (
          <HistoryScreen
            getLast7DaysHistory={getLast7DaysHistory}
            theme={theme}
            navigation={navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
