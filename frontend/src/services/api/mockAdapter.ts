/**
 * Mock adapter registration. Intercepts axios requests and returns realistic
 * responses with simulated latency when ENV.USE_MOCK = true.
 *
 * To swap to a real backend, set EXPO_PUBLIC_USE_MOCK=false and
 * EXPO_PUBLIC_API_BASE_URL=https://api.example.com
 */
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import { ENV } from '../../constants/env';

import usersSeed from '../../mocks/data/users.json';
import attendanceSeed from '../../mocks/data/attendance.json';
import marksSeed from '../../mocks/data/marks.json';
import walletSeed from '../../mocks/data/wallet.json';
import foodSeed from '../../mocks/data/foodCourt.json';
import notificationsSeed from '../../mocks/data/notifications.json';
import catalogSeed from '../../mocks/data/catalog.json';

type User = (typeof usersSeed)[number];
type Role = 'org_admin' | 'hod' | 'student';

// Deep clone to avoid mutating imported JSON (modules cache).
const db = {
  users: JSON.parse(JSON.stringify(usersSeed)) as User[],
  attendance: JSON.parse(JSON.stringify(attendanceSeed)) as typeof attendanceSeed,
  marks: JSON.parse(JSON.stringify(marksSeed)) as typeof marksSeed,
  wallet: JSON.parse(JSON.stringify(walletSeed)) as typeof walletSeed,
  food: JSON.parse(JSON.stringify(foodSeed)) as typeof foodSeed,
  notifications: JSON.parse(JSON.stringify(notificationsSeed)) as typeof notificationsSeed,
  catalog: JSON.parse(JSON.stringify(catalogSeed)) as typeof catalogSeed,
};

const latency = () =>
  Math.floor(
    ENV.MOCK_LATENCY_MIN + Math.random() * (ENV.MOCK_LATENCY_MAX - ENV.MOCK_LATENCY_MIN),
  );

const ok = <T>(data: T, status = 200): [number, T] => [status, data];

const publicUser = (u: User) => {
  const { password, ...rest } = u as User & { password?: string };
  return rest;
};

let mock: MockAdapter | null = null;

export function setupMocks(): void {
  if (!ENV.USE_MOCK || mock) return;
  mock = new MockAdapter(apiClient, { delayResponse: 0, onNoMatch: 'passthrough' });

  // ---------- AUTH ----------
  mock.onPost('/auth/login').reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const body = JSON.parse(config.data || '{}') as { email?: string; password?: string };
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const user = db.users.find((u) => u.email.toLowerCase() === email);
    if (!user) return [404, { message: 'No account found for this email.' }];
    if (user.password !== password)
      return [401, { message: 'Incorrect password. Try again.' }];
    const token = `mock_jwt.${user.id}.${Date.now()}`;
    return ok({ token, user: publicUser(user) });
  });

  mock.onGet('/auth/me').reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const auth = (config.headers?.Authorization as string) || '';
    const match = auth.match(/mock_jwt\.([^.]+)\./);
    const userId = match?.[1];
    const user = userId ? db.users.find((u) => u.id === userId) : null;
    if (!user) return [401, { message: 'Session expired.' }];
    return ok({ user: publicUser(user) });
  });

  // ---------- USERS ----------
  mock.onGet('/users').reply(async () => {
    await new Promise((r) => setTimeout(r, latency()));
    return ok(db.users.map(publicUser));
  });

  // ---------- DASHBOARD ----------
  mock.onGet(/\/dashboard\/stats\/.+/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const role = (config.url || '').split('/').pop() as Role;
    const stats = db.catalog.dashboard[role];
    if (!stats) return [404, { message: 'Role not found.' }];
    return ok(stats);
  });

  mock.onGet('/departments').reply(async () => {
    await new Promise((r) => setTimeout(r, latency()));
    return ok(db.catalog.departments);
  });

  // ---------- ATTENDANCE ----------
  mock.onGet(/\/students\/[^/]+\/attendance/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const url = config.url || '';
    const studentId = url.split('/')[2];
    return ok(db.attendance.filter((a) => a.studentId === studentId));
  });

  mock.onPost(/\/students\/[^/]+\/attendance/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const body = JSON.parse(config.data || '{}') as {
      subject: string;
      code?: string;
      attended: boolean;
    };
    const studentId = (config.url || '').split('/')[2];
    const existing = db.attendance.find(
      (a) => a.studentId === studentId && a.subject === body.subject,
    );
    if (existing) {
      existing.totalClasses += 1;
      if (body.attended) existing.attendedClasses += 1;
      existing.percentage = Math.round(
        (existing.attendedClasses / existing.totalClasses) * 100,
      );
      existing.lastUpdated = new Date().toISOString();
      return ok(existing);
    }
    const record = {
      id: `att-${Date.now()}`,
      studentId,
      subject: body.subject,
      code: body.code || '',
      totalClasses: 1,
      attendedClasses: body.attended ? 1 : 0,
      percentage: body.attended ? 100 : 0,
      lastUpdated: new Date().toISOString(),
    };
    db.attendance.push(record as any);
    return [201, record];
  });

  // ---------- MARKS ----------
  mock.onGet(/\/students\/[^/]+\/marks/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/')[2];
    return ok(db.marks.filter((m) => m.studentId === studentId));
  });

  mock.onPost(/\/students\/[^/]+\/marks/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/')[2];
    const body = JSON.parse(config.data || '{}');
    const record = {
      id: `mk-${Date.now()}`,
      studentId,
      examType: body.examType || 'Assignment',
      subject: body.subject || 'Untitled',
      code: body.code || '',
      marksObtained: Number(body.marksObtained) || 0,
      totalMarks: Number(body.totalMarks) || 100,
      grade: computeGrade(
        (Number(body.marksObtained) / Number(body.totalMarks)) * 100,
      ),
      date: new Date().toISOString(),
    };
    db.marks.push(record as any);
    return [201, record];
  });

  // ---------- WALLET ----------
  mock.onGet(/\/wallet\/[^/]+$/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/').pop()!;
    const wallet = db.wallet.wallets[studentId] ?? {
      balance: 0,
      rewardPoints: 0,
      monthlySpent: 0,
    };
    return ok({ studentId, ...wallet });
  });

  mock.onGet(/\/wallet\/[^/]+\/transactions/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/')[2];
    const txns = db.wallet.transactions
      .filter((t) => t.studentId === studentId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return ok(txns);
  });

  mock.onPost(/\/wallet\/[^/]+\/topup/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/')[2];
    const body = JSON.parse(config.data || '{}');
    const amount = Number(body.amount);
    if (!amount || amount <= 0)
      return [400, { message: 'Top-up amount must be greater than zero.' }];
    const wallet = db.wallet.wallets[studentId] ?? {
      balance: 0,
      rewardPoints: 0,
      monthlySpent: 0,
    };
    wallet.balance += amount;
    db.wallet.wallets[studentId] = wallet;
    const txn = {
      id: `tx-${Date.now()}`,
      studentId,
      type: 'credit' as const,
      amount,
      description: body.description || 'Wallet Top-up',
      date: new Date().toISOString(),
      category: 'topup',
    };
    db.wallet.transactions.unshift(txn);
    return [201, { wallet: { studentId, ...wallet }, transaction: txn }];
  });

  mock.onPost(/\/wallet\/[^/]+\/debit/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/')[2];
    const body = JSON.parse(config.data || '{}');
    const amount = Number(body.amount);
    const wallet = db.wallet.wallets[studentId];
    if (!wallet) return [404, { message: 'Wallet not found.' }];
    if (amount <= 0) return [400, { message: 'Invalid amount.' }];
    if (wallet.balance < amount)
      return [409, { message: 'Insufficient balance.' }];
    wallet.balance -= amount;
    wallet.monthlySpent += amount;
    const txn = {
      id: `tx-${Date.now()}`,
      studentId,
      type: 'debit' as const,
      amount,
      description: body.description || 'Payment',
      date: new Date().toISOString(),
      category: body.category || 'food',
    };
    db.wallet.transactions.unshift(txn);
    return ok({ wallet: { studentId, ...wallet }, transaction: txn });
  });

  // ---------- FOOD COURT ----------
  mock.onGet('/food-court/menu').reply(async () => {
    await new Promise((r) => setTimeout(r, latency()));
    return ok({ categories: db.food.categories, items: db.food.items });
  });

  mock.onPost('/food-court/orders').reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const body = JSON.parse(config.data || '{}') as {
      studentId: string;
      items: { id: string; quantity: number }[];
    };
    const lines = body.items.map((it) => {
      const product = db.food.items.find((p) => p.id === it.id);
      if (!product) throw new Error(`Unknown item ${it.id}`);
      return {
        itemId: it.id,
        name: product.name,
        quantity: it.quantity,
        unitPrice: product.price,
        subtotal: product.price * it.quantity,
      };
    });
    const total = lines.reduce((s, l) => s + l.subtotal, 0);
    const wallet = db.wallet.wallets[body.studentId];
    if (!wallet) return [404, { message: 'Wallet not found.' }];
    if (wallet.balance < total)
      return [409, { message: 'Insufficient wallet balance to place order.' }];
    wallet.balance -= total;
    wallet.monthlySpent += total;
    const order = {
      id: `ord-${Date.now()}`,
      studentId: body.studentId,
      items: lines,
      total,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
    };
    (db.food.orders as any[]).unshift(order);
    const txn = {
      id: `tx-${Date.now()}`,
      studentId: body.studentId,
      type: 'debit' as const,
      amount: total,
      description: `Food Court · ${lines.length} item${lines.length > 1 ? 's' : ''}`,
      date: new Date().toISOString(),
      category: 'food',
    };
    db.wallet.transactions.unshift(txn);
    return [201, { order, wallet: { studentId: body.studentId, ...wallet } }];
  });

  mock.onGet(/\/food-court\/orders\/[^/]+/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const studentId = (config.url || '').split('/').pop()!;
    const orders = (db.food.orders as any[]).filter((o) => o.studentId === studentId);
    return ok(orders);
  });

  // ---------- NOTIFICATIONS ----------
  mock.onGet('/notifications').reply(async (config) => {
    await new Promise((r) => setTimeout(r, latency()));
    const role = (config.params?.role as Role | undefined) ?? undefined;
    const list = db.notifications
      .filter((n) => !n.recipientRole || n.recipientRole === role)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return ok(list);
  });

  mock.onPost(/\/notifications\/[^/]+\/read/).reply(async (config) => {
    await new Promise((r) => setTimeout(r, 150));
    const id = (config.url || '').split('/')[2];
    const n = db.notifications.find((x) => x.id === id);
    if (!n) return [404, { message: 'Notification not found.' }];
    n.isRead = true;
    return ok(n);
  });

  mock.onPost('/notifications/read-all').reply(async () => {
    await new Promise((r) => setTimeout(r, latency()));
    db.notifications.forEach((n) => (n.isRead = true));
    return ok({ updated: db.notifications.length });
  });
}

function computeGrade(pct: number): string {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'F';
}
