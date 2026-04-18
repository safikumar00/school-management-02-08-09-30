import apiClient, { dedupedGet } from '../client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  recipientRole: 'org_admin' | 'hod' | 'student' | null;
}

export const notificationsApi = {
  list(role?: 'org_admin' | 'hod' | 'student'): Promise<Notification[]> {
    return dedupedGet('/notifications', role ? { role } : undefined);
  },
  markRead(id: string) {
    return apiClient.post<Notification>(`/notifications/${id}/read`).then((r) => r.data);
  },
  markAllRead() {
    return apiClient.post<{ updated: number }>('/notifications/read-all').then((r) => r.data);
  },
};
