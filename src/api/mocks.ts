import { ROLES } from '../config/appConfig';
import type { UserRole } from '../config/appConfig';

// Mock user data
export const mockUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@school.com',
    role: ROLES.HOD,
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43210',
    isActive: true,
  },
  {
    id: '2',
    name: 'Alex Johnson',
    email: 'alex.johnson@school.com',
    role: ROLES.STUDENT,
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43211',
    isActive: true,
    studentId: 'CS2024001',
    year: 3,
    semester: 5,
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'maria.garcia@school.com',
    role: ROLES.STUDENT,
    department: 'Electronics',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+91 98765 43212',
    isActive: true,
    studentId: 'EC2024002',
    year: 2,
    semester: 4,
  },
];

export const mockDepartments = [
  {
    id: '1',
    name: 'Computer Science',
    code: 'CS',
    hodId: '1',
    studentCount: 120,
    facultyCount: 15,
    budget: 2500000,
    description: 'Department of Computer Science and Engineering',
  },
  {
    id: '2',
    name: 'Electronics',
    code: 'EC',
    hodId: '4',
    studentCount: 95,
    facultyCount: 12,
    budget: 2200000,
    description: 'Department of Electronics and Communication',
  },
];

export const mockAttendance = [
  {
    studentId: '2',
    subject: 'Data Structures',
    percentage: 92,
    totalClasses: 45,
    attendedClasses: 41,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    studentId: '2',
    subject: 'Operating Systems',
    percentage: 88,
    totalClasses: 40,
    attendedClasses: 35,
    lastUpdated: '2024-01-15T11:30:00Z',
  },
];

export const mockMarks = [
  {
    studentId: '2',
    examType: 'Mid Semester',
    subject: 'Data Structures',
    marksObtained: 85,
    totalMarks: 100,
    grade: 'A',
    date: '2024-01-10T00:00:00Z',
  },
  {
    studentId: '2',
    examType: 'Internal Assessment',
    subject: 'Operating Systems',
    marksObtained: 78,
    totalMarks: 100,
    grade: 'B+',
    date: '2024-01-08T00:00:00Z',
  },
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Exam Schedule Updated',
    message: 'Mid-semester exam schedule has been updated. Please check the new timings.',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
    recipientRole: null, // All roles
  },
  {
    id: '2',
    title: 'Fee Payment Reminder',
    message: 'Your semester fee payment is due in 3 days.',
    type: 'warning',
    isRead: false,
    createdAt: '2024-01-14T14:30:00Z',
    recipientRole: ROLES.STUDENT,
  },
];

export const mockDashboardStats = {
  [ROLES.ORG_ADMIN]: {
    totalStudents: 850,
    totalFaculty: 65,
    totalDepartments: 8,
    monthlyRevenue: 12500000,
    pendingFees: 2300000,
    activeDevices: 45,
    energyConsumption: 1250,
  },
  [ROLES.HOD]: {
    departmentStudents: 120,
    departmentFaculty: 15,
    avgAttendance: 87.5,
    upcomingExams: 3,
    pendingApprovals: 5,
    budgetUtilized: 75,
  },
  [ROLES.STUDENT]: {
    overallAttendance: 89.2,
    currentGPA: 8.7,
    walletBalance: 2500,
    rewardPoints: 1250,
    upcomingExams: 2,
    unreadNotifications: 3,
  },
};

export const mockAPI = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: mockUsers.find(u => u.email === email) || mockUsers[0],
    };
  },

  // Dashboard
  getDashboardStats: async (role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardStats[role];
  },

  // Users
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  },

  // Attendance
  getAttendance: async (studentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAttendance.filter(a => a.studentId === studentId);
  },

  // Marks
  getMarks: async (studentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMarks.filter(m => m.studentId === studentId);
  },

  // Notifications
  getNotifications: async (role?: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockNotifications.filter(n => !n.recipientRole || n.recipientRole === role);
  },

  // Departments
  getDepartments: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDepartments;
  },
};