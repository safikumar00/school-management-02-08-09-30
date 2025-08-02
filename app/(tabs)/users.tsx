import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { UserListItem } from '../../src/components/widgets/UserListItem';
import { EmptyState } from '../../src/components/common/EmptyState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { api } from '../../src/api';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, SPACING } from '../../src/utils/constants';
import { Users, Search, Plus } from 'lucide-react-native';

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleUserPress = (user: any) => {
    console.log('User pressed:', user.id);
  };

  const handleAddUser = () => {
    console.log('Add new user');
  };

  const renderUser = ({ item }: { item: any }) => (
    <UserListItem
      user={item}
      onPress={() => handleUserPress(item)}
      onMorePress={() => console.log('More options for:', item.id)}
    />
  );

  return (
    <RoleGuard allowedRoles={[ROLES.ORG_ADMIN]}>
      <SafeAreaView style={styles.container}>
        <Header title="Users Management" />
        
        <View style={styles.content}>
          <View style={styles.searchSection}>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Search size={16} color={COLORS.gray[500]} />}
            />
            
            <Button
              title="Add User"
              onPress={handleAddUser}
              leftIcon={<Plus size={16} color={COLORS.gray[50]} />}
              size="sm"
            />
          </View>

          {loading ? (
            <SkeletonList count={6} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={<Users size={48} color={COLORS.gray[400]} />}
              title={searchQuery ? "No users found" : "No users yet"}
              description={searchQuery ? 
                "Try adjusting your search criteria." : 
                "Add your first user to get started."
              }
              actionLabel={!searchQuery ? "Add User" : undefined}
              onAction={!searchQuery ? handleAddUser : undefined}
            />
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
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
    paddingHorizontal: SPACING.md,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});