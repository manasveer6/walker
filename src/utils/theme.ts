import { useColorScheme } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AppTheme, ThemeMode } from "../types";

const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    primary: "#000000",
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#000000",
    disabled: "#cccccc",
    placeholder: "#666666",
    backdrop: "rgba(0, 0, 0, 0.5)",
    onSurface: "#000000",
    notification: "#ff6b6b",
  },
};

const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    primary: "#ffffff",
    background: "#000000",
    surface: "#1a1a1a",
    text: "#ffffff",
    disabled: "#333333",
    placeholder: "#999999",
    backdrop: "rgba(255, 255, 255, 0.5)",
    onSurface: "#ffffff",
    notification: "#ff6b6b",
  },
};

export const getTheme = (
  themeMode: ThemeMode,
  systemColorScheme?: "light" | "dark",
): AppTheme => {
  let actualMode: "light" | "dark";

  if (themeMode === "system") {
    actualMode = systemColorScheme || "light";
  } else {
    actualMode = themeMode;
  }

  return actualMode === "dark" ? darkTheme : lightTheme;
};

export const getPaperTheme = (appTheme: AppTheme) => {
  const baseTheme = appTheme.mode === "dark" ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      surface: appTheme.colors.surface,
      onSurface: appTheme.colors.onSurface,
      onBackground: appTheme.colors.text,
      outline: appTheme.colors.disabled,
      surfaceVariant: appTheme.colors.surface,
      onSurfaceVariant: appTheme.colors.text,
    },
  };
};

export const useAppTheme = (themeMode: ThemeMode): AppTheme => {
  const systemColorScheme = useColorScheme();
  return getTheme(themeMode, systemColorScheme || "light");
};

export const themeOptions = [
  { label: "System", value: "system" as ThemeMode },
  { label: "Light", value: "light" as ThemeMode },
  { label: "Dark", value: "dark" as ThemeMode },
];
