import { Tag, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { coupons as initialCoupons } from '@/data/coupons';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/utils/format';
import type { Coupon } from '@/types';

export default function AdminCoupons({ tab }: { tab: AdminTab }) {
  const { toast } = useToast();
  const [list, setList] = useState<Coupon[]>(initialCoupons);

  const toggleActive = (code: string) => {
    setList((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
    toast('تم تحديث الكوبون');
  };

  const handleDelete = (code: string) => {
    setList((prev) => prev.filter((c) => c.code !== code));
    toast('تم حذف الكوبون', 'info');
  };

  return (
    <AdminLayout active={tab}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">الكوبونات والخصومات</h1>
        <button onClick={() => toast('إضافة كوبون جديد - قريبًا', 'info')} className="btn-primary">
          <Plus className="h-4 w-4" /> إضافة كوبون
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <div key={c.code} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-600 dark:bg-slate-800">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100" dir="ltr">{c.code}</p>
                  <p className="text-xs text-slate-400">
                    {c.type === 'percent' ? `خصم ${c.value}%` : `خصم ${c.value} ج.م`}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.code)} className="btn-ghost !p-2 text-error-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {c.minOrder && (
              <p className="mt-3 text-xs text-slate-500">الحد الأدنى: {c.minOrder} ج.م</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className={cn('badge', c.active ? 'bg-success-100 text-success-600 dark:bg-success-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
                {c.active ? 'مفعّل' : 'معطّل'}
              </span>
              <button
                onClick={() => toggleActive(c.code)}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                {c.active ? 'تعطيل' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
