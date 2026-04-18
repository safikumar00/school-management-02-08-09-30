import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { useAuthStore } from '@/src/store/authStore';
// Kicks off mock adapter registration before any request is made.
import '@/src/services/api';

export default function RootLayout() {
  useFrameworkReady();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
