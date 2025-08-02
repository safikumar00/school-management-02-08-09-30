import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { AttendanceList } from '../../src/components/widgets/AttendanceList';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/api';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { Calendar, TrendingUp, Clock } from 'lucide-react-native';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAttendance = async () => {
    try {
      if (user?.id) {
        const data = await api.getAttendance(user.id);
        setAttendance(data);
      }
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadAttendance();
    }
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance();
  };

  const calculateOverallAttendance = () => {
    if (attendance.length === 0) return 0;
    const total = attendance.reduce((sum, item) => sum + item.totalClasses, 0);
    const attended = attendance.reduce((sum, item) => sum + item.attendedClasses, 0);
    return total > 0 ? Math.round((attended / total) * 100) : 0;
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { status: 'Excellent', color: COLORS.success[500] };
    if (percentage >= 75) return { status: 'Good', color: COLORS.warning[500] };
    return { status: 'Needs Improvement', color: COLORS.error[500] };
  };

  const overallPercentage = calculateOverallAttendance();
  const attendanceStatus = getAttendanceStatus(overallPercentage);

  return (
    <RoleGuard allowedRoles={[ROLES.HOD, ROLES.STUDENT]}>
      <SafeAreaView style={styles.container}>
        <Header title="Attendance" />
        
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {user?.role === ROLES.STUDENT && (
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Overall Attendance</Text>
              <View style={styles.metricsGrid}>
                <MetricCard
                  title="Overall"
                  value={`${overallPercentage}%`}
                  subtitle={attendanceStatus.status}
                  icon={<Calendar size={20} color={attendanceStatus.color} />}
                  color={attendanceStatus.color}
                />
                <MetricCard
                  title="This Month"
                  value="94%"
                  subtitle="Above average"
                  icon={<TrendingUp size={20} color={COLORS.success[500]} />}
                  trend={{ value: 2.1, direction: 'up' }}
                  color={COLORS.success[500]}
                />
              </View>
            </View>
          )}

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              {user?.role === ROLES.STUDENT ? 'Subject-wise Attendance' : 'Department Attendance'}
            </Text>
            
            {attendance.length === 0 && !loading ? (
              <EmptyState
                icon={<Clock size={48} color={COLORS.gray[400]} />}
                title="No attendance data"
                description="Attendance records will appear here once classes begin."
              />
            ) : (
              <AttendanceList data={attendance} loading={loading} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  content: {
    flex: 1,
  },
  overviewSection: {
    padding: SPACING.md,
  },
  listSection: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});