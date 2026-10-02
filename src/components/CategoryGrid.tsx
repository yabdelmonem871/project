import { Smartphone, Apple } from 'lucide-react';
import { Link } from '@/contexts/RouterContext';
import { categories } from '@/data/categories';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {categories.map((c) => {
        const Icon = c.slug === 'iphone' ? Apple : Smartphone;
        return (
          <Link
            key={c.slug}
            to={`/${c.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-800 dark:text-brand-400">
              <Icon className="h-7 w-7" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
