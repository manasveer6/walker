import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useWalkerApp } from "../../src/hooks/useWalkerApp";
import { useAppTheme } from "../../src/utils/theme";
import { HomeScreen } from "../../src/screens/HomeScreen";
import { TimerScreen } from "../../src/screens/TimerScreen";

const Stack = createStackNavigator();

export default function HomeTab() {
  const {
    settings,
    dailyProgress,
    isLoading,
    timerState,
    startWalk,
    stopWalk,
    undoWalk,
    initializeApp,
  } = useWalkerApp();

  const theme = useAppTheme(settings.themeMode);

  const handleStartWalk = (walkSlotId: string) => {
    startWalk(walkSlotId);
  };

  const handleStartWalkFromTimer = () => {
    if (dailyProgress) {
      const nextPendingWalk = dailyProgress.walkSlots.find(
        (slot) => !slot.isCompleted,
      );
      if (nextPendingWalk) {
        startWalk(nextPendingWalk.id);
      }
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain">
        {({ navigation }) => (
          <HomeScreen
            dailyProgress={dailyProgress}
            onStartWalk={handleStartWalk}
            onUndoWalk={undoWalk}
            onRefresh={initializeApp}
            isRefreshing={isLoading}
            theme={theme}
            navigation={navigation}
            timerIsRunning={timerState.isRunning}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Timer">
        {({ navigation }) => (
          <TimerScreen
            timerState={timerState}
            onStartWalk={handleStartWalkFromTimer}
            onStopWalk={stopWalk}
            theme={theme}
            navigation={navigation}
            walkDuration={settings.walkDuration}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
