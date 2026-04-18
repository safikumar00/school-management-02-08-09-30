import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react-native';
import { Button } from '../src/components/common/Button';
import { useAuth } from '../src/contexts/AuthContext';
import { useAuthStore } from '../src/store/authStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../src/utils/constants';
import { ENV } from '../src/constants/env';
import { ApiError } from '../src/services/api';

const demo = [
  {
    role: 'Organization Admin',
    email: 'admin@school.com',
    password: 'admin123',
    color: COLORS.primary[500],
  },
  {
    role: 'Head of Department',
    email: 'hod@school.com',
    password: 'hod123',
    color: COLORS.secondary[500],
  },
  {
    role: 'Student',
    email: 'student@school.com',
    password: 'student123',
    color: COLORS.accent[500],
  },
];

export default function LoginScreen() {
  const { isAuthenticated, hydrated } = useAuth();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  if (hydrated && isAuthenticated) return <Redirect href="/(tabs)" />;

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? 'Unable to sign in. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, isWide && styles.scrollWide]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.twoCol, isWide && styles.twoColWide]}>
            {/* Hero panel */}
            <View style={[styles.hero, isWide && styles.heroWide]}>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <GraduationCap size={22} color={COLORS.gray[50]} />
                </View>
                <Text style={styles.brandName}>{ENV.APP_NAME}</Text>
              </View>

              <Text style={styles.heroTitle}>
                Your campus,{'\n'}one tap away.
              </Text>
              <Text style={styles.heroSub}>
                Attendance, grades, meals and wallet — built for students, HODs
                and admins.
              </Text>

              <View style={styles.heroStats}>
                {[
                  { label: 'Active students', value: '850+' },
                  { label: 'Avg. attendance', value: '87%' },
                  { label: 'Uptime', value: '99.9%' },
                ].map((s) => (
                  <View key={s.label} style={styles.statPill}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Form panel */}
            <View style={[styles.formWrap, isWide && styles.formWrapWide]}>
              <View style={styles.formCard} data-testid="login-card">
                <Text style={styles.formTitle}>Sign in</Text>
                <Text style={styles.formSub}>
                  Welcome back. Pick a demo account or use your own.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputField}>
                    <Mail size={16} color={COLORS.gray[500]} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="you@school.com"
                      placeholderTextColor={COLORS.gray[400]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      data-testid="login-email-input"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputField}>
                    <Lock size={16} color={COLORS.gray[500]} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.gray[400]}
                      secureTextEntry
                      data-testid="login-password-input"
                    />
                  </View>
                </View>

                {error ? (
                  <View style={styles.errorBanner} data-testid="login-error">
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Button
                  title={loading ? 'Signing in…' : 'Sign in'}
                  onPress={handleLogin}
                  loading={loading}
                  fullWidth
                  rightIcon={!loading ? <ArrowRight size={16} color={COLORS.gray[50]} /> : undefined}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or try as</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.demoList}>
                  {demo.map((d) => (
                    <TouchableOpacity
                      key={d.email}
                      style={styles.demoRow}
                      onPress={() => quickFill(d.email, d.password)}
                      activeOpacity={0.7}
                      data-testid={`demo-login-${d.email.split('@')[0]}`}
                    >
                      <View style={[styles.demoDot, { backgroundColor: d.color }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.demoRole}>{d.role}</Text>
                        <Text style={styles.demoEmail}>{d.email}</Text>
                      </View>
                      <Sparkles size={14} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.footerHint}>
                  Preview runs on mock data · no real credentials stored.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[50] },
  scroll: { flexGrow: 1, padding: SPACING.md },
  scrollWide: { padding: SPACING.xl, alignItems: 'center', justifyContent: 'center' },
  twoCol: { flex: 1, gap: SPACING.lg, width: '100%', maxWidth: 1100 },
  twoColWide: { flexDirection: 'row', alignItems: 'stretch' },
  hero: {
    backgroundColor: '#0B1220',
    borderRadius: 20,
    padding: SPACING.xl,
    gap: SPACING.lg,
    overflow: 'hidden',
  },
  heroWide: { flex: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: COLORS.gray[50],
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: COLORS.gray[50],
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: SPACING.lg,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: 24,
    maxWidth: 420,
  },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    minWidth: 110,
  },
  statValue: { color: COLORS.gray[50], fontWeight: '700', fontSize: TYPOGRAPHY.fontSize.lg },
  statLabel: { color: '#94A3B8', fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 2 },
  formWrap: { width: '100%' },
  formWrapWide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  formCard: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 20,
    padding: SPACING.xl,
    gap: SPACING.sm,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  formTitle: { fontSize: TYPOGRAPHY.fontSize['2xl'], fontWeight: '700', color: COLORS.gray[900] },
  formSub: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.gray[600], marginBottom: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600', color: COLORS.gray[700] },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    height: 48,
  },
  input: { flex: 1, fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.gray[900], outlineStyle: 'none' as any },
  errorBanner: {
    backgroundColor: COLORS.error[50],
    borderWidth: 1,
    borderColor: COLORS.error[100],
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
  },
  errorText: { color: COLORS.error[700], fontSize: TYPOGRAPHY.fontSize.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginVertical: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.gray[200] },
  dividerText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[500], fontWeight: '600' },
  demoList: { gap: SPACING.xs, marginTop: SPACING.xs },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: 10,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  demoDot: { width: 8, height: 8, borderRadius: 4 },
  demoRole: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600', color: COLORS.gray[900] },
  demoEmail: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[600] },
  footerHint: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
});
