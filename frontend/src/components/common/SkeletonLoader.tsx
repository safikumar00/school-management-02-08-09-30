import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../../utils/constants';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.cardHeaderText}>
          <SkeletonLoader width="60%" height={16} />
          <SkeletonLoader width="40%" height={12} style={{ marginTop: 4 }} />
        </View>
      </View>
      <SkeletonLoader height={12} style={{ marginTop: SPACING.md }} />
      <SkeletonLoader width="80%" height={12} style={{ marginTop: 4 }} />
      <SkeletonLoader width="60%" height={12} style={{ marginTop: 4 }} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.gray[200],
  },
  card: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});