import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CheckCheck } from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { NotificationItem } from '../../src/components/widgets/NotificationItem';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/contexts/AuthContext';
import { useApi } from '../../src/hooks/useApi';
import { notificationsApi, type Notification } from '../../src/services/api/endpoints/notifications';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/utils/constants';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { data, loading, error, refreshing, refresh } = useApi<Notification[]>(
    () => notificationsApi.list(user?.role),
    [user?.role],
    { cacheKey: `notifs-${user?.role ?? 'all'}`, staleTime: 15_000 },
  );

  const [list, setList] = React.useState<Notification[]>([]);
  React.useEffect(() => {
    if (data) setList(data);
  }, [data]);

  const unread = list.filter((n) => !n.isRead).length;

  const handleItem = async (n: Notification) => {
    if (!n.isRead) {
      setList((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      try {
        await notificationsApi.markRead(n.id);
      } catch {
        // optimistic; ignore
      }
    }
  };

  const markAll = async () => {
    setList((prev) => prev.map((x) => ({ ...x, isRead: true })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      // optimistic
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} data-testid="notifications-screen">
      <Header title="Notifications" />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.topText}>
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </Text>
          {unread > 0 && (
            <TouchableOpacity onPress={markAll} style={styles.markAllBtn} data-testid="mark-all-read">
              <CheckCheck size={14} color={COLORS.primary[600]} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && !list.length ? (
          <SkeletonList count={5} />
        ) : error && !list.length ? (
          <Card><ErrorState error={error} onRetry={refresh} /></Card>
        ) : list.length === 0 ? (
          <EmptyState
            icon={<Bell size={48} color={COLORS.gray[400]} />}
            title="No notifications"
            description="We'll ping you when there's something new."
          />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(n) => n.id}
            renderItem={({ item }) => (
              <NotificationItem
                notification={item}
                onPress={() => handleItem(item)}
                onMarkAsRead={() => handleItem(item)}
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            removeClippedSubviews
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1, paddingHorizontal: SPACING.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  topText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.gray[600], fontWeight: '600' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { color: COLORS.primary[600], fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600' },
  list: { paddingBottom: SPACING.xl },
});
