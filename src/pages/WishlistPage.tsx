import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from '@/contexts/RouterContext';
import { products } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';

export default function WishlistPage() {
  const { items } = useWishlist();
  const wished = products.filter((p) => items.some((w) => w.productId === p.id));

  if (wished.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Heart className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-slate-100">قائمة المفضلة فارغة</h1>
        <p className="mt-2 text-sm text-slate-500">لم تقم بإضافة أي منتجات للمفضلة بعد</p>
        <Link to="/products" className="btn-primary mt-6">
          تصفح المنتجات <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        المفضلة <span className="text-base font-normal text-slate-400">({wished.length} منتج)</span>
      </h1>
      <ProductGrid products={wished} />
    </div>
  );
}
