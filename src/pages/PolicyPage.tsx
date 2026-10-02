import { ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/contexts/RouterContext';

const policies: Record<string, { title: string; content: { heading: string; text: string }[] }> = {
  shipping: {
    title: 'سياسة الشحن',
    content: [
      { heading: 'مناطق التوصيل', text: 'نقوم بالتوصيل لكل محافظات مصر بدون استثناء.' },
      { heading: 'مدة التوصيل', text: 'القاهرة والجيزة: 1-2 يوم عمل. باقي المحافظات: 2-4 أيام عمل.' },
      { heading: 'رسوم الشحن', text: 'الشحن مجاني للطلبات فوق 15,000 ج.م. للطلبات أقل من ذلك رسوم الشحن 100 ج.م.' },
      { heading: 'تتبع الطلب', text: 'يمكنك تتبع حالة طلبك من صفحة "طلباتي" في حسابك.' },
    ],
  },
  returns: {
    title: 'سياسة الاسترجاع',
    content: [
      { heading: 'مدة الاسترجاع', text: 'يمكنك استرجاع المنتج خلال 14 يوم من تاريخ الاستلام.' },
      { heading: 'شروط الاسترجاع', text: 'يجب أن يكون المنتج بحالته الأصلية مع جميع ملحقاته والتغليف.' },
      { heading: 'طريقة الاسترجاع', text: 'تواصل معنا عبر واتساب أو الهاتف لبدء عملية الاسترجاع.' },
      { heading: 'استرداد المبلغ', text: 'يتم استرداد المبلغ خلال 5-7 أيام عمل بعد استلام المنتج المعاد.' },
    ],
  },
  privacy: {
    title: 'سياسة الخصوصية',
    content: [
      { heading: 'جمع البيانات', text: 'نجمع بياناتك (الاسم، الهاتف، العنوان) لإتمام الطلبات فقط.' },
      { heading: 'استخدام البيانات', text: 'لا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية.' },
      { heading: 'الأمان', text: 'نستخدم بروتوكولات تشفير لحماية بياناتك الشخصية.' },
      { heading: 'حقوقك', text: 'يمكنك طلب حذف حسابك وبياناتك في أي وقت.' },
    ],
  },
  terms: {
    title: 'الشروط والأحكام',
    content: [
      { heading: 'استخدام الموقع', text: 'باستخدامك لموقع يوسف فون فإنك توافق على هذه الشروط.' },
      { heading: 'الأسعار', text: 'الأسعار بالجنيه المصري وقابلة للتغيير دون إشعار مسبق.' },
      { heading: 'التقسيط', text: 'يخضع التقسيط للموافقة ويحتاج بطاقة هوية ورقم هاتف صحيح.' },
      { heading: 'الضمان', text: 'جميع المنتجات أصلية بضمان وكيل معتمد.' },
    ],
  },
};

export default function PolicyPage() {
  const { path } = useRouter();
  const slug = path.split('/').pop() ?? 'shipping';
  const policy = policies[slug] ?? policies.shipping;

  return (
    <div className="container-app py-6">
      <Link to="/" className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> العودة للرئيسية
      </Link>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{policy.title}</h1>
      <div className="card max-w-3xl p-6">
        <div className="space-y-6">
          {policy.content.map((s, i) => (
            <div key={i}>
              <h3 className="mb-2 font-bold text-slate-800 dark:text-slate-100">{s.heading}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
