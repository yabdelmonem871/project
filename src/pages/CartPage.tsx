import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from '@/contexts/RouterContext';
import { formatPriceWithCurrency } from '@/utils/format';
import { coupons } from '@/data/coupons';
import type { Coupon } from '@/types';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const shipping = subtotal > 0 ? (subtotal >= 15000 ? 0 : 100) : 0;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = () => {
    const found = coupons.find((c) => c.code === couponCode.trim().toUpperCase() && c.active);
    if (!found) {
      toast('كوبون غير صالح', 'error');
      return;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      toast(`الحد الأدنى للطلب ${found.minOrder} ج.م`, 'error');
      return;
    }
    setAppliedCoupon(found);
    toast('تم تطبيق الكوبون بنجاح');
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <ShoppingCart className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-slate-100">سلة التسوق فارغة</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">لم تقم بإضافة أي منتجات بعد</p>
        <Link to="/products" className="btn-primary mt-6">
          ابدأ التسوق <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">سلة التسوق</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.storage}`}
                className="card flex gap-4 p-4"
              >
                <Link to={`/product/${item.productId}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-bold text-slate-800 hover:text-brand-600 dark:text-slate-100">
                        {item.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {item.color && <span>اللون: {item.color}</span>}
                        {item.storage && <span>التخزين: {item.storage}</span>}
                        {item.ram && <span>RAM: {item.ram}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.color, item.storage);
                        toast('تم حذف المنتج', 'info');
                      }}
                      className="text-slate-400 hover:text-error-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateQuantity(item.productId, item.color, item.storage, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center text-slate-500 hover:text-brand-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.color, item.storage, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center text-slate-500 hover:text-brand-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        {formatPriceWithCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-slate-400">{formatPriceWithCurrency(item.price)} / قطعة</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              clearCart();
              setAppliedCoupon(null);
              toast('تم تفريغ السلة', 'info');
            }}
            className="mt-4 text-sm font-semibold text-error-500 hover:underline"
          >
            تفريغ السلة
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">ملخص الطلب</h3>

            {/* Coupon */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                كوبون خصم
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="YOUSEF10"
                    className="input !pr-9 text-sm"
                  />
                </div>
                <button onClick={applyCoupon} className="btn-outline !px-4 text-sm">تطبيق</button>
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-xs font-semibold text-success-600">
                  تم تطبيق {appliedCoupon.code} ✓
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">جرّب: YOUSEF10 أو WELCOME500</p>
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">المجموع الفرعي</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{formatPriceWithCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>الخصم</span>
                  <span>-{formatPriceWithCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">الشحن</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {shipping === 0 ? 'مجاني' : formatPriceWithCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && subtotal < 15000 && (
                <p className="text-xs text-brand-600">
                  أضف {formatPriceWithCurrency(15000 - subtotal)} للحصول على شحن مجاني!
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-100">الإجمالي</span>
              <span className="text-xl font-extrabold text-brand-600">{formatPriceWithCurrency(total)}</span>
            </div>

            <Link to="/checkout" className="btn-primary mt-5 w-full">
              إتمام الطلب <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link to="/products" className="btn-ghost mt-2 w-full text-sm">
              مواصلة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
