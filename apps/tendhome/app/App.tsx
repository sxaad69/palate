import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { StringsProvider, useStrings } from './lib/strings';
import { HomeProvider, useHome } from './store/home';
import { nextDue } from './lib/home';
import { requestNotificationPermissions, rescheduleDueReminders } from './lib/notifications';
import { Text } from './components/Text';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import TasksScreen from './screens/Tasks';
import TaskDetailScreen from './screens/TaskDetail';
import CostsScreen from './screens/Costs';
import PaywallScreen from './screens/Paywall';
import SettingsScreen from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, active }: { label: string; active: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconWrap}>
      <Text variant="caption" style={{ color: active ? colors.textPrimary : colors.textTertiary }}>
        {label}
      </Text>
      {active && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
    </View>
  );
}

// Keeps due-date notifications in sync with the task list.
function ReminderSync() {
  const { tasks, remindersOn } = useHome();
  const { t } = useStrings();
  useEffect(() => {
    (async () => {
      if (!remindersOn) {
        const { cancelAllScheduledNotificationsAsync } = await import('expo-notifications');
        try { await cancelAllScheduledNotificationsAsync(); } catch { /* ignore */ }
        return;
      }
      const ok = await requestNotificationPermissions();
      if (!ok) return;
      const due = tasks
        .filter((x) => x.enabled)
        .map((x) => ({
          id: x.id,
          title: t.dir === 'rtl' ? x.titleAr : x.titleEn,
          dueAt: nextDue(x),
        }));
      await rescheduleDueReminders(due, { title: t.notifTitle, body: t.notifBody });
    })();
  }, [tasks, remindersOn, t]);
  return null;
}

function MainTabs({ onPaywall }: { onPaywall: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{ title: t.needsAttention, tabBarIcon: ({ focused }) => <TabIcon label="🏠" active={focused} /> }}
      >
        {({ navigation }: any) => (
          <HomeScreen
            onOpen={(id) => navigation.navigate('Detail', { id })}
            onBrowse={() => navigation.navigate('TasksTab')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="TasksTab"
        options={{ title: t.tasks, tabBarIcon: ({ focused }) => <TabIcon label="📋" active={focused} /> }}
      >
        {({ navigation }: any) => (
          <TasksScreen
            onPaywall={onPaywall}
            onOpen={(id) => navigation.navigate('Detail', { id })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Costs"
        options={{ title: t.costs, tabBarIcon: ({ focused }) => <TabIcon label="💰" active={focused} /> }}
      >
        {() => <CostsScreen onPaywall={onPaywall} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{ title: t.settings, tabBarIcon: ({ focused }) => <TabIcon label="⚙" active={focused} /> }}
      >
        {() => <SettingsScreen onPaywall={onPaywall} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 2 },
  dot: { width: 16, height: 3, borderRadius: 2 },
});

function Root() {
  const { colorScheme, isDark } = useTheme();
  const { onboarded } = useHome();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ReminderSync />
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {!onboarded ? (
          <OnboardingScreen />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {({ navigation }: any) => (
                <MainTabs onPaywall={() => navigation.navigate('Paywall')} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Detail">
              {({ navigation, route }: any) => (
                <TaskDetailScreen
                  taskId={route.params.id}
                  onBack={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Paywall">
              {({ navigation }: any) => (
                <PaywallScreen onClose={() => navigation.goBack()} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StringsProvider>
        <HomeProvider>
          <Root />
        </HomeProvider>
      </StringsProvider>
    </ThemeProvider>
  );
}
