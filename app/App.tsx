import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { TodayScreen } from './screens/TodayScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// One stack per tab so each tab keeps its own navigation history.
function stackFor(Home: React.ComponentType) {
  const Stack = createNativeStackNavigator();
  return function TabStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    );
  };
}

const TABS = [
  { name: 'Today', component: stackFor(TodayScreen), icon: 'sunny-outline' },
  { name: 'Scan', component: stackFor(ScanScreen), icon: 'camera-outline' },
  {
    name: 'Progress',
    component: stackFor(ProgressScreen),
    icon: 'stats-chart-outline',
  },
  { name: 'Profile', component: stackFor(ProfileScreen), icon: 'person-outline' },
] as const;

const Tab = createBottomTabNavigator();

function RootNavigator() {
  const { colors, colorScheme } = useTheme();
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme: NavigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ color, size }) => {
            const tab = TABS.find((t) => t.name === route.name);
            return tab ? (
              <Ionicons name={tab.icon} size={size} color={color} />
            ) : null;
          },
        })}
      >
        {TABS.map((tab) => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function ThemedStatusBar() {
  const { colorScheme } = useTheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <RootNavigator />
    </ThemeProvider>
  );
}
