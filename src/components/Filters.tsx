import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterState {
  brands: string[];
  rams: string[];
  storages: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export const defaultFilters: FilterState = {
  brands: [],
  rams: [],
  storages: [],
  minPrice: 0,
  maxPrice: 100000,
  minRating: 0,
};

interface FiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  brands: string[];
  rams: string[];
  storages: string[];
}

export default function Filters({ filters, onChange, brands, rams, storages }: FiltersProps) {
  const [open, setOpen] = useState(false);

  const toggle = (key: 'brands' | 'rams' | 'storages', value: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const reset = () => onChange(defaultFilters);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-100 py-4 dark:border-slate-800">
      <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">{title}</h4>
      {children}
    </div>
  );

  const CheckItem = ({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 py-1.5 text-sm text-slate-600 dark:text-slate-300"
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded border transition ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'
        }`}
      >
        {checked && <span className="text-[10px]">✓</span>}
      </span>
      {label}
    </button>
  );

  const content = (
    <div>
      <Section title="الشركة">
        <div className="space-y-0.5">
          {brands.map((b) => (
            <CheckItem
              key={b}
              label={b}
              checked={filters.brands.includes(b)}
              onClick={() => toggle('brands', b)}
            />
          ))}
        </div>
      </Section>

      <Section title="السعر (ج.م)">
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-brand-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>0 ج.م</span>
            <span className="font-bold text-brand-600">حتى {filters.maxPrice.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      </Section>

      <Section title="الذاكرة (RAM)">
        <div className="space-y-0.5">
          {rams.map((r) => (
            <CheckItem
              key={r}
              label={r}
              checked={filters.rams.includes(r)}
              onClick={() => toggle('rams', r)}
            />
          ))}
        </div>
      </Section>

      <Section title="التخزين">
        <div className="space-y-0.5">
          {storages.map((s) => (
            <CheckItem
              key={s}
              label={s}
              checked={filters.storages.includes(s)}
              onClick={() => toggle('storages', s)}
            />
          ))}
        </div>
      </Section>

      <Section title="التقييم">
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: r })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filters.minRating === r
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {r === 0 ? 'الكل' : `${r}★ فأكثر`}
            </button>
          ))}
        </div>
      </Section>

      <button onClick={reset} className="btn-outline mt-4 w-full !py-2 text-xs">
        إعادة ضبط الفلاتر
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-outline !py-2 text-sm lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" /> الفلاتر
      </button>

      <aside className="hidden lg:block">
        <div className="card sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">الفلاتر</h3>
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          </div>
          {content}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 right-0 max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-slate-900 animate-slide-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">الفلاتر</h3>
              <button onClick={() => setOpen(false)} className="btn-ghost !p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
            <button onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
              عرض النتائج
            </button>
          </div>
        </div>
      )}
    </>
  );
}
