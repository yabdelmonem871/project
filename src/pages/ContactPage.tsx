import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast('تم إرسال رسالتك، سنرد عليك قريبًا');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">تواصل معنا</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">الهاتف</p>
                <p className="text-sm text-slate-500" dir="ltr">01000000000</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">البريد</p>
                <p className="text-sm text-slate-500" dir="ltr">info@yousefphone.com</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">العنوان</p>
                <p className="text-sm text-slate-500">المنصورة، مصر</p>
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/201553637990"
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-3 p-5 transition hover:shadow-card-hover"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">واتساب</p>
              <p className="text-sm text-slate-500">تواصل معنا مباشرة</p>
            </div>
          </a>
        </div>

        {/* Form */}
        <div className="card p-6">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100">أرسل رسالة</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">الاسم</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="اسمك"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">الرسالة</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input min-h-28"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send className="h-4 w-4" /> إرسال
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
