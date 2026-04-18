import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Search, Plus } from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { UserListItem } from '../../src/components/widgets/UserListItem';
import { EmptyState } from '../../src/components/common/EmptyState';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { Card } from '../../src/components/common/Card';
import { useApi } from '../../src/hooks/useApi';
import { usersApi, type AppUser } from '../../src/services/api/endpoints/users';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, SPACING } from '../../src/utils/constants';

export default function UsersScreen() {
  const [q, setQ] = useState('');
  const { data, loading, error, refreshing, refresh } = useApi<AppUser[]>(
    () => usersApi.list(),
    [],
    { cacheKey: 'users-all', staleTime: 30_000 },
  );

  const filtered = useMemo(() => {
    const src = data ?? [];
    if (!q.trim()) return src;
    const needle = q.toLowerCase();
    return src.filter(
      (u) =>
        u.name.toLowerCase().includes(needle) ||
        u.email.toLowerCase().includes(needle) ||
        (u.department ?? '').toLowerCase().includes(needle),
    );
  }, [q, data]);

  return (
    <RoleGuard allowedRoles={[ROLES.ORG_ADMIN]}>
      <SafeAreaView style={styles.container} edges={['top']} data-testid="users-screen">
        <Header title="Users" />
        <View style={styles.content}>
          <View style={styles.searchBar}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Search name, email, department…"
                value={q}
                onChangeText={setQ}
                leftIcon={<Search size={16} color={COLORS.gray[500]} />}
              />
            </View>
            <Button
              title="Add"
              onPress={() => {}}
              leftIcon={<Plus size={16} color={COLORS.gray[50]} />}
              size="sm"
            />
          </View>

          {loading && !data ? (
            <SkeletonList count={6} />
          ) : error && !data ? (
            <Card><ErrorState error={error} onRetry={refresh} /></Card>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users size={48} color={COLORS.gray[400]} />}
              title={q ? 'No matches' : 'No users yet'}
              description={q ? 'Try a different search.' : 'Add your first user to get started.'}
            />
          ) : (
            <FlatList
              data={filtered}
              renderItem={({ item }) => (
                <UserListItem user={item as any} onPress={() => {}} onMorePress={() => {}} />
              )}
              keyExtractor={(u) => u.id}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              removeClippedSubviews
            />
          )}
        </View>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1, paddingHorizontal: SPACING.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  list: { paddingBottom: SPACING.xl },
});
