import React, { useEffect, useMemo } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { LocaleProvider, useStrings, prayerName } from './lib/strings';
import { SalahProvider, useSalah } from './store/salah';
import { getPrayerTimes, type PrayerKey } from './lib/prayer';
import {
  requestNotificationPermissions,
  reschedulePrayerReminders,
} from './lib/prayerNotifications';
import { OnboardingScreen } from './screens/Onboarding';
import { TodayScreen } from './screens/Today';
import { HabitsScreen, HabitFormScreen } from './screens/Habits';
import { DhikrScreen } from './screens/Dhikr';
import { ProgressScreen } from './screens/Progress';
import { PaywallScreen } from './screens/Paywall';
import { SettingsScreen } from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

function MainTabs() {
  const { colors } = useTheme();
  const { t } = useStrings();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, TabIconName> = {
            Today: 'moon-waning-crescent',
            Habits: 'check-all',
            Dhikr: 'counter',
            Progress: 'trending-up',
            Settings: 'cog',
          };
          return (
            <MaterialCommunityIcons
              name={icons[route.name] ?? 'circle'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Today" options={{ title: t.tabToday }}>
        {({ navigation }: any) => (
          <TodayScreen onAddHabit={() => navigation.getParent()?.navigate('HabitForm')} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Habits" options={{ title: t.tabHabits }}>
        {({ navigation }: any) => (
          <HabitsScreen
            onAdd={() => navigation.getParent()?.navigate('HabitForm')}
            onPaywall={() => navigation.getParent()?.navigate('Paywall')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Dhikr" component={DhikrScreen} options={{ title: t.tabDhikr }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: t.tabProgress }} />
      <Tab.Screen name="Settings" options={{ title: t.sTitle }}>
        {({ navigation }: any) => (
          <SettingsScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Rebuilds today's prayer reminders whenever the timetable inputs change.
// Asks for permission once, on first launch after onboarding.
function ReminderSync() {
  const { lat, lng, methodId, remindersOn, onboarded } = useSalah();
  const { t, locale } = useStrings();

  const times = useMemo(
    () => getPrayerTimes(lat, lng, methodId, new Date()),
    [lat, lng, methodId, Math.floor(Date.now() / 3600000)],
  );

  useEffect(() => {
    if (!onboarded) return;
    (async () => {
      if (!remindersOn) return;
      const granted = await requestNotificationPermissions();
      if (!granted) return;
      const enabled: Record<string, boolean> = {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      };
      await reschedulePrayerReminders(
        times,
        enabled,
        {
          title: (prayerKey: string) =>
            t.notifTitle(prayerName(prayerKey as PrayerKey, t, locale)),
          body: t.notifBody,
        },
        (key) => key,
      );
    })();
  }, [times, remindersOn, onboarded, t, locale]);

  return null;
}

function Root() {
  const { colorScheme } = useTheme();
  const { onboarded } = useSalah();

  if (!onboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReminderSync />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="HabitForm">
          {({ navigation }: any) => <HabitFormScreen onDone={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Paywall">
          {({ navigation }: any) => <PaywallScreen onClose={() => navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <SalahProvider>
          <StatusBar style="auto" />
          <Root />
        </SalahProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
