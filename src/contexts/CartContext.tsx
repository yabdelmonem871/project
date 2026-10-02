import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { CartItem } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  removeFromCart: (productId: string, color: string, storage: string) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function sameLine(a: CartItem, productId: string, color: string, storage: string) {
  return a.productId === productId && a.color === color && a.storage === storage;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('yp-cart', []);

  const addToCart = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find((p) => sameLine(p, item.productId, item.color, item.storage));
        if (existing) {
          return prev.map((p) =>
            sameLine(p, item.productId, item.color, item.storage)
              ? { ...p, quantity: p.quantity + item.quantity }
              : p,
          );
        }
        return [...prev, item];
      });
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (productId: string, color: string, storage: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((p) =>
            sameLine(p, productId, color, storage) ? { ...p, quantity: Math.max(1, quantity) } : p,
          )
          .filter((p) => p.quantity > 0),
      );
    },
    [setItems],
  );

  const removeFromCart = useCallback(
    (productId: string, color: string, storage: string) => {
      setItems((prev) => prev.filter((p) => !sameLine(p, productId, color, storage)));
    },
    [setItems],
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, count, subtotal }),
    [items, addToCart, updateQuantity, removeFromCart, clearCart, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
