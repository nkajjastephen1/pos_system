import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}
export function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  return <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatCurrency(item.product.price)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors rounded-l-md" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.quantity}
          </span>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors rounded-r-md disabled:opacity-50" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-[80px] text-right font-medium text-slate-900 dark:text-slate-100">
          {formatCurrency(item.product.price * item.quantity)}
        </div>

        <button onClick={() => onRemove(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>;
}