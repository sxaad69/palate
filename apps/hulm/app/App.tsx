import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { DreamsProvider, useDreams } from './store/dreams';
import { StringsProvider, useStrings } from './lib/strings';
import { spacing } from './theme/tokens';
import { Text } from './components/Text';
import OnboardingScreen from './screens/Onboarding';
import JournalScreen from './screens/Journal';
import DreamFormScreen from './screens/DreamForm';
import DreamDetailScreen from './screens/DreamDetail';
import SymbolsScreen from './screens/Symbols';
import SymbolDetailScreen from './screens/SymbolDetail';
import InsightsScreen from './screens/Insights';
import PaywallScreen from './screens/Paywall';
import SettingsScreen from './screens/Settings';

type Route =
  | { name: 'journal' }
  | { name: 'symbols' }
  | { name: 'insights' }
  | { name: 'settings' }
  | { name: 'form'; dreamId: string | null }
  | { name: 'detail'; dreamId: string }
  | { name: 'symbol'; symbolId: string; from: Route };

const TABS: { name: 'journal' | 'symbols' | 'insights' | 'settings'; emoji: string; label: (t: any) => string }[] = [
  { name: 'journal', emoji: '🌙', label: (t) => t.journal },
  { name: 'symbols', emoji: '🔮', label: (t) => t.symbols },
  { name: 'insights', emoji: '📊', label: (t) => t.insights },
  { name: 'settings', emoji: '⚙️', label: (t) => t.settings },
];

function Shell() {
  const { colors, loaded } = useTheme();
  const { t } = useStrings();
  const { onboarded } = useDreams();
  const [route, setRoute] = useState<Route>({ name: 'journal' });
  const [paywall, setPaywall] = useState(false);
  const rtl = t.dir === 'rtl';

  if (!loaded) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.highlight} />
      </View>
    );
  }

  if (!onboarded) return <OnboardingScreen />;

  const isTab = route.name === 'journal' || route.name === 'symbols' || route.name === 'insights' || route.name === 'settings';
  const onSymbol = (symbolId: string) => setRoute({ name: 'symbol', symbolId, from: route });

  const backFromSymbol = () => {
    if (route.name === 'symbol') setRoute(route.from);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {route.name === 'journal' && (
          <JournalScreen
            onOpen={(id) => setRoute({ name: 'detail', dreamId: id })}
            onNew={() => setRoute({ name: 'form', dreamId: null })}
          />
        )}
        {route.name === 'symbols' && (
          <SymbolsScreen onOpen={onSymbol} onPaywall={() => setPaywall(true)} />
        )}
        {route.name === 'insights' && (
          <InsightsScreen onPaywall={() => setPaywall(true)} onSymbol={onSymbol} />
        )}
        {route.name === 'settings' && <SettingsScreen />}
        {route.name === 'form' && (
          <DreamFormScreen
            dreamId={route.dreamId}
            onDone={(id) => setRoute({ name: 'detail', dreamId: id })}
            onCancel={() => setRoute({ name: 'journal' })}
          />
        )}
        {route.name === 'detail' && (
          <DreamDetailScreen
            dreamId={route.dreamId}
            onBack={() => setRoute({ name: 'journal' })}
            onEdit={() => setRoute({ name: 'form', dreamId: route.dreamId })}
            onSymbol={onSymbol}
          />
        )}
        {route.name === 'symbol' && (
          <SymbolDetailScreen symbolId={route.symbolId} onBack={backFromSymbol} />
        )}
        {paywall && <PaywallScreen onClose={() => setPaywall(false)} />}
      </View>
      {isTab && !paywall && (
        <View style={[styles.tabs, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {TABS.map((tab) => {
            const active = route.name === tab.name;
            return (
              <Pressable
                key={tab.name}
                onPress={() => setRoute({ name: tab.name } as Route)}
                style={styles.tab}
              >
                <Text variant="h2" align="center" style={{ opacity: active ? 1 : 0.5 }}>
                  {tab.emoji}
                </Text>
                <Text variant="caption" align="center" style={{ color: active ? colors.highlight : colors.textTertiary }}>
                  {tab.label(t)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StringsProvider>
          <DreamsProvider>
            <Shell />
          </DreamsProvider>
        </StringsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
