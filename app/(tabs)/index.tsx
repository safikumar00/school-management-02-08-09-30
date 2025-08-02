import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRole } from '../../src/hooks/useRole';
import { api } from '../../src/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { ROLES } from '../../src/config/appConfig';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Award,
  Wallet,
  Star
} from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { role } = useRole();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      if (role) {
        const dashboardStats = await api.getDashboardStats(role);
        setStats(dashboardStats);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (role) {
      loadDashboardData();
    }
  }, [role]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const renderOrgAdminDashboard = () => (
    <>
      <Text style={styles.sectionTitle}>Organization Overview</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Total Students"
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
      </View>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Monthly Revenue"
          value={`₹${(stats?.monthlyRevenue / 100000)?.toFixed(1) || '0'}L`}
          subtitle="This month"
          icon={<DollarSign size={20} color={COLORS.success[500]} />}
          trend={{ value: 8.1, direction: 'up' }}
          color={COLORS.success[500]}
        />
        <MetricCard
          title="Pending Fees"
          value={`₹${(stats?.pendingFees / 100000)?.toFixed(1) || '0'}L`}
          subtitle="To be collected"
          icon={<TrendingUp size={20} color={COLORS.warning[500]} />}
          color={COLORS.warning[500]}
        />
      </View>
    </>
  );

  const renderHODDashboard = () => (
    <>
      <Text style={styles.sectionTitle}>Department Overview</Text>
      <View style={styles.metricsGrid}>
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
      </View>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Avg Attendance"
          value={`${stats?.avgAttendance || 0}%`}
          icon={<Calendar size={20} color={COLORS.success[500]} />}
          trend={{ value: 2.3, direction: 'up' }}
          color={COLORS.success[500]}
        />
        <MetricCard
          title="Upcoming Exams"
          value={stats?.upcomingExams || '0'}
          subtitle="This month"
          icon={<Award size={20} color={COLORS.accent[500]} />}
          color={COLORS.accent[500]}
        />
      </View>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <Text style={styles.sectionTitle}>Your Academic Progress</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Attendance"
          value={`${stats?.overallAttendance || 0}%`}
          icon={<Calendar size={20} color={COLORS.primary[500]} />}
          trend={{ value: stats?.overallAttendance >= 85 ? 1.2 : -0.8, direction: stats?.overallAttendance >= 85 ? 'up' : 'down' }}
          color={COLORS.primary[500]}
        />
        <MetricCard
          title="Current GPA"
          value={stats?.currentGPA || '0.0'}
          icon={<Award size={20} color={COLORS.success[500]} />}
          color={COLORS.success[500]}
        />
      </View>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Wallet Balance"
          value={`₹${stats?.walletBalance || 0}`}
          icon={<Wallet size={20} color={COLORS.accent[500]} />}
          color={COLORS.accent[500]}
        />
        <MetricCard
          title="Reward Points"
          value={stats?.rewardPoints || '0'}
          subtitle="Available"
          icon={<Star size={20} color={COLORS.warning[500]} />}
          color={COLORS.warning[500]}
        />
      </View>
    </>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <Card>
        <Text style={styles.placeholder}>
          Quick action buttons will be added here based on user role and permissions.
        </Text>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.name?.split(' ')[0]}!
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        <View style={styles.section}>
          {role === ROLES.ORG_ADMIN && renderOrgAdminDashboard()}
          {role === ROLES.HOD && renderHODDashboard()}
          {role === ROLES.STUDENT && renderStudentDashboard()}
        </View>

        {renderQuickActions()}
      </ScrollView>
    </SafeAreaView>
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
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray[600],
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
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray[600],
  },
  placeholder: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});