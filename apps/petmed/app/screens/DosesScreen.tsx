import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { petColor } from '../components/PetAvatar';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import {
  occurrencesInRange,
  resolveStatus,
  localDayKey,
  type DoseEventRec,
  type Occurrence,
} from '../lib/schedule';

interface Props {
  onAddMedication: () => void;
}

interface Resolved extends Occurrence {
  petName: string;
  medName: string;
  dose: string;
  color: string;
  status: 'given' | 'skipped' | 'overdue' | 'upcoming';
}

const DUE_WINDOW_MS = 60 * 60 * 1000; // "due now" = overdue or within 60 min

export function DosesScreen({ onAddMedication }: Props) {
  const { colors, spacing, petColors } = useTheme();
  const { pets, meds, doseEvents, logDose, undoDose } = usePaw();
  const strings = t();
  const now = Date.now();
  const today = localDayKey(new Date(now));

  const items = useMemo<Resolved[]>(() => {
    const evMap = new Map<string, DoseEventRec>(doseEvents.map((e) => [e.key, e]));
    const petById = new Map(pets.map((p) => [p.id, p]));
    const medById = new Map(meds.map((m) => [m.id, m]));
    return occurrencesInRange(meds, today, today).map((o) => {
      const pet = petById.get(o.petId);
      const med = medById.get(o.medId);
      return {
        ...o,
        petName: pet?.name ?? '',
        medName: med?.name ?? '',
        dose: med?.dose ?? '',
        color: pet ? petColor(pet, [...petColors]) : colors.accent,
        status: resolveStatus(o, now, evMap),
      };
    });
  }, [pets, meds, doseEvents, today, now, petColors, colors.accent]);

  if (meds.length === 0) {
    return (
      <Screen>
        <PawText variant="h1" style={{ marginTop: spacing.md }}>{strings.tabDoses}</PawText>
        <EmptyState icon="💊" title={strings.allCaughtUp} body={strings.addMedsFirst} actionLabel={strings.addMedication} onAction={onAddMedication} />
      </Screen>
    );
  }

  const givenCount = items.filter((i) => i.status === 'given').length;
  const dueNow = items.filter(
    (i) => i.status === 'overdue' || (i.status === 'upcoming' && i.at - now <= DUE_WINDOW_MS),
  );
  const later = items.filter((i) => i.status === 'upcoming' && i.at - now > DUE_WINDOW_MS);
  const done = items.filter((i) => i.status === 'given' || i.status === 'skipped');

  const renderItem = (i: Resolved) => (
    <Card key={i.key} accentBorder={i.color} style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <PawText variant="bodySmall" color={i.color} style={{ fontWeight: '700' }}>
            {i.petName} · {i.time}
            {i.status === 'overdue' ? `  ⚠ ${strings.overdue}` : ''}
            {i.status === 'skipped' ? `  · ${strings.skipped}` : ''}
          </PawText>
          <PawText variant="h3" style={{ marginTop: 2 }}>
            {i.medName}
          </PawText>
          <PawText variant="caption" color={colors.textSecondary}>
            {i.dose}
          </PawText>
        </View>
      </View>
      {i.status === 'given' || i.status === 'skipped' ? (
        <Button title={strings.undo} variant="ghost" size="sm" onPress={() => undoDose(i.key)} style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }} />
      ) : (
        <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
          <Button title={strings.given} variant="dose" size="sm" onPress={() => logDose(i.key, i.medId, i.petId, 'given')} style={{ flex: 1, marginRight: spacing.sm }} />
          <Button title={strings.skipDose} variant="ghost" size="sm" onPress={() => logDose(i.key, i.medId, i.petId, 'skipped')} style={{ flex: 1 }} />
        </View>
      )}
    </Card>
  );

  return (
    <Screen>
      <PawText variant="h1" style={{ marginTop: spacing.md }}>{strings.tabDoses}</PawText>
      <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
        {givenCount}/{items.length} {strings.dosesToday}
      </PawText>

      {items.length === 0 ? (
        <EmptyState icon="✅" title={strings.allCaughtUp} body={strings.allCaughtUpBody} />
      ) : (
        <>
          {dueNow.length > 0 && (
            <>
              <PawText variant="overline" color={colors.doseAction} style={{ marginBottom: spacing.sm }}>
                {strings.dueNow}
              </PawText>
              {dueNow.map(renderItem)}
            </>
          )}
          {later.length > 0 && (
            <>
              <PawText variant="overline" color={colors.textSecondary} style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
                {strings.laterToday}
              </PawText>
              {later.map(renderItem)}
            </>
          )}
          {done.length > 0 && (
            <>
              <PawText variant="overline" color={colors.textSecondary} style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
                {strings.today}
              </PawText>
              {done.map(renderItem)}
            </>
          )}
        </>
      )}
    </Screen>
  );
}
