import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import { PermissionService } from '../../services/permissionService';
import { Phone, Mail, MoveVertical as MoreVertical } from 'lucide-react-native';
import type { UserRole } from '../../config/appConfig';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
}

interface UserListItemProps {
  user: User;
  onPress?: () => void;
  onMorePress?: () => void;
  showActions?: boolean;
}

export function UserListItem({ user, onPress, onMorePress, showActions = true }: UserListItemProps) {
  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case 'org_admin': return 'primary';
      case 'hod': return 'secondary';
      case 'student': return 'warning';
      default: return 'gray';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Avatar 
            source={user.avatar} 
            name={user.name} 
            size="md" 
          />
          
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
              {!user.isActive && (
                <View style={styles.inactiveIndicator} />
              )}
            </View>
            
            <Badge 
              text={PermissionService.getRoleDisplayName(user.role)} 
              variant={getRoleVariant(user.role)} 
              size="sm" 
            />
            
            {user.department && (
              <Text style={styles.department} numberOfLines={1}>
                {user.department}
              </Text>
            )}
            
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Mail size={12} color={COLORS.gray[500]} />
                <Text style={styles.contactText} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
              
              {user.phone && (
                <View style={styles.contactRow}>
                  <Phone size={12} color={COLORS.gray[500]} />
                  <Text style={styles.contactText}>
                    {user.phone}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {showActions && (
            <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
              <MoreVertical size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    flex: 1,
  },
  inactiveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error[500],
    marginLeft: SPACING.xs,
  },
  department: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  contactInfo: {
    marginTop: SPACING.xs,
    gap: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
    marginLeft: 4,
    flex: 1,
  },
  moreButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});