import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    opacity: 0.6,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.base,
    marginBottom: SPACING.lg,
  },
  action: {
    marginTop: SPACING.md,
  },
});