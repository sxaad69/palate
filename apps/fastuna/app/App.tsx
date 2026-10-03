import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from './navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { AppProvider, useApp } from './store/app';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TimerScreen } from './screens/TimerScreen';
import { PresetsScreen } from './screens/PresetsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import type { RootTabParamList } from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// One stack per tab so each tab keeps its own navigation history.
// Built once at module level — never inside render, or stacks remount.
function tabStack(
  screens: { name: string; component: React.ComponentType<any> }[],
) {
  const Stack = createNativeStackNavigator();
  return function TabStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {screens.map((s) => (
          <Stack.Screen key={s.name} name={s.name} component={s.component} />
        ))}
      </Stack.Navigator>
    );
  };
}

const TABS = [
  {
    name: 'Timer',
    icon: 'timer-outline',
    component: tabStack([{ name: 'TimerHome', component: TimerScreen }]),
  },
  {
    name: 'Presets',
    icon: 'list-outline',
    component: tabStack([{ name: 'PresetsHome', component: PresetsScreen }]),
  },
  {
    name: 'History',
    icon: 'bar-chart-outline',
    component: tabStack([{ name: 'HistoryHome', component: HistoryScreen }]),
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    component: tabStack([
      { name: 'ProfileHome', component: ProfileScreen },
      { name: 'Paywall', component: PaywallScreen },
    ]),
  },
] as const;

const Tab = createBottomTabNavigator<RootTabParamList>();

function MainTabs() {
  const { colors, colorScheme } = useTheme();
  const { t } = useApp();
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme: NavigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.danger,
    },
  };

  const labels: Record<string, string> = {
    Timer: t.timer,
    Presets: t.presets,
    History: t.history,
    Profile: t.profile,
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ color, size }) => {
            const tab = TABS.find((x) => x.name === route.name);
            return tab ? (
              <Ionicons name={tab.icon} size={size} color={color} />
            ) : null;
          },
          tabBarLabel: labels[route.name] ?? route.name,
        })}
      >
        {TABS.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function ThemedStatusBar() {
  const { colorScheme } = useTheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

// ponytail: onboarding is a conditional screen, not another navigator —
function Root() {
  const { onboarded } = useApp();
  return onboarded ? <MainTabs /> : <OnboardingScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
    <ThemeProvider>
      <AppProvider>
        <ThemedStatusBar />
        <Root />
      </AppProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
