import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { MetricCard } from '../../src/components/widgets/MetricCard';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { formatters } from '../../src/utils/formatters';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight,
  Gift
} from 'lucide-react-native';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function WalletScreen() {
  const [balance] = useState(2500);
  const [rewardPoints] = useState(1250);
  
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'debit',
      amount: 120,
      description: 'Food Court - Vegetable Biryani',
      date: '2024-01-15T12:30:00Z',
      category: 'food',
    },
    {
      id: '2',
      type: 'credit',
      amount: 1000,
      description: 'Wallet Top-up',
      date: '2024-01-14T09:15:00Z',
      category: 'topup',
    },
    {
      id: '3',
      type: 'debit',
      amount: 50,
      description: 'Library Fine',
      date: '2024-01-13T16:45:00Z',
      category: 'fees',
    },
  ];

  const quickActions = [
    {
      icon: <Plus size={20} color={COLORS.success[500]} />,
      label: 'Add Money',
      onPress: () => console.log('Add money'),
      color: COLORS.success[500],
    },
    {
      icon: <Send size={20} color={COLORS.primary[500]} />,
      label: 'Transfer',
      onPress: () => console.log('Transfer'),
      color: COLORS.primary[500],
    },
    {
      icon: <Gift size={20} color={COLORS.accent[500]} />,
      label: 'Redeem',
      onPress: () => console.log('Redeem points'),
      color: COLORS.accent[500],
    },
  ];

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity key={transaction.id} style={styles.transaction}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: transaction.type === 'credit' ? COLORS.success[50] : COLORS.error[50] }
      ]}>
        {transaction.type === 'credit' ? (
          <ArrowDownLeft size={16} color={COLORS.success[500]} />
        ) : (
          <ArrowUpRight size={16} color={COLORS.error[500]} />
        )}
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.transactionDate}>
          {formatters.dateTime(transaction.date)}
        </Text>
      </View>
      
      <Text style={[
        styles.transactionAmount,
        { color: transaction.type === 'credit' ? COLORS.success[600] : COLORS.error[600] }
      ]}>
        {transaction.type === 'credit' ? '+' : '-'}{formatters.currency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container}>
        <Header title="Wallet" />
        
        <ScrollView style={styles.content}>
          {/* Balance Card */}
          <Card style={styles.balanceCard}>
            <View style={styles.balanceContent}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>
                  {formatters.currency(balance)}
                </Text>
              </View>
              <View style={styles.walletIcon}>
                <Wallet size={32} color={COLORS.primary[500]} />
              </View>
            </View>
          </Card>

          {/* Metrics */}
          <View style={styles.metricsSection}>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="This Month"
                value={formatters.currency(850)}
                subtitle="Spent"
                icon={<TrendingUp size={20} color={COLORS.error[500]} />}
                color={COLORS.error[500]}
              />
              <MetricCard
                title="Reward Points"
                value={rewardPoints.toLocaleString()}
                subtitle="Available"
                icon={<Gift size={20} color={COLORS.accent[500]} />}
                color={COLORS.accent[500]}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  style={[styles.actionButton, { borderColor: action.color + '30' }]}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                    {action.icon}
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <Card style={styles.transactionsCard}>
              {transactions.map(renderTransaction)}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  content: {
    flex: 1,
  },
  balanceCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.primary[500],
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary[100],
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.gray[50],
  },
  walletIcon: {
    opacity: 0.8,
  },
  metricsSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionsSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
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
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
    textAlign: 'center',
  },
  transactionsSection: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary[600],
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  transactionsCard: {
    padding: 0,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});