import { Calculator, Plus } from 'lucide-react';
import { installmentPlans } from '@/data/coupons';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import { useToast } from '@/contexts/ToastContext';
import { formatPriceWithCurrency } from '@/utils/format';

export default function AdminPlans({ tab }: { tab: AdminTab }) {
  const { toast } = useToast();

  return (
    <AdminLayout active={tab}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">خطط التقسيط</h1>
        <button onClick={() => toast('إضافة خطة جديدة - قريبًا', 'info')} className="btn-primary">
          <Plus className="h-4 w-4" /> إضافة خطة
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {installmentPlans.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                <Calculator className="h-5 w-5" />
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">عدد الشهور</span>
                <span className="font-semibold">{p.months} شهر</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رسوم التقسيط</span>
                <span className="font-semibold text-accent-600">{p.feePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الحد الأدنى للطلب</span>
                <span className="font-semibold">{formatPriceWithCurrency(p.minOrder)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
