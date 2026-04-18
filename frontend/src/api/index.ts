/**
 * LEGACY SHIM — delegates to the new /services/api layer.
 * Kept only so screens that still do `import { api } from '../../src/api'`
 * keep working. New code should import from `../../src/services/api`.
 */
import {
  attendanceApi,
  marksApi,
  notificationsApi,
  usersApi,
} from '../services/api';
import type { UserRole } from '../config/appConfig';

export const api = {
  getDashboardStats: (role: UserRole) => usersApi.dashboardStats(role),
  getUsers: () => usersApi.list(),
  getDepartments: () => usersApi.departments(),
  getAttendance: (studentId: string) => attendanceApi.forStudent(studentId),
  getMarks: (studentId: string) => marksApi.forStudent(studentId),
  getNotifications: (role?: UserRole) => notificationsApi.list(role),
};
