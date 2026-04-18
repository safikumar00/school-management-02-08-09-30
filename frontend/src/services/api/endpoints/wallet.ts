import apiClient, { dedupedGet } from '../client';

export interface Wallet {
  studentId: string;
  balance: number;
  rewardPoints: number;
  monthlySpent: number;
}

export interface Transaction {
  id: string;
  studentId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  category: string;
}

export const walletApi = {
  get(studentId: string): Promise<Wallet> {
    return dedupedGet(`/wallet/${studentId}`);
  },
  transactions(studentId: string): Promise<Transaction[]> {
    return dedupedGet(`/wallet/${studentId}/transactions`);
  },
  topup(studentId: string, amount: number, description?: string) {
    return apiClient
      .post<{ wallet: Wallet; transaction: Transaction }>(
        `/wallet/${studentId}/topup`,
        { amount, description },
      )
      .then((r) => r.data);
  },
  debit(
    studentId: string,
    amount: number,
    description: string,
    category = 'food',
  ) {
    return apiClient
      .post<{ wallet: Wallet; transaction: Transaction }>(
        `/wallet/${studentId}/debit`,
        { amount, description, category },
      )
      .then((r) => r.data);
  },
};
