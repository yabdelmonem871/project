import { useState } from 'react';
import { Plus, Edit3, Trash2, Search, X } from 'lucide-react';
import { products as allProducts } from '@/data/products';
import { formatPriceWithCurrency, cn } from '@/utils/format';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import type { Product } from '@/types';

export default function AdminProducts({ tab }: { tab: AdminTab }) {
  const { toast } = useToast();
  const [list, setList] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = list.filter((p) => p.name.includes(search) || p.brand.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (p: Product) => {
    setList((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });
    setEditing(null);
    setOpen(false);
    toast('تم حفظ المنتج بنجاح');
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
    toast('تم حذف المنتج', 'info');
  };

  return (
    <AdminLayout active={tab}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">إدارة المنتجات</h1>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> إضافة منتج
        </button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="input !pr-9"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">المنتج</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">الشركة</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">السعر</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">المخزون</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-50 dark:border-slate-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.brand}</td>
                  <td className="px-4 py-3 font-bold text-brand-600">{formatPriceWithCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('badge', p.stock < 10 ? 'bg-error-100 text-error-600 dark:bg-error-500/20' : 'bg-success-100 text-success-600 dark:bg-success-500/20')}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditing(p); setOpen(true); }}
                        className="btn-ghost !p-2 text-brand-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn-ghost !p-2 text-error-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductEditModal
        open={open}
        product={editing}
        onClose={() => { setOpen(false); setEditing(null); }}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

function ProductEditModal({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [price, setPrice] = useState(product?.price ?? 0);
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);

  // Reset when opening
  if (open && product && name !== product.name && brand !== product.brand) {
    // only sync on open transition
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'تعديل المنتج' : 'إضافة منتج'} size="md">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">اسم المنتج</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">الشركة</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="input" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">المخزون</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">السعر (ج.م)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">السعر القديم (اختياري)</label>
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(Number(e.target.value))} className="input" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              const base = product ?? allProducts[0];
              onSave({
                ...base,
                name,
                brand,
                price,
                oldPrice: oldPrice || undefined,
                stock,
              });
            }}
            className="btn-primary flex-1"
          >
            حفظ
          </button>
          <button onClick={onClose} className="btn-outline">
            <X className="h-4 w-4" /> إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}
