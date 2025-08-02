import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

export function MetricCard({ title, value, subtitle, icon, trend, color = COLORS.primary[500] }: MetricCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {trend && (
            <View style={[styles.trend, { backgroundColor: trend.direction === 'up' ? COLORS.success[50] : COLORS.error[50] }]}>
              <Text style={[styles.trendText, { color: trend.direction === 'up' ? COLORS.success[600] : COLORS.error[600] }]}>
                {trend.direction === 'up' ? '+' : ''}{trend.value}%
              </Text>
            </View>
          )}
        </View>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            {icon}
          </View>
        )}
      </View>
      
      <Text style={[styles.value, { color }]}>{value}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trend: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});