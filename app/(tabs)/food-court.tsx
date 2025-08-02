import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/layout/Header';
import { RoleGuard } from '../../src/components/layout/RoleGuard';
import { Card } from '../../src/components/common/Card';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { ROLES } from '../../src/config/appConfig';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/utils/constants';
import { formatters } from '../../src/utils/formatters';
import { Minus, Plus, Clock, Star } from 'lucide-react-native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  preparationTime: string;
  available: boolean;
}

export default function FoodCourtScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const categories = ['all', 'breakfast', 'lunch', 'snacks', 'beverages'];
  
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Vegetable Biryani',
      description: 'Aromatic basmati rice with mixed vegetables and spices',
      price: 120,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'lunch',
      rating: 4.5,
      isVeg: true,
      preparationTime: '15-20 min',
      available: true,
    },
    {
      id: '2',
      name: 'Masala Dosa',
      description: 'Crispy dosa served with potato curry and chutneys',
      price: 80,
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'breakfast',
      rating: 4.3,
      isVeg: true,
      preparationTime: '10-15 min',
      available: true,
    },
    {
      id: '3',
      name: 'Fresh Lime Soda',
      description: 'Refreshing lime soda with mint and ice',
      price: 30,
      image: 'https://images.pexels.com/photos/1446302/pexels-photo-1446302.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'beverages',
      rating: 4.0,
      isVeg: true,
      preparationTime: '2-3 min',
      available: true,
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const updateCartItem = (itemId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[itemId] || 0) + change;
      if (newQuantity <= 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemBadges}>
            {item.isVeg && <Badge text="VEG" variant="success" size="sm" />}
            <View style={styles.rating}>
              <Star size={12} color={COLORS.warning[500]} fill={COLORS.warning[500]} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.itemDescription}>{item.description}</Text>
        
        <View style={styles.itemMeta}>
          <View style={styles.timeInfo}>
            <Clock size={12} color={COLORS.gray[500]} />
            <Text style={styles.timeText}>{item.preparationTime}</Text>
          </View>
          <Text style={styles.price}>{formatters.currency(item.price)}</Text>
        </View>
        
        <View style={styles.itemActions}>
          {cart[item.id] ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={() => updateCartItem(item.id, -1)}
                style={styles.quantityButton}
              >
                <Minus size={16} color={COLORS.primary[500]} />
              </TouchableOpacity>
              
              <Text style={styles.quantity}>{cart[item.id]}</Text>
              
              <TouchableOpacity 
                onPress={() => updateCartItem(item.id, 1)}
                style={styles.quantityButton}
              >
                <Plus size={16} color={COLORS.primary[500]} />
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="Add to Cart"
              onPress={() => updateCartItem(item.id, 1)}
              size="sm"
              disabled={!item.available}
            />
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <RoleGuard allowedRoles={[ROLES.STUDENT]}>
      <SafeAreaView style={styles.container}>
        <Header title="Food Court" />
        
        <View style={styles.content}>
          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer}>
            <View style={styles.menuGrid}>
              {filteredItems.map(renderMenuItem)}
            </View>
          </ScrollView>

          {/* Cart Summary */}
          {getTotalItems() > 0 && (
            <View style={styles.cartSummary}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartItems}>{getTotalItems()} items</Text>
                <Text style={styles.cartTotal}>{formatters.currency(getCartTotal())}</Text>
              </View>
              <Button
                title="View Cart"
                onPress={() => console.log('View cart')}
                size="sm"
              />
            </View>
          )}
        </View>
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
  categoriesContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray[200],
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary[500],
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.gray[700],
  },
  activeCategoryText: {
    color: COLORS.gray[50],
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  menuGrid: {
    paddingBottom: SPACING.xl,
  },
  menuItem: {
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.gray[200],
  },
  itemContent: {
    padding: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    flex: 1,
  },
  itemBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[600],
  },
  itemDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary[600],
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  quantity: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
    minWidth: 20,
    textAlign: 'center',
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  cartInfo: {
    flex: 1,
  },
  cartItems: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray[600],
  },
  cartTotal: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.gray[900],
  },
});