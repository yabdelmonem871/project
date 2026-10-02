import { useEffect, useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  ChevronLeft,
} from 'lucide-react';
import { products } from '@/data/products';
import { useRouter, Link } from '@/contexts/RouterContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/contexts/ToastContext';
import {
  calculateDiscount,
  formatPriceWithCurrency,
  cn,
} from '@/utils/format';
import Rating from '@/components/ui/Rating';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/ui/Modal';
import type { CartItem } from '@/types';

export default function ProductDetailPage() {
  const { path, navigate } = useRouter();
  const productId = path.split('/').pop() ?? '';
  const product = products.find((p) => p.id === productId);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [selectedRam, setSelectedRam] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(0);
    setSelectedStorage(0);
    setSelectedRam(0);
    setQuantity(1);
  }, [productId]);

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">المنتج غير موجود</p>
        <Link to="/products" className="btn-primary mt-4">العودة للمنتجات</Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.oldPrice);
  const wished = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const buildCartItem = (): CartItem => ({
    productId: product.id,
    name: product.name,
    image: product.images[0],
    price: product.price,
    color: product.colors[selectedColor]?.name ?? '',
    storage: product.storages[selectedStorage] ?? '',
    ram: product.rams[selectedRam] ?? '',
    quantity,
  });

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(buildCartItem());
    toast('تمت إضافة المنتج إلى السلة');
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(buildCartItem());
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wished ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة', 'info');
  };

  return (
    <div className="container-app py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <a href="#/" className="hover:text-brand-600">الرئيسية</a>
        <span>/</span>
        <Link to={`/${product.category}`} className="hover:text-brand-600">
          {product.category === 'iphone' ? 'آيفون' : product.brand}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="card overflow-hidden">
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover animate-fade-in"
              />
              {discount > 0 && (
                <span className="badge absolute right-4 top-4 bg-error-500 text-white shadow">
                  خصم {discount}%
                </span>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-xl border-2 transition',
                    selectedImage === i
                      ? 'border-brand-600'
                      : 'border-transparent opacity-70 hover:opacity-100',
                  )}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{product.brand}</span>
            {product.isNew && <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">جديد</span>}
            {product.featured && <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">مميز</span>}
          </div>

          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} reviewsCount={product.reviewsCount} size="md" />
            <span className="text-sm text-slate-500 dark:text-slate-400">|</span>
            <span className={cn('text-sm font-semibold', outOfStock ? 'text-error-500' : 'text-success-600 dark:text-success-500')}>
              {outOfStock ? 'غير متوفر' : `متوفر (${product.stock} قطعة)`}
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatPriceWithCurrency(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg text-slate-400 line-through">
                {formatPriceWithCurrency(product.oldPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400">
                وفّر {formatPriceWithCurrency(product.oldPrice! - product.price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                اللون: <span className="font-normal text-slate-500">{product.colors[selectedColor]?.name}</span>
              </h4>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={cn(
                      'h-10 w-10 rounded-full border-2 transition',
                      selectedColor === i ? 'border-brand-600 ring-2 ring-brand-500/30' : 'border-slate-200 dark:border-slate-700',
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Storage */}
          {product.storages.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">التخزين</h4>
              <div className="flex flex-wrap gap-2">
                {product.storages.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStorage(i)}
                    className={cn(
                      'rounded-xl border-2 px-4 py-2 text-sm font-semibold transition',
                      selectedStorage === i
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-slate-200 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:text-slate-300',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RAM */}
          {product.rams.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">الذاكرة (RAM)</h4>
              <div className="flex flex-wrap gap-2">
                {product.rams.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRam(i)}
                    className={cn(
                      'rounded-xl border-2 px-4 py-2 text-sm font-semibold transition',
                      selectedRam === i
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-slate-200 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:text-slate-300',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center text-slate-500 hover:text-brand-600"
                disabled={outOfStock}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-800 dark:text-slate-100">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="grid h-11 w-11 place-items-center text-slate-500 hover:text-brand-600"
                disabled={outOfStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="btn-outline flex-1 !py-3"
            >
              <ShoppingCart className="h-5 w-5" /> أضف للسلة
            </button>

            <button
              onClick={handleWishlist}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-xl border-2 transition',
                wished
                  ? 'border-error-500 bg-error-50 text-error-500 dark:bg-error-500/10'
                  : 'border-slate-200 text-slate-400 hover:border-error-300 dark:border-slate-700',
              )}
            >
              <Heart className={cn('h-5 w-5', wished && 'fill-error-500')} />
            </button>
          </div>

          <button
            onClick={() => setBuyNowOpen(true)}
            disabled={outOfStock}
            className="btn-accent mt-3 w-full !py-3"
          >
            <Check className="h-5 w-5" /> اشترِ الآن
          </button>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'توصيل سريع' },
              { icon: ShieldCheck, label: 'ضمان وكيل' },
              { icon: RotateCcw, label: 'استرجاع 14 يوم' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-900">
                <b.icon className="h-5 w-5 text-brand-600" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-extrabold text-slate-900 dark:text-white">المواصفات الكاملة</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries({
                'الشاشة': product.specs.screen,
                'المعالج': product.specs.processor,
                'الذاكرة (RAM)': product.specs.ram,
                'التخزين': product.specs.storage,
                'البطارية': product.specs.battery,
                'الكاميرا الخلفية': product.specs.rearCamera,
                'الكاميرا الأمامية': product.specs.frontCamera,
                'نظام التشغيل': product.specs.os,
                'الشبكة': product.specs.network,
                'الوزن': product.specs.weight,
                'الأبعاد': product.specs.dimensions,
                'الضمان': product.specs.warranty,
              }).map(([key, val], i) => (
                <tr
                  key={key}
                  className={cn(i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50')}
                >
                  <td className="w-1/3 px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{key}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">منتجات ذات صلة</h2>
            <Link to={`/${product.category}`} className="flex items-center gap-1 text-sm font-semibold text-brand-600">
              عرض الكل <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Buy now modal */}
      <Modal open={buyNowOpen} onClose={() => setBuyNowOpen(false)} title="تأكيد الشراء السريع" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{product.name}</p>
              <p className="text-sm text-brand-600">{formatPriceWithCurrency(product.price * quantity)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
            <p>اللون: {product.colors[selectedColor]?.name}</p>
            <p>التخزين: {product.storages[selectedStorage]}</p>
            <p>الكمية: {quantity}</p>
          </div>
          <button
            onClick={() => {
              setBuyNowOpen(false);
              handleBuyNow();
            }}
            className="btn-accent w-full"
          >
            متابعة إلى الدفع
          </button>
        </div>
      </Modal>
    </div>
  );
}
