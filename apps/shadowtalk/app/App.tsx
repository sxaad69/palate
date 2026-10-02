import React, { useEffect, useState } from 'react';
import { StatusBar, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { ShadowProvider, useShadow } from './store/app';
import { t } from './lib/i18n';
import { closeBilling, initBilling } from './lib/billing';
import { EchoText } from './components/EchoText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PacksScreen } from './screens/PacksScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import type { RootTabParamList } from './navigation';
import type { PackId } from './data/phrases';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Packs: '▣',
  Progress: '◐',
  Profile: '☾',
};

interface PracticeTarget {
  pack: PackId;
  index: number;
}

function Tabs({
  onOpenPack,
  onPaywall,
}: {
  onOpenPack: (p: PackId) => void;
  onPaywall: () => void;
}) {
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
          <EchoText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </EchoText>
        ),
      })}
    >
      <Tab.Screen name="Packs" options={{ tabBarLabel: t().packs }}>
        {() => <PacksScreen onOpenPack={onOpenPack} onPaywall={onPaywall} />}
      </Tab.Screen>
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: t().progress }}
      />
      <Tab.Screen name="Profile" options={{ tabBarLabel: t().profile }}>
        {() => <ProfileScreen onPaywall={onPaywall} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded, setPro } = useShadow();
  const [practice, setPractice] = useState<PracticeTarget | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    void initBilling(() => setPro(true));
    return () => closeBilling();
  }, [setPro]);

  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs
          onOpenPack={(pack) => setPractice({ pack, index: 0 })}
          onPaywall={() => setPaywallOpen(true)}
        />
      </NavigationContainer>
      <Modal
        visible={practice !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPractice(null)}
      >
        {practice && (
          <PracticeScreen
            pack={practice.pack}
            index={practice.index}
            onIndexChange={(index) => setPractice({ pack: practice.pack, index })}
            onDone={() => setPractice(null)}
            onPaywall={() => setPaywallOpen(true)}
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

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ShadowProvider>
          <Shell />
        </ShadowProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
