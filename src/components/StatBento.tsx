import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

type Variant = 'solid' | 'glanced' | 'forgot';

interface Props {
  variant: Variant;
  count: number;
}

const config = {
  solid: {
    bg: Colors.primaryContainer,
    textColor: Colors.onPrimary,
    icon: 'check-circle' as const,
    label: 'SOLID',
  },
  glanced: {
    bg: Colors.secondaryContainer,
    textColor: Colors.onSecondaryContainer,
    icon: 'error' as const,
    label: 'GLANCED',
  },
  forgot: {
    bg: Colors.tertiaryContainer,
    textColor: Colors.onTertiaryContainer,
    icon: 'cancel' as const,
    label: 'FORGOT',
  },
};

export function StatBento({ variant, count }: Props) {
  const c = config[variant];
  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <MaterialIcons name={c.icon} size={20} color={c.textColor} />
      <View>
        <Text style={[styles.count, { color: c.textColor }]}>{count}</Text>
        <Text style={[styles.label, { color: c.textColor }]}>{c.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
});
