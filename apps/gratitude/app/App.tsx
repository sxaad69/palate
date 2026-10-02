import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { TGProvider, useTG } from './store/app';
import { t } from './lib/i18n';
import { AppText } from './components/AppText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TodayScreen } from './screens/TodayScreen';
import { JarScreen } from './screens/JarScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { LetterScreen } from './screens/LetterScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import type { RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Text glyphs keep v1 dependency-free (no icon font).
const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Today: '☀',
  Jar: '◍',
  History: '◷',
  Letter: '✉',
  Profile: '☾',
};

function Tabs() {
  const { colors } = useTheme();
  const tabs = t();
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
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <AppText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </AppText>
        ),
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} options={{ tabBarLabel: tabs.today }} />
      <Tab.Screen name="Jar" component={JarScreen} options={{ tabBarLabel: tabs.jar }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: tabs.history }} />
      <Tab.Screen name="Letter" component={LetterScreen} options={{ tabBarLabel: tabs.letter }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: tabs.profile }} />
    </Tab.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded } = useTG();

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
        <TGProvider>
          <Shell />
        </TGProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
