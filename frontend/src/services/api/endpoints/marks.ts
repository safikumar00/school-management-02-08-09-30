import apiClient, { dedupedGet } from '../client';

export interface MarkRecord {
  id: string;
  studentId: string;
  examType: string;
  subject: string;
  code?: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  date: string;
}

export const marksApi = {
  forStudent(studentId: string): Promise<MarkRecord[]> {
    return dedupedGet(`/students/${studentId}/marks`);
  },
  submit(
    studentId: string,
    payload: { subject: string; examType: string; marksObtained: number; totalMarks: number; code?: string },
  ) {
    return apiClient
      .post<MarkRecord>(`/students/${studentId}/marks`, payload)
      .then((r) => r.data);
  },
};
