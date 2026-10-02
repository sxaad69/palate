import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import type { ProfileStackParamList } from '../navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

const APPEARANCE_ORDER: ColorSchemePreference[] = ['system', 'light', 'dark'];
const APPEARANCE_LABEL: Record<ColorSchemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      android_ripple={
        Platform.OS === 'android' && onPress
          ? { color: colors.overlay }
          : undefined
      }
      style={({ pressed }) => [
        styles.row,
        {
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          opacity: pressed && Platform.OS === 'ios' && onPress ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          {
            backgroundColor: colors.accentMuted,
            borderRadius: radii.full,
            marginEnd: spacing.md,
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <Text variant="body" style={{ flex: 1 }}>
        {label}
      </Text>
      {value && (
        <Text variant="bodySmall" color="textSecondary" style={{ marginEnd: spacing.xs }}>
          {value}
        </Text>
      )}
      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textTertiary}
        />
      )}
    </Pressable>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const { colors, spacing, radii, colorScheme, setColorScheme } = useTheme();
  const { goal } = useApp();

  const cycleAppearance = () => {
    // ponytail: ThemeProvider only exposes the setter, not the preference —
    // cycle from the resolved scheme instead of adding new state.
    const next: ColorSchemePreference =
      colorScheme === 'light' ? 'dark' : colorScheme === 'dark' ? 'system' : 'light';
    setColorScheme(next);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
          Profile
        </Text>

        <Pressable
          onPress={() => navigation.navigate('Paywall')}
          accessibilityRole="button"
          accessibilityLabel="Palate Pro — see plans"
          android_ripple={{ color: colors.overlay }}
          style={({ pressed }) => [
            { opacity: pressed && Platform.OS === 'ios' ? 0.85 : 1 },
          ]}
        >
          <Card
            style={{
              marginBottom: spacing.md,
              backgroundColor: colors.accent,
            }}
          >
            <View style={styles.proRow}>
              <View style={{ flex: 1 }}>
                <Text variant="h2" color="textInverse">
                  Palate Pro
                </Text>
                <Text variant="bodySmall" color="textInverse">
                  Unlimited scans, full history, custom goals
                </Text>
              </View>
              <Ionicons
                name="sparkles-outline"
                size={28}
                color={colors.textInverse}
              />
            </View>
          </Card>
        </Pressable>

        <Card>
          <Row icon="flag-outline" label="Goal" value={goal ?? 'Not set'} />
          <Row
            icon="contrast-outline"
            label="Appearance"
            value={APPEARANCE_LABEL[colorScheme] ?? 'System'}
            onPress={cycleAppearance}
          />
          <Row icon="language-outline" label="Language" value="English" />
        </Card>

        <Text
          variant="caption"
          color="textTertiary"
          style={{ textAlign: 'center', marginTop: spacing.lg }}
        >
          Palate 1.0.0 · Made for every cuisine
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  proRow: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
