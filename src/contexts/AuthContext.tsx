import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Order, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface StoredUser extends User {
  password: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<StoredUser[]>('yp-users', []);
  const [user, setUser] = useLocalStorage<User | null>('yp-current-user', null);
  const [orders, setOrders] = useLocalStorage<Order[]>('yp-orders', []);

  const login = useCallback(
    (email: string, password: string): { ok: boolean; error?: string } => {
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      const { password: _pw, ...safe } = found;
      void _pw;
      setUser(safe);
      return { ok: true };
    },
    [users, setUser],
  );

  const register = useCallback(
    (name: string, email: string, password: string): { ok: boolean; error?: string } => {
      if (users.some((u) => u.email === email)) return { ok: false, error: 'هذا البريد مسجل بالفعل' };
      const newUser: StoredUser = {
        id: `u${Date.now()}`,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      const { password: _pw, ...safe } = newUser;
      void _pw;
      setUser(safe);
      return { ok: true };
    },
    [users, setUsers, setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const updateProfile = useCallback(
    (data: Partial<Pick<User, 'name' | 'phone'>>) => {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
      setUsers((prev) =>
        prev.map((u) => (user && u.email === user.email ? { ...u, ...data } : u)),
      );
    },
    [setUser, setUsers, user],
  );

  const addOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    },
    [setOrders],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order['status']) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    },
    [setOrders],
  );

  const value = useMemo(
    () => ({ user, login, register, logout, updateProfile, orders, addOrder, updateOrderStatus }),
    [user, login, register, logout, updateProfile, orders, addOrder, updateOrderStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
