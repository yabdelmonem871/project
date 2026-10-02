import type { Coupon, InstallmentPlan } from '@/types';

export const coupons: Coupon[] = [
  { code: 'YOUSEF10', type: 'percent', value: 10, active: true, minOrder: 5000 },
  { code: 'WELCOME500', type: 'fixed', value: 500, active: true, minOrder: 10000 },
  { code: 'FREESHIP', type: 'fixed', value: 100, active: true, minOrder: 3000 },
];

export const installmentPlans: InstallmentPlan[] = [
  { id: 'plan3', name: 'تقسيط 3 شهور', months: 3, feePercent: 5, minOrder: 3000 },
  { id: 'plan6', name: 'تقسيط 6 شهور', months: 6, feePercent: 10, minOrder: 5000 },
  { id: 'plan9', name: 'تقسيط 9 شهور', months: 9, feePercent: 15, minOrder: 8000 },
  { id: 'plan12', name: 'تقسيط 12 شهر', months: 12, feePercent: 20, minOrder: 10000 },
];
