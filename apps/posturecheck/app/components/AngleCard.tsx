import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PostureText } from './PostureText';
import { Card } from './Card';
import { angleLabel, observationText, severityLabel } from '../lib/format';
import { formatValue, type Observation, type Severity } from '../lib/pose';

function sevColor(sev: Severity, colors: ReturnType<typeof useTheme>['colors']): string {
  return sev === 'good' ? colors.success : sev === 'watch' ? colors.warning : colors.danger;
}

// One angle reading: label + measured value + severity chip + observation copy.
export function AngleCard({ observation }: { observation: Observation }) {
  const { colors, spacing, radii } = useTheme();
  const { title, detail } = observationText(observation);
  const c = sevColor(observation.severity, colors);
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PostureText variant="h3">{angleLabel(observation.angle)}</PostureText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <PostureText variant="h3" color={c}>
            {formatValue(observation)}
          </PostureText>
          <View
            style={{
              backgroundColor: c,
              borderRadius: radii.full,
              paddingHorizontal: spacing.sm,
              paddingVertical: 4,
            }}
          >
            <PostureText variant="caption" color="#FFFFFF">
              {severityLabel(observation.severity)}
            </PostureText>
          </View>
        </View>
      </View>
      <View style={{ height: spacing.sm }} />
      <PostureText variant="bodySmall">{title}</PostureText>
      <PostureText variant="bodySmall" color={colors.textSecondary}>
        {detail}
      </PostureText>
    </Card>
  );
}
