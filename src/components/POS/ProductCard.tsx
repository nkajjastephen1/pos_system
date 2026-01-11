import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}
export function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  return <motion.div whileHover={!isOutOfStock ? {
    scale: 1.02
  } : {}} whileTap={!isOutOfStock ? {
    scale: 0.98
  } : {}} className="h-full">
      <Card className={`
          h-full cursor-pointer transition-all hover:shadow-md flex flex-col overflow-hidden
          ${isOutOfStock ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:border-emerald-500/50 dark:hover:border-emerald-500/50'}
        `} onClick={() => !isOutOfStock && onAddToCart(product)}>
        <div className="h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-4xl font-bold text-slate-300 dark:text-slate-600">
              {product.name.charAt(0)}
            </span>}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(product.price)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isOutOfStock ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>;
}