import { useState } from 'react';
import { Mail, Lock, User, Smartphone, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Link, useRouter } from '@/contexts/RouterContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    const result = register(name.trim(), email.trim(), password);
    setLoading(false);
    if (result.ok) {
      toast('تم إنشاء الحساب بنجاح');
      navigate('/account');
    } else {
      setError(result.error ?? 'خطأ غير معروف');
    }
  };

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
              <Smartphone className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">حساب جديد</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">انضم إلى يوسف فون واستمتع بعروضنا</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-error-50 px-4 py-3 text-sm font-semibold text-error-600 dark:bg-error-500/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">الاسم بالكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input !pr-10"
                  placeholder="محمد أحمد"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input !pr-10"
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input !pr-10"
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input !pr-10"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <Link to="/" className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
