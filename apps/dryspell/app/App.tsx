import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { LocaleProvider, useStrings } from './lib/strings';
import { SobrietyProvider, useSobriety } from './store/sobriety';
import { OnboardingScreen } from './screens/Onboarding';
import { DashboardScreen } from './screens/Dashboard';
import { MilestonesScreen } from './screens/Milestones';
import { JournalScreen } from './screens/Journal';
import { AchievementsScreen } from './screens/Achievements';
import { SOSScreen } from './screens/SOS';
import { PaywallScreen } from './screens/Paywall';
import { ProfileScreen } from './screens/Profile';
import { GoalsScreen } from './screens/Goals';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Tabs live inside the stack so tab screens can navigate to stack screens
// (SOS, Paywall, Goals) via the parent navigation.
function MainTabs() {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { pro } = useSobriety();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, TabIconName> = {
            Today: 'weather-sunset',
            Timeline: 'timeline-clock',
            Journal: 'notebook',
            Badges: 'medal',
            Profile: 'account-circle',
          };
          return (
            <MaterialCommunityIcons
              name={icons[route.name] ?? 'circle'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Today" options={{ title: t.tabToday }}>
        {({ navigation }: any) => {
          const parent = navigation.getParent();
          return (
            <DashboardScreen
              onSOS={() => parent?.navigate('SOS')}
              onGoals={() => parent?.navigate(pro ? 'Goals' : 'Paywall')}
              onPaywall={() => parent?.navigate('Paywall')}
            />
          );
        }}
      </Tab.Screen>
      <Tab.Screen name="Timeline" component={MilestonesScreen} options={{ title: t.tabTimeline }} />
      <Tab.Screen name="Journal" options={{ title: t.jTitle }}>
        {({ navigation }: any) => (
          <JournalScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Badges" component={AchievementsScreen} options={{ title: t.tabBadges }} />
      <Tab.Screen name="Profile" options={{ title: t.pTitle }}>
        {({ navigation }: any) => (
          <ProfileScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Root() {
  const { colorScheme } = useTheme();
  const { onboarded } = useSobriety();

  // Onboarding flips `onboarded` in the store, which re-renders into the app.
  if (!onboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="SOS">
          {({ navigation }: any) => <SOSScreen onClose={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Paywall">
          {({ navigation }: any) => <PaywallScreen onClose={() => navigation.goBack()} />}
        </Stack.Screen>
        <Stack.Screen name="Goals" component={GoalsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <SobrietyProvider>
          <StatusBar style="auto" />
          <Root />
        </SobrietyProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
