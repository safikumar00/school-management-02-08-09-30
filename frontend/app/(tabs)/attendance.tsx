import React from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, Clock } from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { AttendanceList } from '../../src/components/widgets/AttendanceList';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorState } from '../../src/components/common/ErrorState';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/contexts/AuthContext';
import { useApi } from '../../src/hooks/useApi';
import { attendanceApi } from '../../src/services/api';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const {
    data: attendance,
    loading,
    error,
    refreshing,
    refresh,
  } = useApi(
    () => (user?.id ? attendanceApi.forStudent(user.id) : Promise.resolve([])),
    [user?.id],
    { cacheKey: user?.id ? `att-${user.id}` : undefined, staleTime: 20_000, enabled: !!user?.id },
  );

  const list = attendance ?? [];
  const overall = list.length
    ? Math.round(
        (list.reduce((s, i) => s + i.attendedClasses, 0) /
          list.reduce((s, i) => s + i.totalClasses, 0)) *
          100,
      )
    : 0;

  const statusColor =
    overall >= 85
      ? COLORS.success[500]
      : overall >= 75
      ? COLORS.warning[500]
      : COLORS.error[500];
  const statusLabel = overall >= 85 ? 'Excellent' : overall >= 75 ? 'Good' : 'Needs work';

  return (
    <RoleGuard allowedRoles={[ROLES.HOD, ROLES.STUDENT]}>
      <SafeAreaView style={styles.container} edges={['top']} data-testid="attendance-screen">
        <Header title="Attendance" />
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {user?.role === ROLES.STUDENT && (
            <View style={styles.overview}>
              <Text style={styles.sectionTitle}>Overall</Text>
              <View style={styles.metrics}>
                <View style={styles.metricCell}>
                  <MetricCard
                    title="Overall"
                    value={`${overall}%`}
                    subtitle={statusLabel}
                    icon={<Calendar size={20} color={statusColor} />}
                    color={statusColor}
                  />
                </View>
                <View style={styles.metricCell}>
                  <MetricCard
                    title="Subjects"
                    value={list.length}
                    subtitle="tracked"
                    icon={<TrendingUp size={20} color={COLORS.primary[500]} />}
                    color={COLORS.primary[500]}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Subject-wise attendance</Text>
            {error && !list.length ? (
              <Card><ErrorState error={error} onRetry={refresh} /></Card>
            ) : list.length === 0 && !loading ? (
              <EmptyState
                icon={<Clock size={48} color={COLORS.gray[400]} />}
                title="No attendance data"
                description="Attendance records will appear here once classes begin."
              />
            ) : (
              <AttendanceList data={list} loading={loading} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1 },
  overview: { padding: SPACING.md },
  listSection: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  metrics: { flexDirection: 'row', gap: SPACING.md, flexWrap: 'wrap' },
  metricCell: { flex: 1, minWidth: 150 },
});
