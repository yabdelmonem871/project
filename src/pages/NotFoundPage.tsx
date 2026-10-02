import { Home, Search } from 'lucide-react';
import { Link } from '@/contexts/RouterContext';

export default function NotFoundPage() {
  return (
    <div className="container-app py-20 text-center">
      <div className="mx-auto max-w-md">
        <p className="font-display text-8xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          عذرًا، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" /> الصفحة الرئيسية
          </Link>
          <Link to="/products" className="btn-outline">
            <Search className="h-4 w-4" /> تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
