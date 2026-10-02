import React, { useState } from 'react';
import { StatusBar, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { KeepsProvider, useKeeps } from './store/app';
import { t } from './lib/i18n';
import { KText } from './components/KText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PantryScreen } from './screens/PantryScreen';
import { AddItemScreen } from './screens/AddItemScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import type { RootTabParamList } from './navigation';
import type { PantryItem } from './store/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Pantry: '🧺',
  Alerts: '⏳',
  Stats: '📊',
  Profile: '⚙️',
};

interface ModalState {
  addOpen: boolean;
  editing: PantryItem | null;
  paywallOpen: boolean;
}

function Tabs({ modals, setModals }: { modals: ModalState; setModals: (m: ModalState) => void }) {
  const { colors } = useTheme();
  const openPaywall = () => setModals({ ...modals, paywallOpen: true });
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
        // Emoji glyphs keep v1 dependency-free (no icon font).
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <KText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </KText>
        ),
      })}
    >
      <Tab.Screen name="Pantry" options={{ tabBarLabel: t().pantry }}>
        {() => (
          <PantryScreen
            onAdd={() => setModals({ ...modals, addOpen: true, editing: null })}
            onEdit={(item) => setModals({ ...modals, addOpen: true, editing: item })}
            onGoPro={openPaywall}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarLabel: t().alerts }} />
      <Tab.Screen name="Stats" options={{ tabBarLabel: t().stats }}>
        {() => <StatsScreen onGoPro={openPaywall} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: t().profile }}>
        {() => <ProfileScreen onGoPro={openPaywall} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded } = useKeeps();
  const [modals, setModals] = useState<ModalState>({
    addOpen: false,
    editing: null,
    paywallOpen: false,
  });
  const closeAll = () => setModals({ addOpen: false, editing: null, paywallOpen: false });

  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs modals={modals} setModals={setModals} />
      </NavigationContainer>
      <Modal
        visible={modals.addOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeAll}
      >
        <AddItemScreen
          initial={modals.editing}
          onClose={closeAll}
          onGoPro={() => setModals({ ...modals, addOpen: false, paywallOpen: true })}
        />
      </Modal>
      <Modal
        visible={modals.paywallOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeAll}
      >
        <PaywallScreen onClose={closeAll} />
      </Modal>
    </>
  );
}

// Theme choice is persisted by the store; ThemeProvider is controlled by it.
function ThemedApp() {
  const { themeMode, setTheme } = useKeeps();
  return (
    <ThemeProvider controlledMode={themeMode} onControlledModeChange={setTheme}>
      <Shell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <KeepsProvider>
        <ThemedApp />
      </KeepsProvider>
    </SafeAreaProvider>
  );
}
