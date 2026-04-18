import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Clock, Star, ShoppingBag, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { ErrorState } from '../../src/components/common/ErrorState';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { useAuth } from '../../src/contexts/AuthContext';
import { useApi } from '../../src/hooks/useApi';
import { useCartStore } from '../../src/store/cartStore';
import { foodCourtApi, type MenuItem } from '../../src/services/api/endpoints/foodCourt';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { formatters } from '../../src/utils/formatters';

export default function FoodCourtScreen() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('all');
  const [placing, setPlacing] = useState(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);

  const { data, loading, error, refreshing, refresh } = useApi<{ categories: string[]; items: MenuItem[] }>(
    () => foodCourtApi.menu(),
    [],
    { cacheKey: 'food-menu', staleTime: 60_000 },
  );

  const categories = data?.categories ?? ['all'];
  const menu = data?.items ?? [];

  const filtered = useMemo(
    () => (selected === 'all' ? menu : menu.filter((m) => m.category === selected)),
    [selected, menu],
  );

  const cartTotal = useMemo(
    () =>
      Object.entries(items).reduce((sum, [id, qty]) => {
        const p = menu.find((m) => m.id === id);
        return sum + (p ? p.price * qty : 0);
      }, 0),
    [items, menu],
  );
  const cartCount = Object.values(items).reduce((a, b) => a + b, 0);

  const placeOrder = async () => {
    if (!user?.id) return;
    const payload = Object.entries(items).map(([id, quantity]) => ({ id, quantity }));
    if (payload.length === 0) return;
    try {
      setPlacing(true);
      const { order } = await foodCourtApi.placeOrder(user.id, payload);
      clearCart();
      setOrderConfirmedId(order.id);
      setTimeout(() => setOrderConfirmedId(null), 3500);
    } catch (err: any) {
      if (Platform.OS !== 'web') Alert.alert('Order failed', err?.message ?? 'Try again');
      else window.alert(err?.message ?? 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const renderItem = (item: MenuItem) => {
    const qty = items[item.id] || 0;
    return (
      <Card key={item.id} style={styles.menuItem} padding="md">
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemContent}>
          <View style={styles.itemHead}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.itemBadges}>
              {item.isVeg && <Badge text="VEG" variant="success" size="sm" />}
              <View style={styles.rating}>
                <Star size={12} color={COLORS.warning[500]} fill={COLORS.warning[500]} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.itemMeta}>
            <View style={styles.timeInfo}>
              <Clock size={12} color={COLORS.gray[500]} />
              <Text style={styles.timeText}>{item.preparationTime}</Text>
            </View>
            <Text style={styles.price}>{formatters.currency(item.price)}</Text>
          </View>
          <View style={styles.itemActions}>
            {qty ? (
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => remove(item.id)} style={styles.qtyBtn} data-testid={`cart-decrement-${item.id}`}>
                  <Minus size={16} color={COLORS.primary[600]} />
                </TouchableOpacity>
                <Text style={styles.qty}>{qty}</Text>
                <TouchableOpacity onPress={() => add(item.id)} style={styles.qtyBtn} data-testid={`cart-increment-${item.id}`}>
                  <Plus size={16} color={COLORS.primary[600]} />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Add to cart"
                onPress={() => add(item.id)}
                size="sm"
                disabled={!item.available}
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container} edges={['top']} data-testid="food-court-screen">
        <Header title="Food court" />
        <View style={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelected(c)}
                style={[styles.chip, selected === c && styles.chipActive]}
              >
                <Text style={[styles.chipText, selected === c && styles.chipTextActive]}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading && !menu.length ? (
            <ScrollView contentContainerStyle={styles.menuList}>
              <SkeletonList count={4} />
            </ScrollView>
          ) : error && !menu.length ? (
            <Card style={{ margin: SPACING.md }}>
              <ErrorState error={error} onRetry={refresh} />
            </Card>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={48} color={COLORS.gray[400]} />}
              title="Nothing in this category"
              description="Check back later or try another category."
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.menuList}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
              showsVerticalScrollIndicator={false}
            >
              {filtered.map(renderItem)}
              <View style={{ height: cartCount ? 100 : SPACING.xl }} />
            </ScrollView>
          )}

          {cartCount > 0 && (
            <View style={styles.cartBar} data-testid="cart-bar">
              <View style={{ flex: 1 }}>
                <Text style={styles.cartCount}>
                  {cartCount} item{cartCount > 1 ? 's' : ''}
                </Text>
                <Text style={styles.cartTotal}>{formatters.currency(cartTotal)}</Text>
              </View>
              <Button
                title={placing ? 'Placing…' : 'Place order'}
                onPress={placeOrder}
                loading={placing}
                size="md"
              />
            </View>
          )}

          {orderConfirmedId && (
            <View style={styles.toast} data-testid="order-success-toast">
              <CheckCircle2 size={18} color={COLORS.success[600]} />
              <Text style={styles.toastText}>Order placed · {orderConfirmedId.slice(-6)}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[100] },
  content: { flex: 1 },
  chipsRow: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, flexGrow: 0 },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 999,
    backgroundColor: COLORS.gray[200],
  },
  chipActive: { backgroundColor: COLORS.primary[600] },
  chipText: { fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '600', color: COLORS.gray[700] },
  chipTextActive: { color: COLORS.gray[50] },
  menuList: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.md },
  menuItem: { marginBottom: SPACING.md, overflow: 'hidden', padding: 0 },
  itemImage: { width: '100%', height: 140, backgroundColor: COLORS.gray[200] },
  itemContent: { padding: SPACING.md, gap: SPACING.xs },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700', color: COLORS.gray[900], flex: 1, marginRight: SPACING.sm },
  itemBadges: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[700], fontWeight: '600' },
  itemDesc: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.gray[600], lineHeight: 20 },
  itemMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.gray[500] },
  price: { fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: '700', color: COLORS.primary[600] },
  itemActions: { alignItems: 'flex-end', marginTop: SPACING.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary[100],
  },
  qty: { fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700', color: COLORS.gray[900], minWidth: 22, textAlign: 'center' },
  cartBar: {
    position: 'absolute',
    bottom: 96,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: '#0B1220',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 10,
  },
  cartCount: { fontSize: TYPOGRAPHY.fontSize.xs, color: '#94A3B8' },
  cartTotal: { fontSize: TYPOGRAPHY.fontSize.lg, color: COLORS.gray[50], fontWeight: '700' },
  toast: {
    position: 'absolute',
    top: 12,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.success[50],
    borderWidth: 1,
    borderColor: COLORS.success[100],
  },
  toastText: { color: COLORS.success[700], fontWeight: '600' },
});
