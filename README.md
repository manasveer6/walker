# Walker 🚶‍♀️

A React Native Expo app that helps you achieve your daily walking goals by breaking them into manageable hourly slots.

## Features

- **Daily Walking Quota**: Set your daily walk target (e.g., 8 walks per day)
- **Customizable Duration**: Set walk duration (e.g., 5 minutes per walk)
- **Hourly Slots**: Day is split into hourly time slots showing walk status
- **Timer**: Built-in circular countdown timer for each walk
- **Progress Tracking**: Visual progress bar showing daily completion
- **History**: View your walking stats for the past 7 days
- **Catch-up System**: Missed walks stay pending so you can catch up later
- **Local Storage**: All data stored locally with AsyncStorage
- **Theme Support**: Dark, light, and system theme modes
- **Notifications**: Hourly reminders for pending walks (when permissions granted)

## Screenshots

### Home Screen
- Today's progress bar (e.g., 3/8 walks done)
- List of hourly walk slots with ✅ done or ⏳ pending status
- Current hour highlighted
- Quick start button for next pending walk

### Timer Screen
- Circular countdown timer
- Start/Stop walk functionality
- Walking tips during active walks
- Completion celebration

### Settings Screen
- Adjust daily quota (1-24 walks)
- Set walk duration (1-60 minutes)
- Theme selection (Light/Dark/System)
- Enable/disable notifications
- Reset to defaults option

### History Screen
- Last 7 days completion stats
- Daily progress bars
- Overall statistics (total walks, average completion, perfect days)
- Motivational insights

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with bottom tabs
- **UI Library**: React Native Paper (Material Design 3)
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications
- **Icons**: MaterialCommunityIcons
- **Timer**: Custom circular progress component with SVG
- **State Management**: React hooks with custom useWalkerApp hook

## Installation

1. **Prerequisites**
   ```bash
   npm install -g expo-cli
   # or
   npm install -g @expo/cli
   ```

2. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd walker
   npm install
   ```

3. **Run the App**
   ```bash
   npx expo start
   ```

4. **Test on Device**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `w` to run in web browser

## Usage

### First Time Setup
1. Open the app
2. Go to Settings tab
3. Set your daily walking quota (default: 8 walks)
4. Set walk duration (default: 5 minutes)
5. Enable notifications if desired

### Daily Usage
1. **View Progress**: Home screen shows today's completion status
2. **Start Walk**: Tap any pending walk slot or use the floating action button
3. **Use Timer**: Timer screen provides countdown and completion tracking
4. **Check History**: History tab shows your past week's performance
5. **Adjust Settings**: Modify quota or duration as needed

### Walk States
- **⏳ Pending**: Walk not yet completed
- **✅ Done**: Walk completed with timestamp
- **Current Hour**: Highlighted with border when it's time to walk

## Code Structure

```
src/
├── components/           # Reusable UI components
│   ├── CircularTimer.tsx    # Countdown timer with SVG
│   ├── DailyProgressBar.tsx # Progress visualization
│   └── WalkSlot.tsx         # Individual walk slot display
├── screens/              # Main app screens
│   ├── HomeScreen.tsx       # Today's walks and progress
│   ├── TimerScreen.tsx      # Walk countdown timer
│   ├── SettingsScreen.tsx   # App configuration
│   └── HistoryScreen.tsx    # Past week statistics
├── hooks/                # Custom React hooks
│   └── useWalkerApp.ts      # Main app state management
├── utils/                # Utility functions
│   ├── storage.ts           # AsyncStorage helpers
│   ├── notifications.ts     # Push notification service
│   ├── dateUtils.ts         # Date formatting and calculations
│   └── theme.ts             # Theme configuration
└── types/                # TypeScript type definitions
    └── index.ts             # App-wide interfaces
```

## Key Features Explained

### Hourly Distribution
Walks are distributed evenly across 24 hours based on your quota:
- 8 walks = every 3 hours (0, 3, 6, 9, 12, 15, 18, 21)
- 12 walks = every 2 hours
- 24 walks = every hour

### Quota Changes
When you change your daily quota mid-day:
- Completed walks are preserved where possible
- New schedule is generated for remaining time
- Progress is recalculated automatically

### Data Persistence
- Settings stored in AsyncStorage
- Daily progress saved per date
- History maintained for 30 days
- Automatic cleanup of old data

### Midnight Reset
- App automatically resets at midnight
- Previous day's data moved to history
- New walk schedule generated
- App state refreshed when reopened

## Notifications

The app supports hourly walk reminders:
- Requests permission on first run
- Schedules notifications for pending walks
- Cancels notifications for completed walks
- Sends motivational messages on completion

**Note**: Notifications may not work in Expo Go. Use a development build for full notification support.

## Customization

### Themes
- **Light Mode**: Black text on white background
- **Dark Mode**: White text on black background  
- **System Mode**: Follows device theme setting

### Settings
- **Daily Quota**: 1-24 walks per day
- **Walk Duration**: 1-60 minutes per walk
- **Notifications**: Enable/disable reminders
- **Theme**: Light/Dark/System preference

## Development

### Adding Features
1. Create components in `src/components/`
2. Add screens to `src/screens/`
3. Update navigation in `app/(tabs)/`
4. Extend types in `src/types/`

### Storage Schema
```typescript
// User settings
{
  dailyQuota: number,
  walkDuration: number,
  themeMode: 'light' | 'dark' | 'system',
  notificationsEnabled: boolean
}

// Daily progress (stored per date)
{
  date: string, // YYYY-MM-DD
  walkSlots: WalkSlot[],
  completedWalks: number,
  totalWalks: number
}

// Walk slot
{
  id: string,
  hour: number,
  isCompleted: boolean,
  completedAt?: Date
}
```

## Troubleshooting

### App Won't Start
- Ensure Node.js and Expo CLI are installed
- Run `npm install` to install dependencies
- Clear Expo cache: `npx expo start --clear`

### Notifications Not Working
- Check device notification permissions
- Notifications don't work in Expo Go (use development build)
- Verify expo-notifications is properly installed

### Data Not Persisting
- Check AsyncStorage permissions
- Ensure app has storage access
- Try clearing app data and restarting

### Timer Issues
- Ensure app stays in foreground during walks
- Check device power saving settings
- Background app refresh should be enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Future Enhancements

- [ ] Health kit integration
- [ ] Step counting integration
- [ ] Social features and challenges
- [ ] GPS tracking for outdoor walks
- [ ] Weekly/monthly goal setting
- [ ] Export data functionality
- [ ] Widgets for quick access
- [ ] Apple Watch companion app
- [ ] Streak tracking and badges

---

**Happy Walking! 🚶‍♀️🚶‍♂️**

Stay active, stay healthy, and achieve your daily walking goals one step at a time.