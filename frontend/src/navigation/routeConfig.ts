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
  {
    name: 'Profile',
    path: '/(tabs)/profile',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'user',
    showInTabs: true,
  },
  {
    name: 'Notifications',
    path: '/(tabs)/notifications',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'bell',
    showInTabs: true,
  },
  {
    name: 'Settings',
    path: '/(tabs)/settings',
    allowedRoles: [ROLES.ORG_ADMIN, ROLES.HOD, ROLES.STUDENT],
    icon: 'settings',
    showInTabs: true,
  },
  // Org Admin specific
  {
    name: 'Users',
    path: '/(tabs)/users',
    allowedRoles: [ROLES.ORG_ADMIN],
    icon: 'users',
    showInTabs: true,
  },
  {
    name: 'Departments',
    path: '/(tabs)/departments',
    allowedRoles: [ROLES.ORG_ADMIN],
    icon: 'building',
    showInTabs: true,
  },
  {
    name: 'Finance',
    path: '/(tabs)/finance',
    allowedRoles: [ROLES.ORG_ADMIN],
    icon: 'dollar-sign',
    showInTabs: true,
  },
  {
    name: 'Analytics',
    path: '/(tabs)/analytics',
    allowedRoles: [ROLES.ORG_ADMIN],
    icon: 'bar-chart',
    showInTabs: true,
  },
  // HOD specific
  {
    name: 'Department',
    path: '/(tabs)/department',
    allowedRoles: [ROLES.HOD],
    icon: 'building',
    showInTabs: true,
  },
  {
    name: 'Exams',
    path: '/(tabs)/exams',
    allowedRoles: [ROLES.HOD],
    icon: 'clipboard-list',
    showInTabs: true,
  },
  {
    name: 'Attendance',
    path: '/(tabs)/attendance',
    allowedRoles: [ROLES.HOD, ROLES.STUDENT],
    icon: 'calendar-check',
    showInTabs: true,
  },
  {
    name: 'Performance',
    path: '/(tabs)/performance',
    allowedRoles: [ROLES.HOD],
    icon: 'trending-up',
    showInTabs: true,
  },
  // Student specific
  {
    name: 'Marks',
    path: '/(tabs)/marks',
    allowedRoles: [ROLES.STUDENT],
    icon: 'award',
    showInTabs: true,
  },
  {
    name: 'Food Court',
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
];

export function getRoutesForRole(role: UserRole): RouteConfig[] {
  return routes.filter(route => route.allowedRoles.includes(role));
}

export function getTabRoutesForRole(role: UserRole): RouteConfig[] {
  return getRoutesForRole(role).filter(route => route.showInTabs);
}