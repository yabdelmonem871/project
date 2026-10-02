import { ArrowLeft, Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import { Link } from '@/contexts/RouterContext';
import { products } from '@/data/products';

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const onSale = products.filter((p) => p.onSale).slice(0, 8);

  return (
    <div className="container-app py-6">
      <HeroSlider />

      {/* Features bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Truck, title: 'توصيل سريع', desc: 'لكل محافظات مصر' },
          { icon: ShieldCheck, title: 'ضمان وكيل', desc: 'منتجات أصلية 100%' },
          { icon: Headphones, title: 'دعم 24/7', desc: 'خدمة عملاء على مدار الساعة' },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-slate-900">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{f.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">تسوق حسب القسم</h2>
        </div>
        <CategoryGrid />
      </section>

      {/* Featured */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">منتجات مميزة</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all">
            عرض الكل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Newest */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">أحدث المنتجات</h2>
          <Link to="/products?sort=newest" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all">
            عرض الكل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Sale banner */}
      <section className="mt-10">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-accent-500 to-accent-600 p-8 text-center text-white">
          <h2 className="font-display text-2xl font-extrabold">عروض الأسبوع</h2>
          <p className="mt-2 text-white/90">خصومات تصل إلى 25% على مجموعة واسعة من الموبايلات</p>
          <Link
            to="/products?sale=1"
            className="mt-4 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-accent-600 shadow-lg transition-transform hover:scale-105"
          >
            تسوق العروض الآن
          </Link>
        </div>
      </section>

      {/* On Sale */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">خصومات وعروض</h2>
          <Link to="/products?sale=1" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all">
            عرض الكل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {onSale.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
