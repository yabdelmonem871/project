import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { installmentPlans } from '@/data/coupons';
import { calculateInstallment, formatPriceWithCurrency } from '@/utils/format';

export default function InstallmentCalculatorPage() {
  const [total, setTotal] = useState(20000);
  const [downPayment, setDownPayment] = useState(5000);
  const [planId, setPlanId] = useState(installmentPlans[1].id);

  const plan = installmentPlans.find((p) => p.id === planId)!;
  const result = calculateInstallment(total, downPayment, plan.months, plan.feePercent);

  return (
    <div className="container-app py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-slate-800">
            <Calculator className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">حاسبة التقسيط</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            احسب قسطك الشهري بسهولة — اختر المبلغ والمقدم وعدد الشهور
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <div className="card p-6">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">بيانات التقسيط</h3>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  سعر المنتج (ج.م)
                </label>
                <input
                  type="number"
                  min={1000}
                  max={100000}
                  step={500}
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  className="input"
                />
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={500}
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  className="mt-2 w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  المقدم: {formatPriceWithCurrency(downPayment)}
                </label>
                <input
                  type="range"
                  min={Math.round(total * 0.1)}
                  max={Math.round(total * 0.9)}
                  step={500}
                  value={Math.min(downPayment, Math.round(total * 0.9))}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>10% ({formatPriceWithCurrency(Math.round(total * 0.1))})</span>
                  <span>90% ({formatPriceWithCurrency(Math.round(total * 0.9))})</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  عدد الشهور
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {installmentPlans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`rounded-xl border-2 py-2 text-sm font-bold transition ${
                        planId === p.id
                          ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700'
                      }`}
                    >
                      {p.months}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-400">رسوم التقسيط: {plan.feePercent}%</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="card overflow-hidden">
            <div className="bg-brand-600 p-6 text-white">
              <p className="text-sm text-white/80">القسط الشهري</p>
              <p className="mt-1 text-3xl font-extrabold">{formatPriceWithCurrency(result.monthlyAmount)}</p>
              <p className="mt-1 text-xs text-white/70">لمدة {plan.months} شهر</p>
            </div>

            <div className="space-y-3 p-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">سعر المنتج</span>
                <span className="font-semibold">{formatPriceWithCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">المقدم</span>
                <span className="font-semibold text-success-600">{formatPriceWithCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">المتبقي بعد المقدم</span>
                <span className="font-semibold">{formatPriceWithCurrency(result.remaining)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">رسوم التقسيط ({plan.feePercent}%)</span>
                <span className="font-semibold text-accent-600">{formatPriceWithCurrency(result.feeAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">إجمالي بعد المقدم + الرسوم</span>
                <span className="font-semibold">{formatPriceWithCurrency(result.totalWithFees)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-100">الإجمالي الكلي</span>
                <span className="text-lg font-extrabold text-brand-600">
                  {formatPriceWithCurrency(result.totalWithFees + downPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <Info className="h-5 w-5 shrink-0 text-brand-600" />
          <p>
            التقسيط متاح بدون ضمانة — كل ما تحتاجه هو بطاقة هوية ورقم هاتف صحيح. يتم احتساب الرسوم على المبلغ
            المتبقي بعد المقدم. الأسعار تقريبية وقد تختلف عند إتمام الطلب الفعلي.
          </p>
        </div>
      </div>
    </div>
  );
}
