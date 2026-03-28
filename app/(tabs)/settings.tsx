import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopAppBar } from '../../src/components/TopAppBar';
import { Colors } from '../../src/theme/colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <TopAppBar />
      <View style={[styles.center, { paddingTop: insets.top + 56 }]}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.onSurface },
  sub: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 8 },
});
