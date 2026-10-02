import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { StringsProvider, useStrings } from './lib/strings';
import { StudyProvider, useStudy, FREE_DAILY_CAP } from './store/study';
import { Screen } from './components/Screen';
import { Text } from './components/Text';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import StudyScreen from './screens/Study';
import DecksScreen from './screens/Decks';
import StatsScreen from './screens/Stats';
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
      {active && <View style={[styles.dot, { backgroundColor: colors.highlight }]} />}
    </View>
  );
}

function MainTabs({ onPaywall }: { onPaywall: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dueCards, reviewsToday, pro } = useStudy();
  const remaining = pro ? 50 : Math.max(0, FREE_DAILY_CAP - reviewsToday);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: t.today,
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" active={focused} />,
        }}
      >
        {({ navigation }: any) => (
          <HomeScreen
            onStartSession={() => {
              const ids = dueCards.slice(0, remaining).map((c) => c.id);
              navigation.navigate('Study', { ids });
            }}
            onPaywall={onPaywall}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Decks"
        options={{
          title: t.decks,
          tabBarIcon: ({ focused }) => <TabIcon label="🗂" active={focused} />,
        }}
      >
        {() => <DecksScreen onPaywall={onPaywall} />}
      </Tab.Screen>
      <Tab.Screen
        name="Stats"
        options={{
          title: t.stats,
          tabBarIcon: ({ focused }) => <TabIcon label="📊" active={focused} />,
        }}
      >
        {() => <StatsScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          title: t.settings,
          tabBarIcon: ({ focused }) => <TabIcon label="⚙" active={focused} />,
        }}
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
  const { onboarded } = useStudy();

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
            <Stack.Screen name="Study">
              {({ navigation, route }: any) => (
                <StudyScreen
                  cardIds={route.params?.ids ?? []}
                  onDone={() => navigation.popToTop()}
                />
              )}
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
        <StudyProvider>
          <Root />
        </StudyProvider>
      </StringsProvider>
    </ThemeProvider>
  );
}
