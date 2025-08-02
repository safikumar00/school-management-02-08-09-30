import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/constants';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export function Avatar({ source, name, size = 'md', showBorder = false }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = [
    styles.base,
    styles[size],
    showBorder && styles.border,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${size}`],
  ];

  return (
    <View style={avatarStyle}>
      {source ? (
        <Image source={{ uri: source }} style={styles.image} />
      ) : (
        <Text style={textStyle}>
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  border: {
    borderWidth: 2,
    borderColor: COLORS.gray[50],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: COLORS.primary[700],
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  // Sizes
  sm: {
    width: 32,
    height: 32,
  },
  md: {
    width: 40,
    height: 40,
  },
  lg: {
    width: 48,
    height: 48,
  },
  xl: {
    width: 64,
    height: 64,
  },
  // Text sizes
  text_sm: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  text_md: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  text_lg: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  text_xl: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
});