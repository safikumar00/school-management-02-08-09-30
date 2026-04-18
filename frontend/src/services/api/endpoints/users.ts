import { dedupedGet } from '../client';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'org_admin' | 'hod' | 'student';
  department?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  studentId?: string;
  year?: number;
  semester?: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodId: string | null;
  studentCount: number;
  facultyCount: number;
  budget: number;
  description: string;
}

export const usersApi = {
  list(): Promise<AppUser[]> {
    return dedupedGet('/users');
  },
  departments(): Promise<Department[]> {
    return dedupedGet('/departments');
  },
  dashboardStats<T = Record<string, number>>(role: 'org_admin' | 'hod' | 'student') {
    return dedupedGet<T>(`/dashboard/stats/${role}`);
  },
};
