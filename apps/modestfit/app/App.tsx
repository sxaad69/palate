import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { ModestFitProvider, useModestFit } from './store/app';
import { t } from './lib/i18n';
import { closeBilling, initBilling } from './lib/billing';
import { MFText } from './components/MFText';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WardrobeScreen } from './screens/WardrobeScreen';
import { OutfitsScreen } from './screens/OutfitsScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { SuggestScreen } from './screens/SuggestScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import { AddPieceScreen } from './screens/AddPieceScreen';
import { CreateOutfitScreen } from './screens/CreateOutfitScreen';
import { AssignDayScreen } from './screens/AssignDayScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import type { RootStackParamList, RootTabParamList } from './navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Wardrobe: '👗',
  Outfits: '✨',
  Planner: '📅',
  Suggest: '💡',
  Profile: '👤',
};

function Tabs() {
  const { colors } = useTheme();
  const s = t();
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
        tabBarLabel: s[`tab_${route.name.toLowerCase()}` as keyof typeof s] as string,
        // Emoji glyphs keep v1 dependency-free (no icon font).
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <MFText variant="h2" color={color}>
            {TAB_ICONS[route.name]}
          </MFText>
        ),
      })}
    >
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Outfits" component={OutfitsScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Suggest" component={SuggestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="AddPiece"
        component={AddPieceScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="CreateOutfit"
        component={CreateOutfitScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="AssignDay"
        component={AssignDayScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Insights" component={InsightsScreen} />
    </Stack.Navigator>
  );
}

function Shell() {
  const { isDark } = useTheme();
  const { onboarded, hydrated, setPro } = useModestFit();

  useEffect(() => {
    void initBilling(() => setPro(true));
    return () => closeBilling();
  }, [setPro]);

  if (!hydrated) return null;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        {onboarded ? <MainStack /> : <OnboardingScreen />}
      </NavigationContainer>
    </>
  );
}

// ThemeHost sits inside the store so the persisted appearance choice drives
// the controlled ThemeProvider.
function ThemeHost() {
  const { themeMode, setThemeMode } = useModestFit();
  return (
    <ThemeProvider themeMode={themeMode} onThemeModeChange={setThemeMode}>
      <Shell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ModestFitProvider>
        <ThemeHost />
      </ModestFitProvider>
    </SafeAreaProvider>
  );
}
