import { Smartphone, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from '@/contexts/RouterContext';
import { categories } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">يوسف فون</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              متجرك الأول لشراء الموبايلات أونلاين في مصر بأفضل الأسعار وإمكانية التقسيط وتوصيل سريع لكل المحافظات.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">الأقسام</h4>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/${c.slug}`} className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">مساعدة</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/policy/shipping" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">سياسة الشحن</Link></li>
              <li><Link to="/policy/returns" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">سياسة الاسترجاع</Link></li>
              <li><Link to="/policy/privacy" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">سياسة الخصوصية</Link></li>
              <li><Link to="/policy/terms" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">الشروط والأحكام</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">تواصل معنا</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="h-4 w-4 text-brand-600" /> 01000000000
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4 text-brand-600" /> info@yousefphone.com
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-brand-600" /> القاهرة، مصر
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-xs text-slate-400">© 2026 يوسف فون. جميع الحقوق محفوظة.</p>
          <p className="text-xs text-slate-400">طرق الدفع: كاش · تقسيط · فيزا · ماستركارد</p>
        </div>
      </div>
    </footer>
  );
}
