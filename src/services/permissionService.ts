import { ROLE_PERMISSIONS, ROLES } from '../config/appConfig';
import type { UserRole, Permission } from '../config/appConfig';

export class PermissionService {
  static hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
  }

  static canAccessRoute(role: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(role);
  }

  static getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case ROLES.ORG_ADMIN:
        return 'Administrator';
      case ROLES.HOD:
        return 'Head of Department';
      case ROLES.STUDENT:
        return 'Student';
      default:
        return 'Unknown';
    }
  }

  static getRoleColor(role: UserRole): string {
    switch (role) {
      case ROLES.ORG_ADMIN:
        return '#3B82F6'; // blue
      case ROLES.HOD:
        return '#10B981'; // green
      case ROLES.STUDENT:
        return '#F97316'; // orange
      default:
        return '#6B7280'; // gray
    }
  }

  static getNavigationOptions(role: UserRole) {
    const baseOptions = [
      { name: 'Dashboard', route: '/(tabs)/', icon: 'home' },
      { name: 'Profile', route: '/(tabs)/profile', icon: 'user' },
      { name: 'Notifications', route: '/(tabs)/notifications', icon: 'bell' },
      { name: 'Settings', route: '/(tabs)/settings', icon: 'settings' },
    ];

    const roleSpecificOptions = {
      [ROLES.ORG_ADMIN]: [
        { name: 'Users', route: '/(tabs)/users', icon: 'users' },
        { name: 'Departments', route: '/(tabs)/departments', icon: 'building' },
        { name: 'Finance', route: '/(tabs)/finance', icon: 'dollar-sign' },
        { name: 'Analytics', route: '/(tabs)/analytics', icon: 'bar-chart' },
      ],
      [ROLES.HOD]: [
        { name: 'Department', route: '/(tabs)/department', icon: 'building' },
        { name: 'Exams', route: '/(tabs)/exams', icon: 'clipboard-list' },
        { name: 'Attendance', route: '/(tabs)/attendance', icon: 'calendar-check' },
        { name: 'Performance', route: '/(tabs)/performance', icon: 'trending-up' },
      ],
      [ROLES.STUDENT]: [
        { name: 'Attendance', route: '/(tabs)/attendance', icon: 'calendar-check' },
        { name: 'Marks', route: '/(tabs)/marks', icon: 'award' },
        { name: 'Food Court', route: '/(tabs)/food-court', icon: 'utensils' },
        { name: 'Wallet', route: '/(tabs)/wallet', icon: 'wallet' },
      ],
    };

    return [...baseOptions, ...roleSpecificOptions[role]];
  }
}