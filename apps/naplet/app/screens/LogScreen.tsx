import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

// The 3am screen: giant one-thumb buttons. Sleep is a start/stop toggle;
// feed and diaper open quick editors.
export function LogScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, activeSleepId, startSleep, endSleep } = useApp();
  const navigation = useNavigation<any>();

  const sleeping = activeSleepId != null;

  const BigButton = ({
    label,
    sub,
    onPress,
    active,
  }: {
    label: string;
    sub?: string;
    onPress: () => void;
    active?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        backgroundColor: active ? colors.accent : colors.surface,
        borderWidth: 2,
        borderColor: active ? colors.accent : colors.border,
        borderRadius: radii.xl,
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        padding: spacing.md,
      }}
    >
      <Text variant="h1" color={active ? 'textInverse' : 'textPrimary'} style={{ textAlign: 'center' }}>
        {label}
      </Text>
      {sub ? (
        <Text variant="bodySmall" color={active ? 'textInverse' : 'textSecondary'} style={{ marginTop: spacing.xs, textAlign: 'center' }}>
          {sub}
        </Text>
      ) : null}
    </Pressable>
  );

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: spacing.md }}>
        <BigButton
          label={sleeping ? `🌙 ${t.endSleep}` : `🌙 ${t.startSleep}`}
          sub={sleeping ? t.sleeping : undefined}
          active={sleeping}
          onPress={() => (sleeping ? endSleep() : startSleep())}
        />
        <BigButton
          label={`🍼 ${t.logFeed}`}
          onPress={() => navigation.navigate('FeedEditor')}
        />
        <BigButton
          label={`🩲 ${t.logDiaper}`}
          onPress={() => navigation.navigate('DiaperEditor')}
        />
        <Text variant="caption" color="textTertiary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
          {t.nightNote}
        </Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
