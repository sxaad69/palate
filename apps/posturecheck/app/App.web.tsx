import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator as createNativeStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { PostureProvider, usePosture } from './store/app';
import { t } from './lib/i18n';
import { PostureText } from './components/PostureText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExercisesScreen } from './screens/ExercisesScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CaptureScreen } from './screens/CaptureScreen';
import { LandmarkScreen } from './screens/LandmarkScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import type { MainTabParamList, RootStackParamList } from './navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Text glyphs keep v1 dependency-free (no icon font).
const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home: '⌂',
  Exercises: '✚',
  History: '◐',
  Profile: '☾',
};

function MainTabs() {
  const { colors } = useTheme();
  const s = t();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <PostureText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </PostureText>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: s.home }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ tabBarLabel: s.exercises }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: s.history }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: s.profile }} />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { colors, isDark } = useTheme();
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="Landmarks" component={LandmarkScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded } = usePosture();
  if (!onboarded) return <OnboardingScreen />;
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootStack />
    </>
  );
}

function ThemedApp() {
  const { themeMode } = usePosture();
  // Remount on theme-mode change so the provider picks up the persisted mode.
  return (
    <ThemeProvider key={themeMode} initialMode={themeMode}>
      <Shell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PostureProvider>
        <ThemedApp />
      </PostureProvider>
    </SafeAreaProvider>
  );
}
