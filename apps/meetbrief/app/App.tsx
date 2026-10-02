import React, { useEffect, useState } from 'react';
import { StatusBar, Modal } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { MeetBriefProvider, useMeetBrief } from './store/app';
import { initBilling, closeBilling } from './lib/billing';
import { t } from './lib/i18n';
import { MeetText } from './components/MeetText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MeetingsScreen } from './screens/MeetingsScreen';
import { RecordScreen } from './screens/RecordScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import { MeetingDetailScreen } from './screens/MeetingDetailScreen';
import type { RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Meetings: '☰',
  Record: '●',
  Stats: '◐',
  Profile: '☾',
};

function Tabs({
  onOpenMeeting,
  onRecordSaved,
  onOpenPaywall,
}: {
  onOpenMeeting: (id: string) => void;
  onRecordSaved: (id: string) => void;
  onOpenPaywall: () => void;
}) {
  const { colors } = useTheme();
  const { lang } = useMeetBrief();
  void lang; // re-render tab labels on language change
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: route.name === 'Record' ? colors.record : colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        // Text glyphs keep v1 dependency-free (no icon font).
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <MeetText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </MeetText>
        ),
      })}
    >
      <Tab.Screen name="Meetings" options={{ tabBarLabel: t().meetings }}>
        {() => <MeetingsScreen onOpenMeeting={onOpenMeeting} onOpenPaywall={onOpenPaywall} />}
      </Tab.Screen>
      <Tab.Screen name="Record" options={{ tabBarLabel: t().record }}>
        {() => <RecordScreen onSaved={onRecordSaved} onOpenPaywall={onOpenPaywall} />}
      </Tab.Screen>
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ tabBarLabel: t().stats }}
      />
      <Tab.Screen name="Profile" options={{ tabBarLabel: t().profile }}>
        {() => <ProfileScreen onOpenPaywall={onOpenPaywall} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Billing lives for the whole session: connects on mount, restores
// entitlement, unlocks Pro on purchase.
function Shell() {
  const { isDark } = useTheme();
  const { onboarded, setPro } = useMeetBrief();
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const openPaywall = () => setPaywallVisible(true);

  useEffect(() => {
    void initBilling(() => setPro(true));
    return () => closeBilling();
  }, [setPro]);

  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Tabs onOpenMeeting={setMeetingId} onRecordSaved={setMeetingId} onOpenPaywall={openPaywall} />
      </NavigationContainer>
      <Modal
        visible={meetingId !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setMeetingId(null)}
      >
        {meetingId && (
          <MeetingDetailScreen meetingId={meetingId} onClose={() => setMeetingId(null)} />
        )}
      </Modal>
      <Modal
        visible={paywallVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPaywallVisible(false)}
      >
        <PaywallScreen onClose={() => setPaywallVisible(false)} />
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MeetBriefProvider>
        <ThemeProvider>
          <Shell />
        </ThemeProvider>
      </MeetBriefProvider>
    </SafeAreaProvider>
  );
}
