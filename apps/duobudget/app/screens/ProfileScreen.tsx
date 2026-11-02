import React, { useState } from 'react';
import { View, Pressable, TextInput, StyleSheet, Share } from 'react-native';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { useTwoPurse } from '../store/app';
import { t } from '../lib/i18n';
import { CURRENCIES } from '../lib/money';

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {label}
      </TPText>
      {children}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? colors.accentMuted : colors.surface,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
      }}
    >
      <TPText variant="bodySmall" color={selected ? colors.accent : colors.textPrimary}>
        {label}
      </TPText>
    </Pressable>
  );
}

export function ProfileScreen({ onOpenPaywall }: { onOpenPaywall: () => void }) {
  const { colors, spacing, radii, themeMode, setThemeMode } = useTheme();
  const {
    lang,
    setLanguage,
    currency,
    setCurrency,
    meName,
    partnerName,
    setNames,
    householdCode,
    setHouseholdCode,
    isPro,
    setAppThemeMode,
  } = useTwoPurse();

  const [joinCode, setJoinCode] = useState('');
  const [linkedStatus, setLinkedStatus] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t().inviteMessage}${householdCode}`,
      });
    } catch {
      // dismissed
    }
  };

  const handleLink = () => {
    if (joinCode.trim().length >= 4) {
      setHouseholdCode(joinCode.trim().toUpperCase());
      setLinkedStatus(t().householdLinked);
      setJoinCode('');
    }
  };

  const pickTheme = (m: ThemeMode) => {
    setThemeMode(m);
    setAppThemeMode(m);
  };

  return (
    <Screen>
      <TPText variant="h1" style={{ marginTop: spacing.md }}>
        {t().profile}
      </TPText>
      <View style={{ height: spacing.md }} />

      {/* Pro banner */}
      <Pressable
        accessibilityRole="button"
        onPress={onOpenPaywall}
        disabled={isPro}
        style={{
          backgroundColor: colors.cardTint,
          borderRadius: radii.lg,
          padding: spacing.md,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TPText variant="h3" color={colors.accent}>
          {isPro ? `✦ ${t().proActive}` : `✦ ${t().getPro}`}
        </TPText>
        {!isPro && (
          <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>
            {t().paywallSubtitle}
          </TPText>
        )}
      </Pressable>

      <Row label={t().appearance}>
        <View style={styles.row}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
            <Chip
              key={m}
              label={m === 'system' ? t().system : m === 'light' ? t().light : t().dark}
              selected={themeMode === m}
              onPress={() => pickTheme(m)}
            />
          ))}
        </View>
      </Row>

      <Row label={t().language}>
        <View style={styles.row}>
          <Chip label="English" selected={lang === 'en'} onPress={() => setLanguage('en')} />
          <Chip label="العربية" selected={lang === 'ar'} onPress={() => setLanguage('ar')} />
        </View>
      </Row>

      <Row label={t().currency}>
        <View style={styles.row}>
          {CURRENCIES.map((c) => (
            <Chip key={c} label={c} selected={currency === c} onPress={() => setCurrency(c)} />
          ))}
        </View>
      </Row>

      <Row label={t().yourName}>
        <TextInput
          value={meName}
          onChangeText={(v) => setNames(v, partnerName)}
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md }]}
        />
      </Row>

      <Row label={t().partnerName}>
        <TextInput
          value={partnerName}
          onChangeText={(v) => setNames(meName, v)}
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md }]}
        />
      </Row>

      {/* Couple Sync (Household Share) */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
          marginTop: spacing.sm,
          marginBottom: spacing.md,
        }}
      >
        <TPText variant="h3" color={colors.accent} style={{ marginBottom: spacing.xs }}>
          👥 {t().coupleSync}
        </TPText>
        <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
          {t().householdSyncDesc}
        </TPText>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surfaceAlt,
            padding: spacing.md,
            borderRadius: radii.md,
            marginBottom: spacing.md,
          }}
        >
          <View>
            <TPText variant="overline" color={colors.textTertiary}>
              {t().yourHouseholdCode}
            </TPText>
            <TPText variant="h2" color={colors.textPrimary} style={{ letterSpacing: 2 }}>
              {householdCode}
            </TPText>
          </View>
          <Button
            title={t().shareInvite}
            variant="secondary"
            size="sm"
            onPress={handleShare}
          />
        </View>

        <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.xs }}>
          {t().joinHousehold}
        </TPText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TextInput
            placeholder={t().enterCode}
            placeholderTextColor={colors.textTertiary}
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="characters"
            maxLength={8}
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: colors.surfaceAlt,
                borderRadius: radii.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          />
          <Button
            title={t().linkHousehold}
            variant="primary"
            size="sm"
            onPress={handleLink}
            disabled={joinCode.trim().length < 4}
          />
        </View>
        {linkedStatus ? (
          <TPText variant="caption" color={colors.success} style={{ marginTop: spacing.sm }}>
            ✓ {linkedStatus}
          </TPText>
        ) : null}
      </View>

      <View
        style={{
          backgroundColor: colors.surfaceAlt,
          borderRadius: radii.lg,
          padding: spacing.md,
          marginTop: spacing.sm,
        }}
      >
        <TPText variant="bodySmall" color={colors.textSecondary}>
          🔒 {t().dataNote}
        </TPText>
      </View>

      <View style={{ height: spacing.lg }} />
      <TPText variant="caption" color={colors.textTertiary} style={styles.center}>
        {t().appName} · {t().version} 1.0.0
      </TPText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  input: { borderWidth: 1, fontSize: 16 },
});
