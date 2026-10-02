import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceWithCurrency, cn } from '@/utils/format';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import { useToast } from '@/contexts/ToastContext';
import type { Order } from '@/types';

const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusLabels: Record<Order['status'], string> = {
  pending: 'قيد المعالجة',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

export default function AdminOrders({ tab }: { tab: AdminTab }) {
  const { orders, updateOrderStatus } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout active={tab}>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">إدارة الطلبات</h1>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn('rounded-lg px-4 py-2 text-sm font-semibold transition', filter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}
        >
          الكل ({orders.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn('rounded-lg px-4 py-2 text-sm font-semibold transition', filter === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}
          >
            {statusLabels[s]} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-slate-400">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{o.id}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString('ar-EG')} · {o.customer.name} · {o.customer.phone}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-brand-600">{formatPriceWithCurrency(o.total)}</p>
                  <p className="text-xs text-slate-400">{o.paymentMethod === 'full' ? 'دفع كامل' : 'تقسيط'}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">الحالة:</span>
                <select
                  value={o.status}
                  onChange={(e) => {
                    updateOrderStatus(o.id, e.target.value as Order['status']);
                    toast('تم تحديث حالة الطلب');
                  }}
                  className="input !w-auto !py-1.5 text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                {o.items.map((item, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.name}</p>
                      <p className="text-[10px] text-slate-400">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
