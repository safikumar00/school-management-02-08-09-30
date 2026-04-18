import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRole } from '../../hooks/useRole';
import { COLORS, TYPOGRAPHY } from '../../utils/constants';
import type { UserRole } from '../../config/appConfig';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { canAccessRoute } = useRole();

  if (!canAccessRoute(allowedRoles)) {
    return (
      fallback || (
        <View style={styles.container}>
          <Text style={styles.text}>
            You don't have permission to access this section.
          </Text>
        </View>
      )
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});