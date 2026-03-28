import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

type Rating = 'forgot' | 'glanced' | 'solid';

interface Props {
  rating: Rating;
  onPress: () => void;
}

const config = {
  forgot: {
    bg: Colors.tertiaryContainer,
    iconColor: '#ffffff',
    icon: 'close' as const,
    label: 'FORGOT',
    labelColor: Colors.tertiary,
  },
  glanced: {
    bg: Colors.secondaryContainer,
    iconColor: Colors.onSecondaryContainer,
    icon: 'replay' as const,
    label: 'GLANCED',
    labelColor: Colors.secondary,
  },
  solid: {
    bg: Colors.primaryContainer,
    iconColor: '#ffffff',
    icon: 'check' as const,
    label: 'SOLID',
    labelColor: Colors.primary,
  },
};

export function RatingButton({ rating, onPress }: Props) {
  const c = config[rating];
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.7}>
      <View style={[styles.circle, { backgroundColor: c.bg }]}>
        <MaterialIcons name={c.icon} size={26} color={c.iconColor} />
      </View>
      <Text style={[styles.label, { color: c.labelColor }]}>{c.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
