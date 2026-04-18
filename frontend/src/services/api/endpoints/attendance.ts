import apiClient, { dedupedGet } from '../client';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  code?: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
}

export const attendanceApi = {
  forStudent(studentId: string): Promise<AttendanceRecord[]> {
    return dedupedGet(`/students/${studentId}/attendance`);
  },
  mark(studentId: string, payload: { subject: string; code?: string; attended: boolean }) {
    return apiClient
      .post<AttendanceRecord>(`/students/${studentId}/attendance`, payload)
      .then((r) => r.data);
  },
};
