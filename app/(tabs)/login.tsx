import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { APP_CONFIG } from '../../src/config/appConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Admin', email: 'admin@school.com', password: 'admin123' },
    { role: 'HOD', email: 'hod@school.com', password: 'hod123' },
    { role: 'Student', email: 'student@school.com', password: 'student123' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{APP_CONFIG.APP_NAME}</Text>
          <Text style={styles.subtitle}>School Management System</Text>
        </View>

        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Sign In</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Card>

        {APP_CONFIG.FEATURES.ROLE_SWITCHING && (
          <Card style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            {demoCredentials.map((cred, index) => (
              <TouchableOpacity
                key={index}
                style={styles.demoButton}
                onPress={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
              >
                <Text style={styles.demoRole}>{cred.role}</Text>
                <Text style={styles.demoEmail}>{cred.email}</Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[50],
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary[700],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray[600],
  },
  loginCard: {
    marginBottom: SPACING.lg,
  },
  loginTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    backgroundColor: COLORS.gray[50],
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary[600],
  },
  demoCard: {
    backgroundColor: COLORS.gray[50],
  },
  demoTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[700],
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  demoButton: {
    padding: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.gray[100],
    marginBottom: SPACING.xs,
  },
  demoRole: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[900],
  },
  demoEmail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[600],
  },
});