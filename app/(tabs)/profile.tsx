import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRole } from '../../src/hooks/useRole';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { APP_CONFIG } from '../../src/config/appConfig';
import { Edit, Phone, Mail, Building, Calendar, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { getRoleDisplayName } = useRole();

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)/login');
  };

  const profileData = [
    { icon: <Mail size={16} color={COLORS.gray[600]} />, label: 'Email', value: user?.email },
    { icon: <Phone size={16} color={COLORS.gray[600]} />, label: 'Phone', value: user?.phone || 'Not provided' },
    { icon: <Building size={16} color={COLORS.gray[600]} />, label: 'Department', value: user?.department || 'Not assigned' },
    { icon: <Calendar size={16} color={COLORS.gray[600]} />, label: 'Member Since', value: 'January 2024' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar 
              source={user?.avatar} 
              name={user?.name} 
              size="xl" 
              showBorder 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name}</Text>
              <Badge text={getRoleDisplayName()} variant="primary" />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={20} color={COLORS.primary[500]} />
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {profileData.map((item, index) => (
            <View key={index} style={styles.detailRow}>
              <View style={styles.detailLeft}>
                {item.icon}
                <Text style={styles.detailLabel}>{item.label}</Text>
              </View>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        {user?.role === 'student' && (
          <Card style={styles.academicCard}>
            <Text style={styles.sectionTitle}>Academic Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Student ID</Text>
              <Text style={styles.detailValue}>CS2024001</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Year</Text>
              <Text style={styles.detailValue}>3rd Year</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Semester</Text>
              <Text style={styles.detailValue}>5th Semester</Text>
            </View>
          </Card>
        )}

        {APP_CONFIG.FEATURES.ROLE_SWITCHING && (
          <Card style={styles.devCard}>
            <Text style={styles.sectionTitle}>Developer Options</Text>
            <Button
              title="Switch Role"
              onPress={() => router.push('/(tabs)/role-switch')}
              variant="outline"
              fullWidth
            />
          </Card>
        )}

        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            leftIcon={<LogOut size={16} color={COLORS.error[500]} />}
          />
        </View>
      </ScrollView>
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
  },
  profileCard: {
    margin: SPACING.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  editButton: {
    padding: SPACING.sm,
  },
  detailsCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  academicCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  devCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.warning[50],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
    marginLeft: SPACING.sm,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray[900],
  },
  logoutSection: {
    padding: SPACING.md,
  },
});