import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Cross-platform storage wrapper.
 * Uses SecureStore on iOS/Android, AsyncStorage (which proxies to
 * localStorage/IndexedDB) on web — because SecureStore is native-only.
 */
const nativeStore = {
  get: (k: string) => SecureStore.getItemAsync(k),
  set: (k: string, v: string) => SecureStore.setItemAsync(k, v),
  del: (k: string) => SecureStore.deleteItemAsync(k),
};

const webStore = {
  get: (k: string) => AsyncStorage.getItem(k),
  set: (k: string, v: string) => AsyncStorage.setItem(k, v),
  del: (k: string) => AsyncStorage.removeItem(k),
};

const backend = Platform.OS === 'web' ? webStore : nativeStore;

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ROLE_KEY = 'user_role';

export const storage = {
  setToken: (token: string) => backend.set(TOKEN_KEY, token),
  getToken: () => backend.get(TOKEN_KEY),
  removeToken: () => backend.del(TOKEN_KEY),

  setUser: (user: unknown) => backend.set(USER_KEY, JSON.stringify(user)),
  async getUser<T = unknown>(): Promise<T | null> {
    const raw = await backend.get(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  removeUser: () => backend.del(USER_KEY),

  setRole: (role: string) => backend.set(ROLE_KEY, role),
  getRole: () => backend.get(ROLE_KEY),
  removeRole: () => backend.del(ROLE_KEY),

  async clearAll(): Promise<void> {
    await Promise.all([
      backend.del(TOKEN_KEY),
      backend.del(USER_KEY),
      backend.del(ROLE_KEY),
    ]);
  },

  generic: backend,
};
