import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Percent } from 'lucide-react';
import { Link } from '@/contexts/RouterContext';

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  gradient: string;
  emoji: string;
}

const slides: Slide[] = [
  {
    title: 'تقسيط الموبايلات حتى 12 شهر',
    subtitle: 'اشتري موبايلك الآن وادفع على شهور بدون ضمانة — مقدم يبدأ من 10%',
    cta: 'احسب التقسيط',
    link: '/installment',
    gradient: 'from-brand-600 via-brand-500 to-brand-700',
    emoji: '📱',
  },
  {
    title: 'خصومات تصل إلى 25%',
    subtitle: 'عروض خاصة على مجموعة واسعة من الموبايلات لفترة محدودة',
    cta: 'تصفح العروض',
    link: '/products?sale=1',
    gradient: 'from-accent-500 via-accent-600 to-orange-700',
    emoji: '🔥',
  },
  {
    title: 'أحدث آيفون 15 برو ماكس',
    subtitle: 'الآن متوفر بضمان وكيل وتوصيل مجاني لكل مصر',
    cta: 'تسوق الآن',
    link: '/iphone',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    emoji: '✨',
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="relative h-[320px] sm:h-[380px] lg:h-[440px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <div className={`relative h-full w-full bg-gradient-to-bl ${slide.gradient}`}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)',
              }} />
              <div className="container-app relative flex h-full items-center">
                <div className="max-w-xl text-white animate-slide-up">
                  <div className="mb-3 text-5xl">{slide.emoji}</div>
                  <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-3 text-sm text-white/90 sm:text-base">{slide.subtitle}</p>
                  <Link
                    to={slide.link}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition-transform hover:scale-105"
                  >
                    {slide.cta}
                    <ShoppingCart className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
        aria-label="السابق"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
        aria-label="التالي"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`شريحة ${i + 1}`}
          />
        ))}
      </div>

      {/* Trust badge */}
      <div className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur sm:flex">
        <Percent className="h-3.5 w-3.5" /> أفضل الأسعار في مصر
      </div>
    </div>
  );
}
