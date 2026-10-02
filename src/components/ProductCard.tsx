import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { calculateDiscount, formatPriceWithCurrency, cn } from '@/utils/format';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from '@/contexts/RouterContext';
import Rating from '@/components/ui/Rating';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const wished = isWishlisted(product.id);
  const discount = calculateDiscount(product.price, product.oldPrice);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      color: product.colors[0]?.name ?? '',
      storage: product.storages[0] ?? '',
      ram: product.rams[0] ?? '',
      quantity: 1,
    });
    toast('تمت إضافة المنتج إلى السلة');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wished ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة', 'info');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group card flex flex-col overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            outOfStock && 'opacity-50',
          )}
        />
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-error-500 text-white shadow-sm">-{discount}%</span>
          )}
          {product.isNew && <span className="badge bg-brand-600 text-white shadow-sm">جديد</span>}
          {!product.isNew && product.featured && (
            <span className="badge bg-accent-500 text-white shadow-sm">مميز</span>
          )}
        </div>
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110 dark:bg-slate-800/90',
            wished ? 'text-error-500' : 'text-slate-400',
          )}
          aria-label="المفضلة"
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-error-500')} />
        </button>
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="badge bg-slate-800/80 px-4 py-1 text-sm text-white">نفذ المخزون</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-slate-900/60 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-1 text-xs font-semibold text-white">
            <Eye className="h-4 w-4" /> عرض التفاصيل
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{product.brand}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          {product.name}
        </h3>
        <div className="mt-2">
          <Rating value={product.rating} reviewsCount={product.reviewsCount} />
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            {formatPriceWithCurrency(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatPriceWithCurrency(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {product.stock > 0 ? (
            <span className="text-success-600 dark:text-success-500">متوفر في المخزون</span>
          ) : (
            <span className="text-error-500">غير متوفر</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="btn-primary mt-3 w-full !py-2 text-xs"
        >
          <ShoppingCart className="h-4 w-4" />
          أضف إلى السلة
        </button>
      </div>
    </Link>
  );
}
