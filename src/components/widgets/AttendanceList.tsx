import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../common/Card';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { formatters } from '../../utils/formatters';

interface AttendanceItem {
  subject: string;
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
  lastUpdated: string;
}

interface AttendanceListProps {
  data: AttendanceItem[];
  loading?: boolean;
}

export function AttendanceList({ data, loading = false }: AttendanceListProps) {
  const renderAttendanceItem = ({ item }: { item: AttendanceItem }) => (
    <Card style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.subject}>{item.subject}</Text>
        <View style={[
          styles.percentageBadge,
          { backgroundColor: formatters.attendanceColor(item.percentage) + '20' }
        ]}>
          <Text style={[
            styles.percentage,
            { color: formatters.attendanceColor(item.percentage) }
          ]}>
            {item.percentage}%
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.classCount}>
          {item.attendedClasses}/{item.totalClasses} classes attended
        </Text>
        <Text style={styles.lastUpdated}>
          Updated {formatters.timeAgo(item.lastUpdated)}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${item.percentage}%`,
              backgroundColor: formatters.attendanceColor(item.percentage)
            }
          ]} 
        />
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} style={styles.skeleton}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '70%', marginTop: 8 }]} />
          </Card>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderAttendanceItem}
      keyExtractor={(item) => item.subject}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: SPACING.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subject: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    flex: 1,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  classCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
  },
  lastUpdated: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  skeleton: {
    marginBottom: SPACING.sm,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
  },
});