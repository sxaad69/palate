import React, { useState } from 'react';
import { StatusBar, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { TwoPurseProvider, useTwoPurse, type Envelope } from './store/app';
import { t } from './lib/i18n';
import { TPText } from './components/TPText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { EnvelopesScreen } from './screens/EnvelopesScreen';
import { MoneyDateScreen } from './screens/MoneyDateScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AddExpenseSheet } from './screens/AddExpenseSheet';
import { EnvelopeSheet } from './screens/EnvelopeSheet';
import { PaywallScreen } from './screens/PaywallScreen';
import type { RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Envelopes: '✉',
  MoneyDate: '♡',
  Profile: '⚙',
};

type SheetState = { kind: 'expense' } | { kind: 'envelope'; envelope?: Envelope } | { kind: 'paywall' } | null;

function Tabs({ onSheet }: { onSheet: (s: Exclude<SheetState, null>) => void }) {
  const { colors } = useTheme();
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
          <TPText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </TPText>
        ),
      })}
    >
      <Tab.Screen name="Envelopes" options={{ tabBarLabel: t().envelopes }}>
        {() => (
          <EnvelopesScreen
            onAddExpense={() => onSheet({ kind: 'expense' })}
            onEditEnvelope={(envelope) => onSheet({ kind: 'envelope', envelope })}
            onNewEnvelope={() => onSheet({ kind: 'envelope' })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="MoneyDate"
        options={{ tabBarLabel: t().moneyDate }}
      >
        {() => <MoneyDateScreen onNeedPro={() => onSheet({ kind: 'paywall' })} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: t().profile }}>
        {() => <ProfileScreen onOpenPaywall={() => onSheet({ kind: 'paywall' })} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded, hydrated } = useTwoPurse();
  const [sheet, setSheet] = useState<SheetState>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Honest loading gate: don't render tabs before AsyncStorage hydration.
  if (!hydrated) return null;
  if (!onboarded) return <OnboardingScreen />;

  const openPaywall = () => {
    setSheet(null);
    setPaywallOpen(true);
  };

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs
          onSheet={(s) => {
            if (s.kind === 'paywall') openPaywall();
            else setSheet(s);
          }}
        />
      </NavigationContainer>

      <Modal
        visible={sheet !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSheet(null)}
      >
        {sheet?.kind === 'expense' && <AddExpenseSheet onDone={() => setSheet(null)} />}
        {sheet?.kind === 'envelope' && (
          <EnvelopeSheet
            envelope={sheet.envelope}
            onDone={() => setSheet(null)}
            onNeedPro={openPaywall}
          />
        )}
      </Modal>

      <Modal
        visible={paywallOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPaywallOpen(false)}
      >
        <PaywallScreen onClose={() => setPaywallOpen(false)} />
      </Modal>
    </>
  );
}

function ThemedApp() {
  const { themeMode } = useTwoPurse();
  return (
    <ThemeProvider initialMode={themeMode}>
      <Shell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TwoPurseProvider>
        <ThemedApp />
      </TwoPurseProvider>
    </SafeAreaProvider>
  );
}
