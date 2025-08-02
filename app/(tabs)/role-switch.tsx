import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/contexts/AuthContext';
import { PermissionService } from '../../src/services/permissionService';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import type { UserRole } from '../../src/config/appConfig';

export default function RoleSwitchScreen() {
  const { user, switchRole } = useAuth();

  const handleRoleSwitch = async (role: UserRole) => {
    try {
      await switchRole(role);
      Alert.alert('Role Switched', `You are now logged in as ${PermissionService.getRoleDisplayName(role)}`);
      router.replace('/(tabs)/');
    } catch (error) {
      Alert.alert('Error', 'Failed to switch role');
    }
  };

  const roleOptions = [
    {
      role: ROLES.ORG_ADMIN,
      title: 'Organization Administrator',
      description: 'Full access to all features and management capabilities',
      color: COLORS.primary[500],
    },
    {
      role: ROLES.HOD,
      title: 'Head of Department',
      description: 'Department management, staff oversight, and academic planning',
      color: COLORS.secondary[500],
    },
    {
      role: ROLES.STUDENT,
      title: 'Student',
      description: 'Access to academic records, attendance, and student services',
      color: COLORS.accent[500],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Developer: Switch Role" />
      
      <View style={styles.content}>
        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Development Mode</Text>
          <Text style={styles.warningText}>
            This screen allows switching between user roles for testing purposes. 
            This feature is only available in development mode.
          </Text>
        </Card>

        <Text style={styles.currentRole}>
          Current Role: {PermissionService.getRoleDisplayName(user?.role || ROLES.STUDENT)}
        </Text>

        <View style={styles.roleList}>
          {roleOptions.map((option) => (
            <Card key={option.role} style={styles.roleCard}>
              <View style={styles.roleHeader}>
                <View style={[styles.roleIndicator, { backgroundColor: option.color }]} />
                <Text style={styles.roleTitle}>{option.title}</Text>
              </View>
              <Text style={styles.roleDescription}>{option.description}</Text>
              <Button
                title={`Switch to ${option.title}`}
                onPress={() => handleRoleSwitch(option.role)}
                variant={user?.role === option.role ? 'primary' : 'outline'}
                disabled={user?.role === option.role}
                fullWidth
              />
            </Card>
          ))}
        </View>
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
    padding: SPACING.md,
  },
  warningCard: {
    backgroundColor: COLORS.warning[50],
    borderColor: COLORS.warning[200],
    marginBottom: SPACING.md,
  },
  warningTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.warning[800],
    marginBottom: SPACING.xs,
  },
  warningText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warning[700],
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
  },
  currentRole: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  roleList: {
    gap: SPACING.md,
  },
  roleCard: {
    gap: SPACING.sm,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  roleTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
  },
  roleDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
  },
});