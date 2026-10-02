import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { StringsProvider, useStrings } from './lib/strings';
import { FocusProvider, useFocus, type Session } from './store/focus';
import { Text } from './components/Text';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import SessionScreen from './screens/Session';
import CompleteScreen from './screens/Complete';
import HistoryScreen from './screens/History';
import PaywallScreen from './screens/Paywall';
import SettingsScreen from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, active }: { label: string; active: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconWrap}>
      <Text variant="caption" style={{ color: active ? colors.textPrimary : colors.textTertiary }}>
        {label}
      </Text>
      {active && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
    </View>
  );
}

function MainTabs({ onPaywall }: { onPaywall: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{ title: t.today, tabBarIcon: ({ focused }) => <TabIcon label="🎯" active={focused} /> }}
      >
        {({ navigation }: any) => (
          <HomeScreen
            onStart={(durationSec, label) => navigation.navigate('Session', { durationSec, label })}
            onPaywall={onPaywall}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="History"
        options={{ title: t.history, tabBarIcon: ({ focused }) => <TabIcon label="📊" active={focused} /> }}
      >
        {() => <HistoryScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{ title: t.settings, tabBarIcon: ({ focused }) => <TabIcon label="⚙" active={focused} /> }}
      >
        {() => <SettingsScreen onPaywall={onPaywall} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 2 },
  dot: { width: 16, height: 3, borderRadius: 2 },
});

function Root() {
  const { colorScheme, isDark } = useTheme();
  const { onboarded, strictMode, addSession } = useFocus();
  const [finished, setFinished] = useState<Session | null>(null);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {!onboarded ? (
          <OnboardingScreen />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {({ navigation }: any) => (
                <MainTabs onPaywall={() => navigation.navigate('Paywall')} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Session">
              {({ navigation, route }: any) => (
                <SessionScreen
                  durationSec={route.params?.durationSec ?? 1500}
                  label={route.params?.label ?? ''}
                  strict={strictMode}
                  onFinish={(data) => {
                    const s = addSession(data);
                    setFinished(s);
                    navigation.replace('Complete');
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Complete">
              {({ navigation }: any) =>
                finished ? (
                  <CompleteScreen
                    session={finished}
                    onHome={() => navigation.popToTop()}
                    onNew={() => navigation.popToTop()}
                  />
                ) : null
              }
            </Stack.Screen>
            <Stack.Screen name="Paywall">
              {({ navigation }: any) => (
                <PaywallScreen onClose={() => navigation.goBack()} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StringsProvider>
        <FocusProvider>
          <Root />
        </FocusProvider>
      </StringsProvider>
    </ThemeProvider>
  );
}
