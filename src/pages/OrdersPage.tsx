import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@/contexts/RouterContext';
import { formatPriceWithCurrency, cn } from '@/utils/format';
import type { Order } from '@/types';

const statusConfig: Record<Order['status'], { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'قيد المعالجة', icon: Clock, color: 'text-warning-500 bg-warning-100 dark:bg-warning-500/20' },
  processing: { label: 'قيد التجهيز', icon: Clock, color: 'text-brand-600 bg-brand-100 dark:bg-brand-500/20' },
  shipped: { label: 'تم الشحن', icon: Truck, color: 'text-brand-600 bg-brand-100 dark:bg-brand-500/20' },
  delivered: { label: 'تم التوصيل', icon: CheckCircle2, color: 'text-success-600 bg-success-100 dark:bg-success-500/20' },
  cancelled: { label: 'ملغي', icon: XCircle, color: 'text-error-500 bg-error-100 dark:bg-error-500/20' },
};

export default function OrdersPage() {
  const { user, orders } = useAuth();

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">يجب تسجيل الدخول</h1>
        <Link to="/login" className="btn-primary mt-4">تسجيل الدخول</Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Package className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-slate-100">لا توجد طلبات</h1>
        <p className="mt-2 text-sm text-slate-500">لم تقم بأي طلبات بعد</p>
        <Link to="/products" className="btn-primary mt-6">ابدأ التسوق</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">طلباتي</h1>

      <div className="space-y-4">
        {orders.map((o) => {
          const cfg = statusConfig[o.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={o.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{o.id}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={cn('badge', cfg.color)}>
                  <StatusIcon className="h-3.5 w-3.5" /> {cfg.label}
                </span>
              </div>

              <div className="p-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="text-slate-500">طريقة الدفع: </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {o.paymentMethod === 'full' ? 'دفع كامل' : 'تقسيط'}
                    </span>
                    {o.installment && (
                      <span className="text-slate-400"> · {formatPriceWithCurrency(o.installment.monthlyAmount)}/شهر</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400">الإجمالي</p>
                    <p className="text-lg font-extrabold text-brand-600">{formatPriceWithCurrency(o.total)}</p>
                  </div>
                </div>

                {/* Tracking */}
                <div className="mt-4 flex items-center gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered'] as const).map((s, i) => {
                    const active = ['pending', 'processing', 'shipped', 'delivered'].indexOf(o.status) >= i;
                    const Icon = statusConfig[s].icon;
                    return (
                      <div key={s} className="flex flex-1 items-center">
                        <div className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition',
                          active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-slate-300 dark:border-slate-700',
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {i < 3 && <div className={cn('h-0.5 flex-1', active ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700')} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/products" className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> مواصلة التسوق
      </Link>
    </div>
  );
}
