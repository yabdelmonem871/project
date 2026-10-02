import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from '@/contexts/RouterContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
              <Mail className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">استعادة كلمة المرور</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              أدخل بريدك وسنرسل لك تعليمات الاستعادة
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-100 dark:bg-success-500/20">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
              </div>
              <p className="mt-4 font-bold text-slate-800 dark:text-slate-100">تم إرسال التعليمات</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                تحقق من بريدك الإلكتروني لاستعادة كلمة المرور
              </p>
              <Link to="/login" className="btn-primary mt-6 w-full">العودة لتسجيل الدخول</Link>
            </div>
          ) : (
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
              <button type="submit" className="btn-primary w-full">إرسال التعليمات</button>
            </form>
          )}

          <Link to="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
