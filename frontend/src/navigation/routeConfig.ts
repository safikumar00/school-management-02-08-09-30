import { ROLES } from '../config/appConfig';
import type { UserRole } from '../config/appConfig';

export interface RouteConfig {
  name: string;
  path: string;
  allowedRoles: UserRole[];
  icon?: string;
  showInTabs?: boolean;
  showInDrawer?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/(tabs)/',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'home',
    showInTabs: true,
  },
  // Admin-only
  {
    name: 'Users',
    path: '/(tabs)/users',
    allowedRoles: [ROLES.ORG_ADMIN],
    icon: 'users',
    showInTabs: true,
  },
  // Student + HOD
  {
    name: 'Attendance',
    path: '/(tabs)/attendance',
    allowedRoles: [ROLES.HOD, ROLES.STUDENT],
    icon: 'calendar-check',
    showInTabs: true,
  },
  // Student-only
  {
    name: 'Marks',
    path: '/(tabs)/marks',
    allowedRoles: [ROLES.STUDENT],
    icon: 'award',
    showInTabs: true,
  },
  {
    name: 'Food',
    path: '/(tabs)/food-court',
    allowedRoles: [ROLES.STUDENT],
    icon: 'utensils',
    showInTabs: true,
  },
  {
    name: 'Wallet',
    path: '/(tabs)/wallet',
    allowedRoles: [ROLES.STUDENT],
    icon: 'wallet',
    showInTabs: true,
  },
  // All roles
  {
    name: 'Alerts',
    path: '/(tabs)/notifications',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'bell',
    showInTabs: true,
  },
  {
    name: 'Profile',
    path: '/(tabs)/profile',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'user',
    showInTabs: true,
  },
  {
    name: 'Settings',
    path: '/(tabs)/settings',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'settings',
    showInTabs: true,
  },
];

export function getRoutesForRole(role: UserRole): RouteConfig[] {
  return routes.filter((route) => route.allowedRoles.includes(role));
}

export function getTabRoutesForRole(role: UserRole): RouteConfig[] {
  return getRoutesForRole(role).filter((route) => route.showInTabs);
}
