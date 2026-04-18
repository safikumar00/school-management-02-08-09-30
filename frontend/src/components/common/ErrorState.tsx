import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle, WifiOff, Clock, Lock } from 'lucide-react-native';
import { Button } from './Button';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import type { ApiError } from '../../services/api';

interface Props {
  error: ApiError | null | undefined;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ error, onRetry, title }: Props) {
  if (!error) return null;

  const Icon =
    error.code === 'NETWORK'
      ? WifiOff
      : error.code === 'TIMEOUT'
      ? Clock
      : error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN'
      ? Lock
      : AlertCircle;

  const heading = title ?? mapHeading(error.code);

  return (
    <View style={styles.container} data-testid="error-state">
      <View style={styles.iconRing}>
        <Icon size={32} color={COLORS.error[600]} />
      </View>
      <Text style={styles.title}>{heading}</Text>
      <Text style={styles.message}>{error.message}</Text>
      {onRetry && error.retryable !== false && (
        <Button title="Retry" onPress={onRetry} variant="outline" />
      )}
    </View>
  );
}

function mapHeading(code: ApiError['code']): string {
  switch (code) {
    case 'NETWORK':
      return "Can't connect";
    case 'TIMEOUT':
      return 'Request timed out';
    case 'UNAUTHORIZED':
      return 'Please sign in again';
    case 'FORBIDDEN':
      return 'Access denied';
    case 'NOT_FOUND':
      return 'Nothing here';
    case 'SERVER':
      return 'Server hiccup';
    default:
      return 'Something went wrong';
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error[50],
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.md,
    maxWidth: 320,
  },
});
