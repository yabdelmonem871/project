import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/products';
import { formatPriceWithCurrency } from '@/utils/format';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';

export default function AdminDashboard({ tab }: { tab: AdminTab }) {
  const { orders } = useAuth();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const lowStock = products.filter((p) => p.stock < 15);

  const stats = [
    { label: 'إجمالي المبيعات', value: formatPriceWithCurrency(totalRevenue), icon: DollarSign, color: 'bg-brand-50 text-brand-600 dark:bg-slate-800' },
    { label: 'الطلبات', value: orders.length, icon: ShoppingCart, color: 'bg-accent-50 text-accent-600 dark:bg-slate-800' },
    { label: 'المنتجات', value: products.length, icon: Package, color: 'bg-success-50 text-success-600 dark:bg-slate-800' },
    { label: 'طلبات معلقة', value: pendingCount, icon: Clock, color: 'bg-warning-50 text-warning-600 dark:bg-slate-800' },
  ];

  return (
    <AdminLayout active={tab}>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">لوحة المعلومات</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="mt-6 card p-5">
        <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">أحدث الطلبات</h3>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-3 py-2 text-right font-semibold text-slate-500">رقم الطلب</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-500">العميل</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-500">الإجمالي</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-500">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 dark:border-slate-800/50">
                    <td className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-200">{o.id}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{o.customer.name}</td>
                    <td className="px-3 py-3 font-bold text-brand-600">{formatPriceWithCurrency(o.total)}</td>
                    <td className="px-3 py-3">
                      <span className="badge bg-warning-100 text-warning-600 dark:bg-warning-500/20">{o.status === 'pending' ? 'معلق' : o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low stock */}
      <div className="mt-6 card p-5">
        <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">منتجات قليلة المخزون</h3>
        <div className="space-y-2">
          {lowStock.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
              </div>
              <span className={`badge ${p.stock < 10 ? 'bg-error-100 text-error-600 dark:bg-error-500/20' : 'bg-warning-100 text-warning-600 dark:bg-warning-500/20'}`}>
                {p.stock} قطعة
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
