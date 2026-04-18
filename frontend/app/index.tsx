import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/src/store/authStore';
import { COLORS } from '@/src/utils/constants';

export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!hydrated) {
    return (
      <View style={styles.loader} data-testid="boot-loader">
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[50],
  },
});
