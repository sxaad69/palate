import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePosture } from '../store/app';
import { getLang, t, type Lang } from '../lib/i18n';

const GLYPHS = ['◍', '✦', '➤', '◐', '▣', '∑'];

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded, setLanguage } = usePosture();
  const [page, setPage] = useState(0);
  const s = t();

  const pickLang = (l: Lang) => {
    setLanguage(l);
  };

  const pages: { title: string; body: React.ReactNode }[] = [
    {
      title: s.obLangTitle,
      body: (
        <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
          {(['en', 'ar'] as Lang[]).map((l) => (
            <Button
              key={l}
              title={l === 'en' ? 'English' : 'العربية'}
              variant={getLang() === l ? 'primary' : 'secondary'}
              onPress={() => pickLang(l)}
            />
          ))}
        </View>
      ),
    },
    { title: s.ob1Title, body: <PostureText variant="body" color={colors.textSecondary}>{s.ob1Body}</PostureText> },
    { title: s.ob2Title, body: <PostureText variant="body" color={colors.textSecondary}>{s.ob2Body}</PostureText> },
    { title: s.ob3Title, body: <PostureText variant="body" color={colors.textSecondary}>{s.ob3Body}</PostureText> },
    { title: s.ob4Title, body: <PostureText variant="body" color={colors.textSecondary}>{s.ob4Body}</PostureText> },
    {
      title: s.ob5Title,
      body: (
        <Card>
          {[s.ob5B1, s.ob5B2, s.ob5B3, s.ob5B4].map((b, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
              <PostureText variant="body" color={colors.accent}>{`${i + 1}. `}</PostureText>
              <PostureText variant="body" color={colors.textSecondary} style={{ flex: 1 }}>
                {b}
              </PostureText>
            </View>
          ))}
        </Card>
      ),
    },
  ];

  const last = page === pages.length - 1;
  const p = pages[page]!;

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg }}>
        <PostureText variant="h1" color={colors.accent}>
          {s.appName}
        </PostureText>
        <View style={{ height: spacing.xl }} />
        <PostureText variant="display" color={colors.accent} style={{ textAlign: 'center' }}>
          {GLYPHS[page]}
        </PostureText>
        <View style={{ height: spacing.lg }} />
        <PostureText variant="h1" style={{ textAlign: 'center' }}>
          {p.title}
        </PostureText>
        <View style={{ height: spacing.md }} />
        {p.body}
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.md }}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: i === page ? colors.accent : colors.border,
              }}
            />
          ))}
        </View>
        <Button
          title={last ? s.getStarted : s.continue}
          size="lg"
          onPress={() => (last ? setOnboarded(true) : setPage(page + 1))}
        />
      </View>
    </Screen>
  );
}
