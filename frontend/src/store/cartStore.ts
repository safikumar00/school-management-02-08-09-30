/**
 * Cart store for the food court. Persists between screens until checkout.
 */
import { create } from 'zustand';

interface CartState {
  items: Record<string, number>; // itemId -> quantity
  add: (id: string) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: {},
  add: (id) =>
    set((s) => ({ items: { ...s.items, [id]: (s.items[id] || 0) + 1 } })),
  remove: (id) =>
    set((s) => {
      const next = { ...s.items };
      const nextQty = (next[id] || 0) - 1;
      if (nextQty <= 0) delete next[id];
      else next[id] = nextQty;
      return { items: next };
    }),
  setQuantity: (id, qty) =>
    set((s) => {
      const next = { ...s.items };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { items: next };
    }),
  clear: () => set({ items: {} }),
  count: () => Object.values(get().items).reduce((a, b) => a + b, 0),
}));
