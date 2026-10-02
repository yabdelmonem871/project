import { useEffect, useState } from 'react';
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
  Smartphone,
} from 'lucide-react';
import { Link, useRouter } from '@/contexts/RouterContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { cn } from '@/utils/format';

export default function Header() {
  const { navigate, path } = useRouter();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [path]);

  const searchResults =
    searchQuery.trim().length > 1
      ? products
          .filter((p) => p.name.includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5)
      : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (slug: string) => path === `/${slug}` || path.startsWith(`/${slug}`);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/90 shadow-sm backdrop-blur-lg dark:bg-slate-950/90'
            : 'bg-white dark:bg-slate-950',
        )}
      >
        <div className="container-app">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">يوسف فون</span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">Yousef Phone</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              <Link to="/" className={cn('btn-ghost !py-2 text-sm', path === '/' && 'text-brand-600')}>
                الرئيسية
              </Link>
              <Link to="/products" className={cn('btn-ghost !py-2 text-sm', isActive('products') && 'text-brand-600')}>
                كل المنتجات
              </Link>
              {categories.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}`}
                  className={cn('btn-ghost !py-2 text-sm', isActive(c.slug) && 'text-brand-600')}
                >
                  {c.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="btn-ghost !p-2"
                aria-label="بحث"
              >
                <Search className="h-5 w-5" />
              </button>
              <button onClick={toggleTheme} className="btn-ghost !p-2" aria-label="الوضع الليلي">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/wishlist" className="btn-ghost relative !p-2" aria-label="المفضلة">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="btn-ghost relative !p-2" aria-label="السلة">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to={user ? '/account' : '/login'} className="btn-ghost !p-2" aria-label="الحساب">
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="btn-ghost !p-2 lg:hidden"
                aria-label="القائمة"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="border-t border-slate-100 py-3 dark:border-slate-800 animate-fade-in-fast">
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن موبايل..."
                  className="input !pr-11"
                />
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                {searchResults.length > 0 && (
                  <div className="absolute inset-x-0 top-full z-50 mt-2 card p-2">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{p.name}</p>
                          <p className="text-xs text-brand-600 dark:text-brand-400">{p.price} ج.م</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden animate-fade-in-fast">
            <nav className="container-app flex flex-col gap-1">
              <Link to="/" className="btn-ghost justify-start !py-2.5 text-sm">الرئيسية</Link>
              <Link to="/products" className="btn-ghost justify-start !py-2.5 text-sm">كل المنتجات</Link>
              {categories.map((c) => (
                <Link key={c.slug} to={`/${c.slug}`} className="btn-ghost justify-start !py-2.5 text-sm">
                  {c.name}
                </Link>
              ))}
              <Link to="/installment" className="btn-ghost justify-start !py-2.5 text-sm">حاسبة التقسيط</Link>
              {user ? (
                <>
                  <Link to="/account" className="btn-ghost justify-start !py-2.5 text-sm">حسابي</Link>
                  <Link to="/orders" className="btn-ghost justify-start !py-2.5 text-sm">طلباتي</Link>
                </>
              ) : (
                <Link to="/login" className="btn-ghost justify-start !py-2.5 text-sm">تسجيل الدخول</Link>
              )}
              <Link to="/admin" className="btn-ghost justify-start !py-2.5 text-sm text-brand-600">لوحة التحكم</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
