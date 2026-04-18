import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { formatters } from '../../utils/formatters';
import { Bell, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
  onMarkAsRead?: () => void;
}

export function NotificationItem({ notification, onPress, onMarkAsRead }: NotificationItemProps) {
  const getIcon = (type: string) => {
    const iconProps = { size: 20, color: getIconColor(type) };
    switch (type) {
      case 'warning': return <AlertTriangle {...iconProps} />;
      case 'success': return <CheckCircle {...iconProps} />;
      case 'error': return <AlertTriangle {...iconProps} />;
      default: return <Info {...iconProps} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return COLORS.warning[500];
      case 'success': return COLORS.success[500];
      case 'error': return COLORS.error[500];
      default: return COLORS.primary[500];
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.container, !notification.isRead && styles.unread]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getIcon(notification.type)}
          </View>
          
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {notification.title}
              </Text>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            
            <Text style={styles.message} numberOfLines={2}>
              {notification.message}
            </Text>
            
            <View style={styles.footer}>
              <Text style={styles.timestamp}>
                {formatters.timeAgo(notification.createdAt)}
              </Text>
              <Badge 
                text={notification.type.toUpperCase()} 
                variant={getBadgeVariant(notification.type)} 
                size="sm" 
              />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  unread: {
    borderColor: COLORS.primary[300],
    backgroundColor: COLORS.primary[25],
  },
  header: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: SPACING.sm,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
    marginLeft: SPACING.xs,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[700],
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
});