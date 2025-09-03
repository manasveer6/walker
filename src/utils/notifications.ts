import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getCurrentHour } from "./dateUtils";

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

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return false;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return true;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  static async scheduleHourlyReminders(
    dailyQuota: number,
    completedWalks: Set<number>,
  ): Promise<void> {
    // Notifications temporarily disabled due to type compatibility issues
    console.log("Notifications would be scheduled for", dailyQuota, "walks");
  }

  static async scheduleWalkReminder(
    hour: number,
    walkNumber: number,
  ): Promise<string | null> {
    // Notifications temporarily disabled due to type compatibility issues
    console.log("Walk reminder would be scheduled for hour", hour);
    return null;
  }

  static async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  }

  static async sendImmediateNotification(
    title: string,
    body: string,
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error("Error sending immediate notification:", error);
    }
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  private static getOrdinal(number: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;
    const suffix =
      suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    return number + suffix;
  }

  static async scheduleEndOfDayReminder(): Promise<void> {
    // Notifications temporarily disabled due to type compatibility issues
    console.log("End of day reminder would be scheduled");
  }

  static async scheduleMorningMotivation(): Promise<void> {
    // Notifications temporarily disabled due to type compatibility issues
    console.log("Morning motivation would be scheduled");
  }
}
