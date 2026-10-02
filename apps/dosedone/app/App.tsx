import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { LocaleProvider, useStrings } from './lib/strings';
import { MedsProvider, useMeds } from './store/meds';
import { rescheduleDoseReminders } from './lib/notifications';
import { OnboardingScreen } from './screens/Onboarding';
import { TodayScreen } from './screens/Today';
import { MedsScreen, MedFormScreen } from './screens/Meds';
import { ProgressScreen } from './screens/Progress';
import { FamilyScreen } from './screens/Family';
import { PaywallScreen } from './screens/Paywall';
import { SettingsScreen } from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

function MainTabs() {
  const { colors } = useTheme();
  const { t } = useStrings();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, minHeight: 64 },
        tabBarLabelStyle: { fontSize: 14, paddingBottom: 6 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, TabIconName> = {
            Today: 'calendar-check',
            Meds: 'pill',
            Progress: 'trending-up',
            Family: 'account-heart',
            Settings: 'cog',
          };
          return (
            <MaterialCommunityIcons
              name={icons[route.name] ?? 'circle'}
              size={size + 4}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Today" options={{ title: t.tabToday }}>
        {({ navigation }: any) => (
          <TodayScreen onAddMed={() => navigation.getParent()?.navigate('MedForm', { medId: null })} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Meds" options={{ title: t.tabMeds }}>
        {({ navigation }: any) => (
          <MedsScreen
            onEdit={(id) => navigation.getParent()?.navigate('MedForm', { medId: id })}
            onAdd={() => navigation.getParent()?.navigate('MedForm', { medId: null })}
            onPaywall={() => navigation.getParent()?.navigate('Paywall')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: t.tabProgress }} />
      <Tab.Screen name="Family" options={{ title: t.tabFamily }}>
        {({ navigation }: any) => (
          <FamilyScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: t.sTitle }}>
        {({ navigation }: any) => (
          <SettingsScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Keeps local dose reminders in sync with the med list and language.
function ReminderSync() {
  const { meds } = useMeds();
  const { t } = useStrings();
  useEffect(() => {
    rescheduleDoseReminders(meds, {
      title: t.notifTitle,
      body: (name, dosage) => `${name} — ${dosage}`,
    });
  }, [meds, t]);
  return null;
}

function Root() {
  const { colorScheme } = useTheme();
  const { onboarded } = useMeds();

  if (!onboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReminderSync />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="MedForm">
          {({ navigation, route }: any) => (
            <MedFormScreen medId={route.params?.medId ?? null} onDone={() => navigation.goBack()} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Paywall">
          {({ navigation }: any) => <PaywallScreen onClose={() => navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <MedsProvider>
          <StatusBar style="auto" />
          <Root />
        </MedsProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
