import apiClient from '../client';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'org_admin' | 'hod' | 'student';
    avatar?: string;
    department?: string;
    phone?: string;
    studentId?: string;
    year?: number;
    semester?: number;
  };
}

export const authApi = {
  login(email: string, password: string): Promise<LoginResponse> {
    return apiClient
      .post<LoginResponse>('/auth/login', { email, password })
      .then((r) => r.data);
  },
  me(): Promise<{ user: LoginResponse['user'] }> {
    return apiClient.get('/auth/me').then((r) => r.data);
  },
};
