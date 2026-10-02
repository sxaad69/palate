import React, { useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { LocaleProvider, useStrings } from './lib/strings';
import { LedgerProvider, useLedger } from './store/ledger';
import { OnboardingScreen } from './screens/Onboarding';
import { DashboardScreen } from './screens/Dashboard';
import { AddTransactionScreen, type TxKind } from './screens/AddTransaction';
import { ClientsScreen, ClientDetailScreen } from './screens/Clients';
import { ReportsScreen } from './screens/Reports';
import { PaywallScreen } from './screens/Paywall';
import { ProfileScreen } from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

function MainTabs() {
  const { colors } = useTheme();
  const { t } = useStrings();
  const [addKind, setAddKind] = useState<TxKind>('expense');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, TabIconName> = {
            Today: 'view-dashboard',
            Add: 'plus-circle',
            Clients: 'account-group',
            Reports: 'chart-bar',
            Settings: 'cog',
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
        {({ navigation }: any) => (
          <DashboardScreen
            onAdd={(kind) => {
              setAddKind(kind);
              navigation.navigate('Add');
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Add" options={{ title: t.tabAdd }}>
        {({ navigation }: any) => (
          <AddTransactionScreen
            key={addKind}
            initialKind={addKind}
            onSaved={() => navigation.navigate('Today')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Clients" options={{ title: t.tabClients }}>
        {({ navigation }: any) => (
          <ClientsScreen
            onOpenClient={(id) => navigation.getParent()?.navigate('ClientDetail', { clientId: id })}
            onPaywall={() => navigation.getParent()?.navigate('Paywall')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Reports" options={{ title: t.tabReports }}>
        {({ navigation }: any) => (
          <ReportsScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings" options={{ title: t.pTitle }}>
        {({ navigation }: any) => (
          <ProfileScreen onPaywall={() => navigation.getParent()?.navigate('Paywall')} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function Root() {
  const { colorScheme } = useTheme();
  const { onboarded } = useLedger();

  if (!onboarded) {
    return <OnboardingScreen onDone={() => {}} />;
  }

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ClientDetail">
          {({ navigation, route }: any) => (
            <ClientDetailScreen clientId={route.params.clientId} onBack={() => navigation.goBack()} />
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
        <LedgerProvider>
          <StatusBar style="auto" />
          <Root />
        </LedgerProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
