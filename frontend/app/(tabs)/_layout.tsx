import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import {
  Chrome as Home,
  User,
  Bell,
  Settings,
  Users,
  Building,
  DollarSign,
  ChartBar as BarChart3,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Award,
  Utensils,
  Wallet,
} from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRole } from '../../src/hooks/useRole';
import { getTabRoutesForRole } from '../../src/navigation/routeConfig';
import { COLORS, TAB_BAR_HEIGHT } from '../../src/utils/constants';

const iconMap: Record<string, any> = {
  home: Home,
  user: User,
  bell: Bell,
  settings: Settings,
  users: Users,
  building: Building,
  'dollar-sign': DollarSign,
  'bar-chart': BarChart3,
  'clipboard-list': ClipboardList,
  'calendar-check': CalendarCheck,
  'trending-up': TrendingUp,
  award: Award,
  utensils: Utensils,
  wallet: Wallet,
};

export default function TabLayout() {
  const { isAuthenticated, hydrated } = useAuth();
  const { role } = useRole();

  if (!hydrated) return null;
  if (!isAuthenticated || !role) return <Redirect href="/login" />;

  const tabRoutes = getTabRoutesForRole(role);
  const activeNames = new Set(tabRoutes.map((r) => r.path.split('/').pop() || 'index'));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      {tabRoutes.map((route) => {
        const IconComponent = iconMap[route.icon || ''];
        const routeName = route.path.split('/').pop() || 'index';
        return (
          <Tabs.Screen
            key={route.path}
            name={routeName}
            options={{
              title: route.name,
              tabBarIcon: ({ color, size = 20 }) =>
                IconComponent ? <IconComponent size={size} color={color} /> : null,
            }}
          />
        );
      })}
      {/* Hide screens that don't belong to current role */}
      {['role-switch', 'users', 'attendance', 'marks', 'food-court', 'wallet', 'profile', 'notifications', 'settings'].map(
        (n) =>
          !activeNames.has(n) ? (
            <Tabs.Screen key={n} name={n} options={{ href: null }} />
          ) : null,
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: COLORS.gray[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 8 : 24,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    marginBottom: 2,
  },
});
