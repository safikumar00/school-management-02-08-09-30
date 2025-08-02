import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { formatters } from '../../utils/formatters';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface ExamScheduleCardProps {
  exam: Exam;
  onPress?: () => void;
}

export function ExamScheduleCard({ exam, onPress }: ExamScheduleCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'warning';
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'final': return COLORS.error[500];
      case 'midterm': return COLORS.warning[500];
      case 'quiz': return COLORS.primary[500];
      case 'assignment': return COLORS.secondary[500];
      default: return COLORS.gray[500];
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.subject}>{exam.subject}</Text>
          <View style={styles.badges}>
            <Badge 
              text={exam.type.toUpperCase()} 
              variant="gray" 
              size="sm" 
            />
            <Badge 
              text={exam.status.toUpperCase()} 
              variant={getStatusVariant(exam.status)} 
              size="sm" 
            />
          </View>
        </View>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(exam.type) }]} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={COLORS.gray[600]} />
          <Text style={styles.detailText}>
            {formatters.date(exam.date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={COLORS.gray[600]} />
          <Text style={styles.detailText}>
            {exam.time} ({exam.duration})
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={COLORS.gray[600]} />
          <Text style={styles.detailText}>{exam.room}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
  },
  subject: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  typeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginLeft: SPACING.sm,
  },
  details: {
    gap: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[700],
    marginLeft: SPACING.sm,
  },
});