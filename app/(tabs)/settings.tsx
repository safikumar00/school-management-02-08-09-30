import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '../../src/components/layout/Header';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { User, Bell, Shield, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Moon, Globe, Smartphone } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)/login');
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color={COLORS.gray[600]} />,
          label: 'Profile Settings',
          action: () => router.push('/(tabs)/profile'),
          showChevron: true,
        },
        {
          icon: <Shield size={20} color={COLORS.gray[600]} />,
          label: 'Privacy & Security',
          action: () => console.log('Privacy settings'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} color={COLORS.gray[600]} />,
          label: 'Notifications',
          component: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[300] }}
              thumbColor={notificationsEnabled ? COLORS.primary[500] : COLORS.gray[400]}
            />
          ),
        },
        {
          icon: <Moon size={20} color={COLORS.gray[600]} />,
          label: 'Dark Mode',
          component: (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[300] }}
              thumbColor={darkModeEnabled ? COLORS.primary[500] : COLORS.gray[400]}
            />
          ),
        },
        {
          icon: <Globe size={20} color={COLORS.gray[600]} />,
          label: 'Language',
          subtitle: 'English',
          action: () => console.log('Language settings'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color={COLORS.gray[600]} />,
          label: 'Help & Support',
          action: () => console.log('Help'),
          showChevron: true,
        },
        {
          icon: <Info size={20} color={COLORS.gray[600]} />,
          label: 'About',
          subtitle: 'Version 1.0.0',
          action: () => console.log('About'),
          showChevron: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={item.action}
      style={styles.settingItem}
      disabled={!item.action}
    >
      <View style={styles.settingLeft}>
        {item.icon}
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.component || (item.showChevron && (
          <ChevronRight size={16} color={COLORS.gray[400]} />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content}>
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {user?.department && (
                <Text style={styles.userDepartment}>{user.department}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.deviceIcon}>
              <Smartphone size={20} color={COLORS.primary[500]} />
            </TouchableOpacity>
          </View>
        </Card>

        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderSettingItem(item, itemIndex)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Card style={styles.logoutCard}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={COLORS.error[500]} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Card>
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
    padding: SPACING.md,
  },
  userCard: {
    marginBottom: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
  deviceIcon: {
    padding: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[900],
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginLeft: 52,
  },
  logoutCard: {
    padding: 0,
    borderColor: COLORS.error[200],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.error[600],
    marginLeft: SPACING.sm,
  },
});