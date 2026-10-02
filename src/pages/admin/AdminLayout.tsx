import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Calculator,
  BarChart3,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Link, useRouter } from '@/contexts/RouterContext';
import { cn } from '@/utils/format';

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'plans' | 'stats';

interface AdminLayoutProps {
  active: AdminTab;
  children: ReactNode;
}

const menu: { tab: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { tab: 'dashboard', label: 'لوحة المعلومات', icon: LayoutDashboard },
  { tab: 'products', label: 'المنتجات', icon: Package },
  { tab: 'orders', label: 'الطلبات', icon: ShoppingCart },
  { tab: 'customers', label: 'العملاء', icon: Users },
  { tab: 'coupons', label: 'الكوبونات', icon: Tag },
  { tab: 'plans', label: 'خطط التقسيط', icon: Calculator },
  { tab: 'stats', label: 'الإحصائيات', icon: BarChart3 },
];

export default function AdminLayout({ active, children }: AdminLayoutProps) {
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-5">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">لوحة التحكم</h2>
          <p className="text-xs text-brand-600">يوسف فون</p>
        </div>
        <button onClick={() => setOpen(false)} className="btn-ghost !p-2 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {menu.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.tab}
              onClick={() => { navigate(`/admin?tab=${m.tab}`); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                active === m.tab
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              <Icon className="h-5 w-5" />
              {m.label}
            </button>
          );
        })}
      </nav>
      <div className="p-3">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" /> العودة للمتجر
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">لوحة التحكم</h2>
        <button onClick={() => setOpen(true)} className="btn-ghost !p-2">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-slate-900 animate-fade-in-fast">
              {sidebar}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
