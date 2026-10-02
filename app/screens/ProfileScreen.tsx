import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';

export function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text variant="h1">Profile</Text>
        <Text variant="body" color="textSecondary" style={styles.sub}>
          Settings, AR/EN language toggle, and account go here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sub: { textAlign: 'center' },
});
