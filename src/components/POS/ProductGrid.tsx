import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Input } from '../ui/Input';
import { usePOS } from '../../context/POSContext';
interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}
const CATEGORIES = [{
  id: 'all',
  label: 'All'
}, {
  id: 'electronics',
  label: 'Electronics'
}, {
  id: 'clothing',
  label: 'Clothing'
}, {
  id: 'food',
  label: 'Food'
}, {
  id: 'home',
  label: 'Home'
}, {
  id: 'other',
  label: 'Other'
}];
export function ProductGrid({
  onAddToCart
}: ProductGridProps) {
  const {
    products
  } = usePOS();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  return <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Input placeholder="Search products by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="h-4 w-4" />} className="w-full" />

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeCategory === cat.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
              `}>
              {cat.label}
            </button>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
        </div>
        {filteredProducts.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 mt-10">
            <p>No products found.</p>
          </div>}
      </div>
    </div>;
}