import { useAuth } from '../contexts/AuthContext';
import { PermissionService } from '../services/permissionService';
import type { UserRole, Permission } from '../config/appConfig';

export function useRole() {
  const { user } = useAuth();

  return {
    role: user?.role,
    hasPermission: (permission: Permission) => {
      return user?.role ? PermissionService.hasPermission(user.role, permission) : false;
    },
    canAccessRoute: (allowedRoles: UserRole[]) => {
      return user?.role ? PermissionService.canAccessRoute(user.role, allowedRoles) : false;
    },
    getRoleDisplayName: () => {
      return user?.role ? PermissionService.getRoleDisplayName(user.role) : 'Unknown';
    },
    getRoleColor: () => {
      return user?.role ? PermissionService.getRoleColor(user.role) : '#6B7280';
    },
  };
}