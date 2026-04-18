import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? COLORS.gray[50] : COLORS.primary[500]}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={textStyle}>{title}</Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary[500],
  },
  secondary: {
    backgroundColor: COLORS.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
  },
  text_primary: {
    color: COLORS.gray[50],
  },
  text_secondary: {
    color: COLORS.gray[50],
  },
  text_outline: {
    color: COLORS.primary[500],
  },
  text_ghost: {
    color: COLORS.primary[500],
  },
  text_sm: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  text_md: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  text_lg: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});