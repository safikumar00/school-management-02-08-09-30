import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/api';
import { formatters } from '../../src/utils/formatters';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { Award, TrendingUp, BookOpen } from 'lucide-react-native';

export default function MarksScreen() {
  const { user } = useAuth();
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMarks = async () => {
    try {
      if (user?.id) {
        const data = await api.getMarks(user.id);
        setMarks(data);
      }
    } catch (error) {
      console.error('Failed to load marks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadMarks();
    }
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMarks();
  };

  const calculateGPA = () => {
    if (marks.length === 0) return 0;
    const totalMarks = marks.reduce((sum, item) => sum + item.marksObtained, 0);
    const totalPossible = marks.reduce((sum, item) => sum + item.totalMarks, 0);
    return totalPossible > 0 ? ((totalMarks / totalPossible) * 10).toFixed(1) : '0.0';
  };

  const getGradeVariant = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'primary';
    if (grade === 'C') return 'warning';
    return 'error';
  };

  const renderMarkItem = ({ item }: { item: any }) => (
    <Card style={styles.markItem}>
      <View style={styles.markHeader}>
        <View style={styles.markInfo}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.examType}>{item.examType}</Text>
        </View>
        <Badge 
          text={item.grade} 
          variant={getGradeVariant(item.grade)} 
        />
      </View>
      
      <View style={styles.markDetails}>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>
            {item.marksObtained}/{item.totalMarks}
          </Text>
          <Text style={styles.percentage}>
            {formatters.percentage((item.marksObtained / item.totalMarks) * 100)}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${(item.marksObtained / item.totalMarks) * 100}%`,
                backgroundColor: item.marksObtained / item.totalMarks >= 0.8 ? 
                  COLORS.success[500] : 
                  item.marksObtained / item.totalMarks >= 0.6 ? 
                    COLORS.warning[500] : 
                    COLORS.error[500]
              }
            ]} 
          />
        </View>
        
        <Text style={styles.date}>
          {formatters.date(item.date)}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Marks & Grades" />
        <View style={styles.content}>
          <SkeletonList count={4} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container}>
        <Header title="Marks & Grades" />
        
        <View style={styles.content}>
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Academic Performance</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Current GPA"
                value={calculateGPA()}
                subtitle="Out of 10"
                icon={<Award size={20} color={COLORS.primary[500]} />}
                color={COLORS.primary[500]}
              />
              <MetricCard
                title="Exams Taken"
                value={marks.length}
                subtitle="This semester"
                icon={<BookOpen size={20} color={COLORS.secondary[500]} />}
                color={COLORS.secondary[500]}
              />
            </View>
          </View>

          {marks.length === 0 ? (
            <EmptyState
              icon={<Award size={48} color={COLORS.gray[400]} />}
              title="No marks available"
              description="Your exam results will appear here once they're published."
            />
          ) : (
            <FlatList
              data={marks}
              renderItem={renderMarkItem}
              keyExtractor={(item, index) => `${item.subject}-${index}`}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
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
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  markItem: {
    marginBottom: SPACING.sm,
  },
  markHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  markInfo: {
    flex: 1,
  },
  subject: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  examType: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
  },
  markDetails: {
    gap: SPACING.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
  },
  percentage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary[600],
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
});