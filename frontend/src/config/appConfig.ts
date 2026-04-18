export const APP_CONFIG = {
  API_BASE_URL: 'https://api.schoolmgmt.example.com',
  USE_MOCK: true, // Switch to false when real API is ready
  APP_NAME: 'EduFlow',
  VERSION: '1.0.0',
  FEATURES: {
    NOTIFICATIONS: true,
    ROLE_SWITCHING: true, // For development
    OFFLINE_MODE: false,
  },
};

export const ROLES = {
  ORG_ADMIN: 'org_admin',
  HOD: 'hod',
  STUDENT: 'student',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  VIEW_DEPARTMENTS: 'view_departments',
  MANAGE_DEPARTMENTS: 'manage_departments',
  VIEW_FINANCE: 'view_finance',
  MANAGE_FINANCE: 'manage_finance',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_ATTENDANCE: 'view_attendance',
  MANAGE_ATTENDANCE: 'manage_attendance',
  VIEW_EXAMS: 'view_exams',
  MANAGE_EXAMS: 'manage_exams',
  VIEW_MARKS: 'view_marks',
  MANAGE_MARKS: 'manage_marks',
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.ORG_ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_DEPARTMENTS,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.MANAGE_FINANCE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
  [ROLES.HOD]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_DEPARTMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.MANAGE_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.MANAGE_MARKS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],
};