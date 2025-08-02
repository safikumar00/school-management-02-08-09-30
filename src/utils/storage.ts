import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ROLE_KEY = 'user_role';

export const storage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async setUser(user: any): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async removeUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  async setRole(role: string): Promise<void> {
    await SecureStore.setItemAsync(ROLE_KEY, role);
  },

  async getRole(): Promise<string | null> {
    return await SecureStore.getItemAsync(ROLE_KEY);
  },

  async removeRole(): Promise<void> {
    await SecureStore.deleteItemAsync(ROLE_KEY);
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
    await this.removeRole();
  },
};