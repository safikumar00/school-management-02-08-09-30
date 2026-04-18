import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Bell, Search } from 'lucide-react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../hooks/useRole';
import { COLORS, TYPOGRAPHY, SPACING, HEADER_HEIGHT } from '../../utils/constants';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
}

export function Header({ 
  title, 
  showBack = false, 
  onMenuPress, 
  onNotificationPress,
  onSearchPress 
}: HeaderProps) {
  const { user } = useAuth();
  const { getRoleDisplayName, getRoleColor } = useRole();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Menu size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Avatar 
              source={user?.avatar} 
              name={user?.name} 
              size="sm" 
            />
            <View style={styles.userDetails}>
              {title ? (
                <Text style={styles.title}>{title}</Text>
              ) : (
                <>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Badge 
                    text={getRoleDisplayName()} 
                    variant="primary" 
                    size="sm"
                  />
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.right}>
          {onSearchPress && (
            <TouchableOpacity onPress={onSearchPress} style={styles.actionButton}>
              <Search size={20} color={COLORS.gray[600]} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={onNotificationPress} style={styles.actionButton}>
            <Bell size={20} color={COLORS.gray[600]} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error[500],
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.gray[50],
  },
});