import type { Product } from '@/types';
import { products as allProducts } from '@/data/products';
import type { FilterState } from '@/components/Filters';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export function filterAndSortProducts(
  category: string | null,
  filters: FilterState,
  sort: SortOption,
  searchQuery?: string,
  saleOnly?: boolean,
): Product[] {
  let list = [...allProducts];

  if (category === 'android') {
    list = list.filter((p) => p.category !== 'iphone');
  } else if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.name.includes(searchQuery),
    );
  }

  if (filters.brands.length > 0) {
    list = list.filter((p) => filters.brands.includes(p.brand));
  }
  if (filters.rams.length > 0) {
    list = list.filter((p) => p.rams.some((r) => filters.rams.includes(r)));
  }
  if (filters.storages.length > 0) {
    list = list.filter((p) => p.storages.some((s) => filters.storages.includes(s)));
  }
  if (filters.minRating > 0) {
    list = list.filter((p) => p.rating >= filters.minRating);
  }
  list = list.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

  if (saleOnly) {
    list = list.filter((p) => p.onSale);
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'featured':
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return list;
}

export function getUniqueBrands(): string[] {
  return [...new Set(allProducts.map((p) => p.brand))].sort();
}

export function getUniqueRams(): string[] {
  return [...new Set(allProducts.flatMap((p) => p.rams))].sort((a, b) => {
    const na = parseInt(a);
    const nb = parseInt(b);
    return na - nb;
  });
}

export function getUniqueStorages(): string[] {
  return [...new Set(allProducts.flatMap((p) => p.storages))].sort((a, b) => {
    const na = parseInt(a);
    const nb = parseInt(b);
    return na - nb;
  });
}
