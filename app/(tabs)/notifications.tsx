import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { NotificationItem } from '../../src/components/widgets/NotificationItem';
import { EmptyState } from '../../src/components/common/EmptyState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/api';
import { COLORS, SPACING } from '../../src/utils/constants';
import { Bell } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications(user?.role);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.role]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = (notification: any) => {
    // Mark as read and navigate to detail
    console.log('Notification pressed:', notification.id);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const renderNotification = ({ item }: { item: any }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onMarkAsRead={() => handleMarkAsRead(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Notifications" />
        <View style={styles.content}>
          <SkeletonList count={5} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" />
      
      <View style={styles.content}>
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={48} color={COLORS.gray[400]} />}
            title="No notifications"
            description="You're all caught up! New notifications will appear here."
          />
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
    paddingHorizontal: SPACING.md,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
});