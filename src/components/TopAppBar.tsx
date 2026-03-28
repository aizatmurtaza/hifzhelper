import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Props {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
  rightElement?: React.ReactNode;
}

export function TopAppBar({ showBack, onBack, title, showSearch, showMenu, rightElement }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.primaryContainer} />
            </TouchableOpacity>
          ) : (
            <>
              <MaterialIcons name="menu-book" size={22} color={Colors.primaryContainer} />
              <Text style={styles.logo}>Al-Murooja'ah</Text>
            </>
          )}
          {showBack && title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
        </View>
        <View style={styles.right}>
          {showSearch && (
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="search" size={24} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
          {showMenu && (
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="more-vert" size={24} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(250,249,245,0.9)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryContainer,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryContainer,
    letterSpacing: -0.3,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
});
