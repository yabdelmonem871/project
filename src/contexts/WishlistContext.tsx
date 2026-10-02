import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { WishlistItem } from '@/types';

interface WishlistContextValue {
  items: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<WishlistItem[]>('yp-wishlist', []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const exists = prev.some((p) => p.productId === productId);
        if (exists) return prev.filter((p) => p.productId !== productId);
        return [...prev, { productId, addedAt: new Date().toISOString() }];
      });
    },
    [setItems],
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((p) => p.productId === productId),
    [items],
  );

  const clearWishlist = useCallback(() => setItems([]), [setItems]);
  const count = items.length;

  const value = useMemo(
    () => ({ items, toggleWishlist, isWishlisted, clearWishlist, count }),
    [items, toggleWishlist, isWishlisted, clearWishlist, count],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
