import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import Filters, { defaultFilters, type FilterState } from '@/components/Filters';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import {
  filterAndSortProducts,
  getUniqueBrands,
  getUniqueRams,
  getUniqueStorages,
  type SortOption,
} from '@/utils/productFilters';
import { useRouter } from '@/contexts/RouterContext';
import { categories } from '@/data/categories';

interface ProductListPageProps {
  category?: string | null;
  title?: string;
  subtitle?: string;
}

export default function ProductListPage({ category = null, title, subtitle }: ProductListPageProps) {
  const { query } = useRouter();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('featured');
  const [loading, setLoading] = useState(true);

  const brands = useMemo(() => getUniqueBrands(), []);
  const rams = useMemo(() => getUniqueRams(), []);
  const storages = useMemo(() => getUniqueStorages(), []);

  const searchQuery = query.q;
  const saleOnly = query.sale === '1';

  useEffect(() => {
    if (query.sort) setSort(query.sort as SortOption);
  }, [query.sort]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [category, filters, sort, searchQuery, saleOnly]);

  const result = useMemo(
    () => filterAndSortProducts(category, filters, sort, searchQuery, saleOnly),
    [category, filters, sort, searchQuery, saleOnly],
  );

  const cat = category ? categories.find((c) => c.slug === category) : null;
  const pageTitle = title ?? cat?.name ?? 'كل المنتجات';
  const pageSubtitle = subtitle ?? cat?.description ?? 'تصفح تشكيلتنا الكاملة من الموبايلات';

  return (
    <div className="container-app py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <a href="#/" className="hover:text-brand-600">الرئيسية</a>
        <span>/</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{pageTitle}</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{pageTitle}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{pageSubtitle}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-64 lg:shrink-0">
          <Filters
            filters={filters}
            onChange={setFilters}
            brands={brands}
            rams={rams}
            storages={storages}
          />
        </div>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-100">{result.length}</span> منتج
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="input !w-auto !py-2 text-sm"
              >
                <option value="featured">الأكثر تميزًا</option>
                <option value="newest">الأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييمًا</option>
              </select>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid products={result} />
          )}
        </div>
      </div>
    </div>
  );
}
