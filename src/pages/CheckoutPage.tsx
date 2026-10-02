import { useState } from 'react';
import { Check, CreditCard, Wallet, Calculator, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Link, useRouter } from '@/contexts/RouterContext';
import { formatPriceWithCurrency, generateOrderId } from '@/utils/format';
import { installmentPlans } from '@/data/coupons';
import { calculateInstallment } from '@/utils/format';
import type { Order } from '@/types';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { toast } = useToast();
  const { navigate } = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installment'>('full');
  const [downPayment, setDownPayment] = useState(Math.round(subtotal * 0.2));
  const [planId, setPlanId] = useState(installmentPlans[0].id);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<Order | null>(null);

  const shipping = subtotal >= 15000 ? 0 : 100;
  const plan = installmentPlans.find((p) => p.id === planId)!;
  const installment = paymentMethod === 'installment'
    ? calculateInstallment(subtotal + shipping, downPayment, plan.months, plan.feePercent)
    : null;
  const total = paymentMethod === 'installment' ? installment!.totalWithFees + downPayment + shipping : subtotal + shipping;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    else if (!/^01[0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'رقم هاتف غير صحيح (مثال: 01012345678)';
    if (!form.address.trim()) e.address = 'العنوان مطلوب';
    if (!form.city.trim()) e.city = 'المدينة مطلوبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast('السلة فارغة', 'error');
      return;
    }
    if (!validate()) {
      toast('يرجى تعبئة البيانات المطلوبة', 'error');
      return;
    }
    if (paymentMethod === 'installment' && downPayment < plan.minOrder * 0.1) {
      toast('المقدم منخفض جدًا', 'error');
      return;
    }

    const order: Order = {
      id: generateOrderId(),
      items,
      customer: { ...form },
      paymentMethod,
      installment: paymentMethod === 'installment'
        ? {
            downPayment,
            months: plan.months,
            monthlyFee: installment!.feeAmount,
            monthlyAmount: installment!.monthlyAmount,
            total,
          }
        : undefined,
      subtotal,
      shipping,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    setPlaced(order);
    toast('تم إنشاء طلبك بنجاح!');
    window.scrollTo({ top: 0 });
  };

  if (placed) {
    return (
      <div className="container-app py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success-100 dark:bg-success-500/20">
          <Check className="h-10 w-10 text-success-600" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">تم استلام طلبك بنجاح!</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          رقم الطلب: <span className="font-bold text-brand-600">{placed.id}</span>
        </p>
        <div className="mx-auto mt-6 max-w-md card p-6 text-right">
          <h3 className="mb-3 font-bold text-slate-800 dark:text-slate-100">تفاصيل الطلب</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">المنتجات</span><span>{placed.items.length} قطعة</span></div>
            <div className="flex justify-between"><span className="text-slate-500">طريقة الدفع</span><span>{placed.paymentMethod === 'full' ? 'دفع كامل' : 'تقسيط'}</span></div>
            {placed.installment && (
              <>
                <div className="flex justify-between"><span className="text-slate-500">المقدم</span><span>{formatPriceWithCurrency(placed.installment.downPayment)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">القسط الشهري</span><span>{formatPriceWithCurrency(placed.installment.monthlyAmount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">عدد الشهور</span><span>{placed.installment.months} شهر</span></div>
              </>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-2 dark:border-slate-800"><span className="font-bold">الإجمالي</span><span className="font-extrabold text-brand-600">{formatPriceWithCurrency(placed.total)}</span></div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/orders" className="btn-primary">تتبع الطلب</Link>
          <Link to="/products" className="btn-outline">مواصلة التسوق</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">لا يمكن إتمام الطلب</h1>
        <p className="mt-2 text-sm text-slate-500">سلتك فارغة</p>
        <Link to="/products" className="btn-primary mt-6">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">إتمام الطلب</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer info */}
          <div className="card p-5">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">بيانات العميل</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">الاسم بالكامل *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  placeholder="محمد أحمد"
                />
                {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">رقم الهاتف *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                  placeholder="01012345678"
                  dir="ltr"
                />
                {errors.phone && <p className="mt-1 text-xs text-error-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">المدينة *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input"
                  placeholder="القاهرة"
                />
                {errors.city && <p className="mt-1 text-xs text-error-500">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-500">العنوان بالتفصيل *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input"
                  placeholder="الشارع، المبنى، الشقة"
                />
                {errors.address && <p className="mt-1 text-xs text-error-500">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-500">ملاحظات (اختياري)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input min-h-20"
                  placeholder="أي تعليمات إضافية للتوصيل"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-5">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">طريقة الدفع</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPaymentMethod('full')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-right transition ${
                  paymentMethod === 'full'
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Wallet className={`h-6 w-6 ${paymentMethod === 'full' ? 'text-brand-600' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">دفع كامل / كاش</p>
                  <p className="text-xs text-slate-500">ادفع المبلغ كامل عند الاستلام</p>
                </div>
                {paymentMethod === 'full' && <Check className="mr-auto h-5 w-5 text-brand-600" />}
              </button>
              <button
                onClick={() => setPaymentMethod('installment')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-right transition ${
                  paymentMethod === 'installment'
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Calculator className={`h-6 w-6 ${paymentMethod === 'installment' ? 'text-brand-600' : 'text-slate-400'}`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">تقسيط</p>
                  <p className="text-xs text-slate-500">ادفع على شهور بدون ضمانة</p>
                </div>
                {paymentMethod === 'installment' && <Check className="mr-auto h-5 w-5 text-brand-600" />}
              </button>
            </div>

            {/* Installment options */}
            {paymentMethod === 'installment' && (
              <div className="mt-4 space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 animate-fade-in">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">خطة التقسيط</label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="input"
                  >
                    {installmentPlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - رسوم {p.feePercent}%
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    المقدم: {formatPriceWithCurrency(downPayment)}
                  </label>
                  <input
                    type="range"
                    min={Math.round(subtotal * 0.1)}
                    max={Math.round(subtotal * 0.9)}
                    step={500}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>10%</span>
                    <span>90%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                    <p className="text-xs text-slate-500">المتبقي بعد المقدم</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{formatPriceWithCurrency(installment!.remaining)}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 dark:bg-slate-900">
                    <p className="text-xs text-slate-500">رسوم التقسيط</p>
                    <p className="font-bold text-accent-600">{formatPriceWithCurrency(installment!.feeAmount)}</p>
                  </div>
                  <div className="col-span-2 rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                    <p className="text-xs text-slate-500">القسط الشهري ({plan.months} شهر)</p>
                    <p className="text-lg font-extrabold text-brand-600">{formatPriceWithCurrency(installment!.monthlyAmount)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card sticky top-20 p-5">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">ملخص الطلب</h3>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.storage}`} className="flex items-center gap-2 text-sm">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-400">×{item.quantity}</p>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatPriceWithCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex justify-between"><span className="text-slate-500">المجموع الفرعي</span><span>{formatPriceWithCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">الشحن</span><span>{shipping === 0 ? 'مجاني' : formatPriceWithCurrency(shipping)}</span></div>
              {paymentMethod === 'installment' && (
                <div className="flex justify-between text-accent-600"><span>رسوم التقسيط</span><span>{formatPriceWithCurrency(installment!.feeAmount)}</span></div>
              )}
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-100">الإجمالي</span>
              <span className="text-xl font-extrabold text-brand-600">{formatPriceWithCurrency(total)}</span>
            </div>

            {paymentMethod === 'installment' && (
              <div className="mt-3 rounded-lg bg-accent-50 p-3 text-center dark:bg-accent-500/10">
                <p className="text-xs text-slate-500">المقدم المطلوب</p>
                <p className="text-lg font-extrabold text-accent-600">{formatPriceWithCurrency(downPayment)}</p>
              </div>
            )}

            <button onClick={handlePlaceOrder} className="btn-primary mt-5 w-full">
              <CreditCard className="h-4 w-4" /> تأكيد الطلب
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" /> دفع آمن ومشفّر
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
