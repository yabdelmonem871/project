import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="text-lg font-bold text-slate-700 dark:text-slate-200">لا توجد منتجات مطابقة</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">جرّب تعديل الفلاتر أو البحث بكلمات أخرى</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
