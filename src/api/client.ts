import axios from 'axios';
import { APP_CONFIG } from '../config/appConfig';
import { storage } from '../utils/storage';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await storage.clearAll();
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Real API functions (placeholder - will be replaced by generated client)
export const realAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getAttendance: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/attendance`);
    return response.data;
  },

  getMarks: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/marks`);
    return response.data;
  },

  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  getDepartments: async () => {
    const response = await apiClient.get('/departments');
    return response.data;
  },
};