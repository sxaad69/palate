import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { RestoryProvider, useRestory } from './store/app';
import { t } from './lib/i18n';
import { RestoryText } from './components/RestoryText';
import { setNotificationHandlerOnce } from './lib/notifications';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TodayScreen } from './screens/TodayScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import type { RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Today: '☾',
  Insights: '◍',
  Progress: '≡',
  Profile: '◔',
};

function Tabs() {
  const { colors } = useTheme();
  const s = t();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        // Text glyphs keep v1 dependency-free (no icon font).
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <RestoryText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </RestoryText>
        ),
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} options={{ tabBarLabel: s.today }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarLabel: s.insights }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ tabBarLabel: s.progress }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: s.profile }} />
    </Tab.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded } = useRestory();

  useEffect(() => {
    setNotificationHandlerOnce();
  }, []);

  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RestoryProvider>
          <Shell />
        </RestoryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
