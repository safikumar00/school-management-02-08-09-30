import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, BookOpen } from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { useAuth } from '../../src/contexts/AuthContext';
import { useApi } from '../../src/hooks/useApi';
import { marksApi, type MarkRecord } from '../../src/services/api/endpoints/marks';
import { formatters } from '../../src/utils/formatters';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';

export default function MarksScreen() {
  const { user } = useAuth();
  const { data, loading, error, refreshing, refresh } = useApi<MarkRecord[]>(
    () => (user?.id ? marksApi.forStudent(user.id) : Promise.resolve([])),
    [user?.id],
    { cacheKey: user?.id ? `marks-${user.id}` : undefined, staleTime: 20_000, enabled: !!user?.id },
  );

  const marks = data ?? [];

  const gpa = marks.length
    ? (
        (marks.reduce((s, m) => s + m.marksObtained, 0) /
          marks.reduce((s, m) => s + m.totalMarks, 0)) *
        10
      ).toFixed(1)
    : '0.0';

  const gradeVariant = (g: string): 'success' | 'primary' | 'warning' | 'error' => {
    if (g === 'A+' || g === 'A') return 'success';
    if (g.startsWith('B')) return 'primary';
    if (g === 'C') return 'warning';
    return 'error';
  };

  const renderItem = ({ item }: { item: MarkRecord }) => (
    <Card style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.examType}>{item.examType}</Text>
        </View>
        <Badge text={item.grade} variant={gradeVariant(item.grade)} />
      </View>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>
          {item.marksObtained}/{item.totalMarks}
        </Text>
        <Text style={styles.pct}>
          {formatters.percentage((item.marksObtained / item.totalMarks) * 100)}
        </Text>
      </View>
      <View style={styles.bar}>
        <View
          style={[
            styles.barFill,
            {
              width: `${(item.marksObtained / item.totalMarks) * 100}%`,
              backgroundColor:
                item.marksObtained / item.totalMarks >= 0.8
                  ? COLORS.success[500]
                  : item.marksObtained / item.totalMarks >= 0.6
                  ? COLORS.warning[500]
                  : COLORS.error[500],
            },
          ]}
        />
      </View>
      <Text style={styles.date}>{formatters.date(item.date)}</Text>
    </Card>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container} edges={['top']} data-testid="marks-screen">
        <Header title="Marks & Grades" />
        <View style={styles.content}>
          <View style={styles.overview}>
            <Text style={styles.sectionTitle}>Academic performance</Text>
            <View style={styles.metrics}>
              <View style={styles.metricCell}>
                <MetricCard
                  title="Current GPA"
                  value={gpa}
                  subtitle="Out of 10"
                  icon={<Award size={20} color={COLORS.primary[500]} />}
                  color={COLORS.primary[500]}
                />
              </View>
              <View style={styles.metricCell}>
                <MetricCard
                  title="Exams taken"
                  value={marks.length}
                  subtitle="This semester"
                  icon={<BookOpen size={20} color={COLORS.secondary[500]} />}
                  color={COLORS.secondary[500]}
                />
              </View>
            </View>
          </View>

          {loading ? (
            <View style={{ paddingHorizontal: SPACING.md }}>
              <SkeletonList count={4} />
            </View>
          ) : error && !marks.length ? (
            <Card style={{ margin: SPACING.md }}>
              <ErrorState error={error} onRetry={refresh} />
            </Card>
          ) : marks.length === 0 ? (
            <EmptyState
              icon={<Award size={48} color={COLORS.gray[400]} />}
              title="No marks yet"
              description="Your results will appear here once published."
            />
          ) : (
            <FlatList
              data={marks}
              renderItem={renderItem}
              keyExtractor={(m) => m.id}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews
              initialNumToRender={8}
            />
          )}
        </View>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1 },
  overview: { padding: SPACING.md },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: '700', color: COLORS.gray[900], marginBottom: SPACING.md },
  metrics: { flexDirection: 'row', gap: SPACING.md, flexWrap: 'wrap', marginBottom: SPACING.sm },
  metricCell: { flex: 1, minWidth: 150 },
  list: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  item: { marginBottom: SPACING.sm, gap: SPACING.sm },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subject: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700', color: COLORS.gray[900] },
  examType: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.gray[600], marginTop: 2 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  score: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: '700', color: COLORS.gray[900] },
  pct: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600', color: COLORS.primary[600] },
  bar: { height: 6, backgroundColor: COLORS.gray[200], borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  date: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[500] },
});
