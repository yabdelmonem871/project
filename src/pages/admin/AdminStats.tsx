import { TrendingUp, DollarSign, Package, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/products';
import { formatPriceWithCurrency } from '@/utils/format';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';

export default function AdminStats({ tab }: { tab: AdminTab }) {
  const { orders } = useAuth();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Top products by rating
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  // Brand distribution
  const brandCount = new Map<string, number>();
  products.forEach((p) => brandCount.set(p.brand, (brandCount.get(p.brand) ?? 0) + 1));
  const brandStats = Array.from(brandCount.entries()).sort((a, b) => b[1] - a[1]);
  const maxBrand = Math.max(...brandStats.map((b) => b[1]));

  const stats = [
    { label: 'إجمالي المبيعات', value: formatPriceWithCurrency(totalRevenue), icon: DollarSign },
    { label: 'متوسط قيمة الطلب', value: formatPriceWithCurrency(avgOrder), icon: TrendingUp },
    { label: 'عدد الطلبات', value: orders.length, icon: ShoppingCart },
    { label: 'عدد المنتجات', value: products.length, icon: Package },
  ];

  return (
    <AdminLayout active={tab}>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">الإحصائيات والمبيعات</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Brand distribution */}
        <div className="card p-5">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">توزيع المنتجات حسب الشركة</h3>
          <div className="space-y-3">
            {brandStats.map(([brand, count]) => (
              <div key={brand}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{brand}</span>
                  <span className="text-slate-400">{count} منتج</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${(count / maxBrand) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top rated */}
        <div className="card p-5">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">الأعلى تقييمًا</h3>
          <div className="space-y-3">
            {topRated.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.name}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400" /> {p.rating} ({p.reviewsCount})
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-600">{formatPriceWithCurrency(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
