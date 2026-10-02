import { useState } from 'react';
import { User, Mail, Phone, Package, Heart, LogOut, Edit3, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from '@/contexts/RouterContext';
import { formatPriceWithCurrency } from '@/utils/format';

export default function AccountPage() {
  const { user, logout, updateProfile, orders } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">يجب تسجيل الدخول</h1>
        <Link to="/login" className="btn-primary mt-4">تسجيل الدخول</Link>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({ name, phone });
    setEditing(false);
    toast('تم تحديث البيانات بنجاح');
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">حسابي</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">البيانات الشخصية</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost !p-2">
                <Edit3 className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={handleSave} className="btn-ghost !p-2 text-success-600">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => { setEditing(false); setName(user.name); setPhone(user.phone ?? ''); }} className="btn-ghost !p-2 text-error-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-slate-800">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                {editing ? (
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input !py-2" />
                ) : (
                  <>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400">الاسم</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-700 dark:text-slate-200" dir="ltr">{user.email}</p>
                <p className="text-xs text-slate-400">البريد الإلكتروني</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                <Phone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                {editing ? (
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input !py-2" placeholder="01012345678" dir="ltr" />
                ) : (
                  <>
                    <p className="font-semibold text-slate-700 dark:text-slate-200" dir="ltr">{user.phone || 'غير محدد'}</p>
                    <p className="text-xs text-slate-400">رقم الهاتف</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => { logout(); toast('تم تسجيل الخروج', 'info'); }}
            className="btn-outline mt-6 w-full text-error-600 hover:!border-error-300 hover:!bg-error-50"
          >
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>

        {/* Quick links + recent orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/orders" className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">طلباتي</p>
                <p className="text-xs text-slate-400">{orders.length} طلب</p>
              </div>
            </Link>
            <Link to="/wishlist" className="card flex items-center gap-3 p-4 hover:shadow-card-hover transition">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-50 text-accent-600 dark:bg-slate-800">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">المفضلة</p>
                <p className="text-xs text-slate-400">المنتجات المحفوظة</p>
              </div>
            </Link>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">أحدث الطلبات</h3>
              <Link to="/orders" className="text-sm font-semibold text-brand-600">عرض الكل</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">لا توجد طلبات بعد</p>
                <Link to="/products" className="btn-primary mt-3">ابدأ التسوق</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{o.id}</p>
                      <p className="text-xs text-slate-400">{o.items.length} منتج · {o.status === 'pending' ? 'قيد المعالجة' : o.status}</p>
                    </div>
                    <span className="font-bold text-brand-600">{formatPriceWithCurrency(o.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
