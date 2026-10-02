import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import { formatPriceWithCurrency } from '@/utils/format';

export default function AdminCustomers({ tab }: { tab: AdminTab }) {
  const { orders } = useAuth();

  // Build customer list from orders
  const customerMap = new Map<string, { name: string; phone: string; email: string; orders: number; total: number }>();
  orders.forEach((o) => {
    const key = o.customer.phone || o.customer.email;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orders++;
      existing.total += o.total;
    } else {
      customerMap.set(key, {
        name: o.customer.name,
        phone: o.customer.phone,
        email: o.customer.email,
        orders: 1,
        total: o.total,
      });
    }
  });

  const customers = Array.from(customerMap.values());

  return (
    <AdminLayout active={tab}>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">العملاء</h1>

      {customers.length === 0 ? (
        <div className="card py-16 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-400">لا يوجد عملاء بعد</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-slate-800">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                  <p className="text-xs text-slate-400">عميل</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span dir="ltr">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span dir="ltr">{c.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  <span>{c.orders} طلب</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-xs text-slate-500">إجمالي المشتريات</span>
                <span className="font-bold text-brand-600">{formatPriceWithCurrency(c.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
