import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { 
  Home, 
  User, 
  Bell, 
  Settings, 
  Users, 
  Building, 
  DollarSign, 
  BarChart3,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Award,
  Utensils,
  Wallet
} from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRole } from '../../src/hooks/useRole';
import { getTabRoutesForRole } from '../../src/navigation/routeConfig';
import { COLORS, TAB_BAR_HEIGHT } from '../../src/utils/constants';
import { ROLES } from '../../src/config/appConfig';
import { AuthProvider } from '../src/contexts/AuthContext';
import { RoleProvider } from '../src/contexts/RoleContext'; 

const iconMap = {
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
  const { user, isAuthenticated } = useAuth();
  const { role } = useRole();

  if (!isAuthenticated || !user || !role) {
    return null;
  }

  const tabRoutes = getTabRoutesForRole(role);
  const primaryColor = COLORS.primary[500];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      {tabRoutes.map((route) => {
        const IconComponent = iconMap[route.icon as keyof typeof iconMap];
        const routeName = route.path.split('/').pop() || 'index';
        
        return (
          <SafeAreaProvider>
      <AuthProvider>
        <RoleProvider> {/* Only if needed */}
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
      
      {/* Hidden screens that shouldn't show in tabs */}
      <Tabs.Screen
        name="login"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="role-switch"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
        </RoleProvider>
      </AuthProvider>
    </SafeAreaProvider>
         
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: COLORS.gray[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    marginBottom: 4,
  },
});