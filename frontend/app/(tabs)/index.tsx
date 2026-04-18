import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  Award,
  Wallet as WalletIcon,
  Star,
} from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { Card } from '../../src/components/common/Card';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRole } from '../../src/hooks/useRole';
import { useApi } from '../../src/hooks/useApi';
import { usersApi } from '../../src/services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { ROLES } from '../../src/config/appConfig';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { role, getRoleDisplayName } = useRole();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const {
    data: stats,
    loading,
    error,
    refreshing,
    refresh,
  } = useApi(
    () => (role ? usersApi.dashboardStats<any>(role) : Promise.resolve(null)),
    [role],
    { cacheKey: role ? `dashboard-stats-${role}` : undefined, staleTime: 15_000, enabled: !!role },
  );

  const renderOrgAdmin = () => (
    <>
      <SectionTitle>Organisation overview</SectionTitle>
      <Grid isWide={isWide}>
        <MetricCard
          title="Total students"
          value={stats?.totalStudents?.toLocaleString() || '0'}
          icon={<Users size={20} color={COLORS.primary[500]} />}
          trend={{ value: 5.2, direction: 'up' }}
          color={COLORS.primary[500]}
        />
        <MetricCard
          title="Faculty"
          value={stats?.totalFaculty || '0'}
          icon={<Building size={20} color={COLORS.secondary[500]} />}
          color={COLORS.secondary[500]}
        />
        <MetricCard
          title="Monthly revenue"
          value={`₹${((stats?.monthlyRevenue ?? 0) / 100000).toFixed(1)}L`}
          subtitle="This month"
          icon={<DollarSign size={20} color={COLORS.success[500]} />}
          trend={{ value: 8.1, direction: 'up' }}
          color={COLORS.success[500]}
        />
        <MetricCard
          title="Pending fees"
          value={`₹${((stats?.pendingFees ?? 0) / 100000).toFixed(1)}L`}
          subtitle="To be collected"
          icon={<TrendingUp size={20} color={COLORS.warning[500]} />}
          color={COLORS.warning[500]}
        />
      </Grid>
    </>
  );

  const renderHOD = () => (
    <>
      <SectionTitle>Department overview</SectionTitle>
      <Grid isWide={isWide}>
        <MetricCard
          title="Students"
          value={stats?.departmentStudents || '0'}
          subtitle="In department"
          icon={<Users size={20} color={COLORS.primary[500]} />}
          color={COLORS.primary[500]}
        />
        <MetricCard
          title="Faculty"
          value={stats?.departmentFaculty || '0'}
          subtitle="Active members"
          icon={<Building size={20} color={COLORS.secondary[500]} />}
          color={COLORS.secondary[500]}
        />
        <MetricCard
          title="Avg. attendance"
          value={`${stats?.avgAttendance ?? 0}%`}
          icon={<Calendar size={20} color={COLORS.success[500]} />}
          trend={{ value: 2.3, direction: 'up' }}
          color={COLORS.success[500]}
        />
        <MetricCard
          title="Upcoming exams"
          value={stats?.upcomingExams || '0'}
          subtitle="This month"
          icon={<Award size={20} color={COLORS.accent[500]} />}
          color={COLORS.accent[500]}
        />
      </Grid>
    </>
  );

  const renderStudent = () => (
    <>
      <SectionTitle>Your academic snapshot</SectionTitle>
      <Grid isWide={isWide}>
        <MetricCard
          title="Attendance"
          value={`${stats?.overallAttendance ?? 0}%`}
          icon={<Calendar size={20} color={COLORS.primary[500]} />}
          trend={{
            value: (stats?.overallAttendance ?? 0) >= 85 ? 1.2 : -0.8,
            direction: (stats?.overallAttendance ?? 0) >= 85 ? 'up' : 'down',
          }}
          color={COLORS.primary[500]}
        />
        <MetricCard
          title="GPA"
          value={stats?.currentGPA ?? '0.0'}
          subtitle="Out of 10"
          icon={<Award size={20} color={COLORS.success[500]} />}
          color={COLORS.success[500]}
        />
        <MetricCard
          title="Wallet"
          value={`₹${stats?.walletBalance ?? 0}`}
          icon={<WalletIcon size={20} color={COLORS.accent[500]} />}
          color={COLORS.accent[500]}
        />
        <MetricCard
          title="Reward points"
          value={stats?.rewardPoints ?? '0'}
          subtitle="Available"
          icon={<Star size={20} color={COLORS.warning[500]} />}
          color={COLORS.warning[500]}
        />
      </Grid>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']} data-testid="dashboard-screen">
      <Header title="Dashboard" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>
            Hello, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </Text>
          <Text style={styles.dateText}>
            {getRoleDisplayName()} ·{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {loading && !stats ? (
          <View style={styles.section}>
            <SkeletonList count={3} />
          </View>
        ) : error && !stats ? (
          <Card style={styles.errorCard}>
            <ErrorState error={error} onRetry={refresh} />
          </Card>
        ) : (
          <View style={styles.section}>
            {role === ROLES.ORG_ADMIN && renderOrgAdmin()}
            {role === ROLES.HOD && renderHOD()}
            {role === ROLES.STUDENT && renderStudent()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Grid({ children, isWide }: { children: React.ReactNode; isWide: boolean }) {
  const arr = React.Children.toArray(children);
  return (
    <View style={[styles.grid, isWide && styles.gridWide]}>
      {arr.map((child, i) => (
        <View key={i} style={isWide ? styles.gridItemWide : styles.gridItem}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1 },
  contentInner: { paddingBottom: SPACING.xl },
  welcome: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  dateText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.gray[600] },
  section: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  grid: { gap: SPACING.md, flexDirection: 'row', flexWrap: 'wrap' },
  gridWide: {},
  gridItem: { width: '48%', flexGrow: 1, minWidth: 150 },
  gridItemWide: { width: '23%', flexGrow: 1, minWidth: 200 },
  errorCard: { margin: SPACING.md },
});
