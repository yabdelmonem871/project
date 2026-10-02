export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)} ج.م`;
}

export function calculateDiscount(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function calculateInstallment(
  total: number,
  downPayment: number,
  months: number,
  feePercent: number,
): {
  remaining: number;
  totalWithFees: number;
  feeAmount: number;
  monthlyAmount: number;
} {
  const remaining = Math.max(0, total - downPayment);
  const feeAmount = (remaining * feePercent) / 100;
  const totalWithFees = remaining + feeAmount;
  const monthlyAmount = months > 0 ? totalWithFees / months : 0;
  return { remaining, totalWithFees, feeAmount, monthlyAmount };
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\w-]/g, '')
    .toLowerCase();
}

export function generateOrderId(): string {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `YP-${stamp}-${rand}`;
}
