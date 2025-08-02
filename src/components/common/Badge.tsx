import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/constants';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ text, variant = 'gray', size = 'md' }: BadgeProps) {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[size],
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary[100],
  },
  secondary: {
    backgroundColor: COLORS.secondary[100],
  },
  success: {
    backgroundColor: COLORS.success[100],
  },
  warning: {
    backgroundColor: COLORS.warning[100],
  },
  error: {
    backgroundColor: COLORS.error[100],
  },
  gray: {
    backgroundColor: COLORS.gray[100],
  },
  // Text colors
  text_primary: {
    color: COLORS.primary[700],
  },
  text_secondary: {
    color: COLORS.secondary[700],
  },
  text_success: {
    color: COLORS.success[700],
  },
  text_warning: {
    color: COLORS.warning[700],
  },
  text_error: {
    color: COLORS.error[700],
  },
  text_gray: {
    color: COLORS.gray[700],
  },
  // Sizes
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text_sm: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  text_md: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});