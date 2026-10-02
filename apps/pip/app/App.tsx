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
import { AppProvider, useApp } from './store/app';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TodayScreen } from './screens/TodayScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import { RecipeEditorScreen } from './screens/RecipeEditorScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import type { RootTabParamList } from './navigation';

function tabStack(
  screens: { name: string; component: React.ComponentType<any> }[],
) {
  const Stack = createNativeStackNavigator();
  return function TabStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {screens.map((s) => (
          <Stack.Screen key={s.name} name={s.name} component={s.component} />
        ))}
      </Stack.Navigator>
    );
  };
}

const TABS = [
  {
    name: 'Today',
    icon: 'sunny-outline',
    component: tabStack([{ name: 'TodayHome', component: TodayScreen }]),
  },
  {
    name: 'Recipes',
    icon: 'restaurant-outline',
    component: tabStack([
      { name: 'RecipesHome', component: RecipesScreen },
      { name: 'RecipeEditor', component: RecipeEditorScreen },
    ]),
  },
  {
    name: 'Progress',
    icon: 'bar-chart-outline',
    component: tabStack([{ name: 'ProgressHome', component: ProgressScreen }]),
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    component: tabStack([
      { name: 'ProfileHome', component: ProfileScreen },
      { name: 'Paywall', component: PaywallScreen },
    ]),
  },
] as const;

const Tab = createBottomTabNavigator<RootTabParamList>();

function MainTabs() {
  const { colors, colorScheme } = useTheme();
  const { t } = useApp();
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

  const labels: Record<string, string> = {
    Today: t.today,
    Recipes: t.recipes,
    Progress: t.progress,
    Profile: t.profile,
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
            const tab = TABS.find((x) => x.name === route.name);
            return tab ? (
              <Ionicons name={tab.icon} size={size} color={color} />
            ) : null;
          },
          tabBarLabel: labels[route.name] ?? route.name,
        })}
      >
        {TABS.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function ThemedStatusBar() {
  const { colorScheme } = useTheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

function Root() {
  const { onboarded } = useApp();
  return onboarded ? <MainTabs /> : <OnboardingScreen />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <ThemedStatusBar />
        <Root />
      </AppProvider>
    </ThemeProvider>
  );
}
