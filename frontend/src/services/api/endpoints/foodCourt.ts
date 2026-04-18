import apiClient, { dedupedGet } from '../client';
import type { Wallet } from './wallet';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  preparationTime: string;
  available: boolean;
}

export interface OrderLine {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  studentId: string;
  items: OrderLine[];
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'delivered';
  placedAt: string;
}

export const foodCourtApi = {
  menu(): Promise<{ categories: string[]; items: MenuItem[] }> {
    return dedupedGet('/food-court/menu');
  },
  placeOrder(studentId: string, items: { id: string; quantity: number }[]) {
    return apiClient
      .post<{ order: Order; wallet: Wallet }>('/food-court/orders', {
        studentId,
        items,
      })
      .then((r) => r.data);
  },
  myOrders(studentId: string): Promise<Order[]> {
    return dedupedGet(`/food-court/orders/${studentId}`);
  },
};
