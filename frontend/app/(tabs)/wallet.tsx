import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Plus,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
} from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useAuth } from '../../src/contexts/AuthContext';
import { useApi } from '../../src/hooks/useApi';
import { walletApi, type Wallet, type Transaction } from '../../src/services/api/endpoints/wallet';
import { formatters } from '../../src/utils/formatters';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';

export default function WalletScreen() {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  const walletHook = useApi<Wallet>(
    () => (user?.id ? walletApi.get(user.id) : Promise.reject(new Error('no user'))),
    [user?.id],
    { cacheKey: user?.id ? `wallet-${user.id}` : undefined, staleTime: 10_000, enabled: !!user?.id },
  );

  const txHook = useApi<Transaction[]>(
    () => (user?.id ? walletApi.transactions(user.id) : Promise.resolve([])),
    [user?.id],
    { cacheKey: user?.id ? `wallet-tx-${user.id}` : undefined, staleTime: 10_000, enabled: !!user?.id },
  );

  const wallet = walletHook.data;
  const transactions = txHook.data ?? [];

  const refreshAll = async () => {
    await Promise.all([walletHook.refresh(), txHook.refresh()]);
  };

  const handleTopUp = async (amount: number) => {
    if (!user?.id) return;
    try {
      setPending(true);
      await walletApi.topup(user.id, amount, 'Quick top-up');
      await refreshAll();
      if (Platform.OS !== 'web') {
        Alert.alert('Top-up successful', `₹${amount} added to your wallet.`);
      }
    } catch (err: any) {
      if (Platform.OS !== 'web') Alert.alert('Top-up failed', err?.message ?? 'Try again');
    } finally {
      setPending(false);
    }
  };

  const renderTxn = (t: Transaction) => (
    <View key={t.id} style={styles.txn} data-testid={`wallet-txn-${t.id}`}>
      <View
        style={[
          styles.txnIcon,
          { backgroundColor: t.type === 'credit' ? COLORS.success[50] : COLORS.error[50] },
        ]}
      >
        {t.type === 'credit' ? (
          <ArrowDownLeft size={16} color={COLORS.success[600]} />
        ) : (
          <ArrowUpRight size={16} color={COLORS.error[600]} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txnDesc} numberOfLines={1}>
          {t.description}
        </Text>
        <Text style={styles.txnDate}>{formatters.dateTime(t.date)}</Text>
      </View>
      <Text
        style={[
          styles.txnAmount,
          { color: t.type === 'credit' ? COLORS.success[600] : COLORS.error[600] },
        ]}
      >
        {t.type === 'credit' ? '+' : '-'}
        {formatters.currency(t.amount)}
      </Text>
    </View>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container} edges={['top']} data-testid="wallet-screen">
        <Header title="Wallet" />
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={walletHook.refreshing || txHook.refreshing} onRefresh={refreshAll} />
          }
        >
          {/* Balance */}
          {walletHook.loading && !wallet ? (
            <Card style={{ margin: SPACING.md }}><SkeletonList count={1} /></Card>
          ) : walletHook.error && !wallet ? (
            <Card style={{ margin: SPACING.md }}><ErrorState error={walletHook.error} onRetry={walletHook.refresh} /></Card>
          ) : (
            <Card style={styles.balanceCard}>
              <View style={styles.balanceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.balanceLabel}>Available balance</Text>
                  <Text style={styles.balanceAmount} data-testid="wallet-balance">
                    {formatters.currency(wallet?.balance ?? 0)}
                  </Text>
                  <Text style={styles.balanceSub}>
                    Spent this month · {formatters.currency(wallet?.monthlySpent ?? 0)}
                  </Text>
                </View>
                <View style={styles.walletIcon}>
                  <WalletIcon size={28} color={COLORS.gray[50]} />
                </View>
              </View>
            </Card>
          )}

          {/* Metrics */}
          <View style={styles.metricsWrap}>
            <View style={styles.metricCell}>
              <MetricCard
                title="This month"
                value={formatters.currency(wallet?.monthlySpent ?? 0)}
                subtitle="Spent"
                icon={<TrendingUp size={20} color={COLORS.error[500]} />}
                color={COLORS.error[500]}
              />
            </View>
            <View style={styles.metricCell}>
              <MetricCard
                title="Reward points"
                value={wallet?.rewardPoints?.toLocaleString() ?? '0'}
                subtitle="Available"
                icon={<Gift size={20} color={COLORS.accent[500]} />}
                color={COLORS.accent[500]}
              />
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <View style={styles.actions}>
              {[200, 500, 1000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => handleTopUp(amt)}
                  disabled={pending}
                  style={[styles.actionBtn, { borderColor: COLORS.success[200] }]}
                  data-testid={`topup-${amt}`}
                >
                  <View style={[styles.actionIcon, { backgroundColor: COLORS.success[50] }]}>
                    <Plus size={18} color={COLORS.success[600]} />
                  </View>
                  <Text style={styles.actionLabel}>+ ₹{amt}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: COLORS.primary[200] }]}
                disabled
              >
                <View style={[styles.actionIcon, { backgroundColor: COLORS.primary[50] }]}>
                  <Send size={18} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.actionLabel}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transactions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
            <Card style={{ padding: 0 }}>
              {txHook.loading && !transactions.length ? (
                <View style={{ padding: SPACING.md }}><SkeletonList count={3} /></View>
              ) : txHook.error && !transactions.length ? (
                <ErrorState error={txHook.error} onRetry={txHook.refresh} />
              ) : transactions.length === 0 ? (
                <EmptyState
                  icon={<WalletIcon size={40} color={COLORS.gray[400]} />}
                  title="No activity yet"
                  description="Your wallet activity will show up here."
                />
              ) : (
                transactions.slice(0, 10).map(renderTxn)
              )}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1 },
  balanceCard: {
    margin: SPACING.md,
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceLabel: { fontSize: TYPOGRAPHY.fontSize.sm, color: '#94A3B8' },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.gray[50],
    marginTop: SPACING.xs,
    letterSpacing: -0.5,
  },
  balanceSub: { fontSize: TYPOGRAPHY.fontSize.xs, color: '#94A3B8', marginTop: 4 },
  walletIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsWrap: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricCell: { flex: 1, minWidth: 160 },
  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
  },
  actions: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  actionBtn: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  actionLabel: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600', color: COLORS.gray[800] },
  txn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    gap: SPACING.sm,
  },
  txnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnDesc: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '600', color: COLORS.gray[900] },
  txnDate: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[500], marginTop: 2 },
  txnAmount: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700' },
});
