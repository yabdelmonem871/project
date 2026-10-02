export type CategorySlug = 'iphone' | 'android' | 'samsung' | 'xiaomi' | 'oppo' | 'realme' | 'honor';

export interface Category {
  slug: CategorySlug;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export interface ProductSpec {
  screen: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  rearCamera: string;
  frontCamera: string;
  os: string;
  network: string;
  weight: string;
  dimensions: string;
  warranty: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  storages: string[];
  rams: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  description: string;
  specs: ProductSpec;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  color: string;
  storage: string;
  ram: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    notes?: string;
  };
  paymentMethod: 'full' | 'installment';
  installment?: {
    downPayment: number;
    months: number;
    monthlyFee: number;
    monthlyAmount: number;
    total: number;
  };
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  minOrder?: number;
}

export interface InstallmentPlan {
  id: string;
  name: string;
  months: number;
  feePercent: number;
  minOrder: number;
}
