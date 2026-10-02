import React, { useState } from 'react';
import { StatusBar, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { FableProvider, useFable } from './store/app';
import { t } from './lib/i18n';
import { FableText } from './components/FableText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import type { RootTabParamList } from './navigation';
import type { Session } from './data/sessions';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Library: '✦',
  Progress: '◐',
  Profile: '☾',
};

function Tabs({ onOpenSession }: { onOpenSession: (s: Session) => void }) {
  const { colors, isDark } = useTheme();
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
          <FableText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </FableText>
        ),
      })}
    >
      <Tab.Screen name="Library" options={{ tabBarLabel: t().library }}>
        {() => <LibraryScreen onOpenSession={onOpenSession} />}
      </Tab.Screen>
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: t().progress }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t().profile }}
      />
    </Tab.Navigator>
  );
}

// Text-icon tabs keep the build dependency-free (no icon font needed for v1).
function Shell() {
  const { isDark } = useTheme();
  const { onboarded } = useFable();
  const [playerSession, setPlayerSession] = useState<Session | null>(null);

  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs onOpenSession={setPlayerSession} />
      </NavigationContainer>
      <Modal
        visible={playerSession !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPlayerSession(null)}
      >
        {playerSession && (
          <PlayerScreen session={playerSession} onDone={() => setPlayerSession(null)} />
        )}
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FableProvider>
          <Shell />
        </FableProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
