import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';

export function ScanScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text variant="h1">Scan</Text>
        <Text variant="body" color="textSecondary" style={styles.sub}>
          Snap your meal — AI food recognition goes here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sub: { textAlign: 'center' },
});
