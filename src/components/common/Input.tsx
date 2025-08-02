import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'outline',
  style,
  ...props
}: InputProps) {
  const inputStyle = [
    styles.base,
    styles[variant],
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={inputStyle}
          placeholderTextColor={COLORS.gray[500]}
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    fontSize: TYPOGRAPHY.fontSize.base,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flex: 1,
  },
  default: {
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  filled: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 0,
  },
  outline: {
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  withLeftIcon: {
    paddingLeft: 40,
  },
  withRightIcon: {
    paddingRight: 40,
  },
  error: {
    borderColor: COLORS.error[500],
  },
  leftIcon: {
    position: 'absolute',
    left: SPACING.sm,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: SPACING.sm,
    zIndex: 1,
  },
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  errorText: {
    color: COLORS.error[600],
  },
});