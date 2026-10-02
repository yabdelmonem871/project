import { useState } from 'react';
import { Mail, Lock, Smartphone, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Link, useRouter } from '@/contexts/RouterContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(email.trim(), password);
    setLoading(false);
    if (result.ok) {
      toast('تم تسجيل الدخول بنجاح');
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
            <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">أهلاً بعودتك إلى يوسف فون</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-error-50 px-4 py-3 text-sm font-semibold text-error-600 dark:bg-error-500/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              إنشاء حساب جديد
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
